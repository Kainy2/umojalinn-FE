import { UmojaLinnChat } from "@/types/project";
import { useEffect, useRef, useState } from "react";
import { database } from "@/lib/firebase";

import { sendChatInProject } from "@/actions/project";
import { ref, onValue, get, push } from "firebase/database";
import { jsonToFormData } from "@/lib/utils";
import useHandleError from "./useHandleError";
import { base62ToUuidSafe } from "@/lib/uuid";

import { useSession } from "next-auth/react";

type TEndedCallDuration = {
  endedAt?: string | Date;
  callDurationSeconds?: number;
};

const sortByCreatedAt = (messages: UmojaLinnChat[]) =>
  messages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

export const useChat = (projectId: string) => {
  const { data: session } = useSession();
  const [data, setData] = useState<UmojaLinnChat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [previewMedia, setPreviewMedia] = useState<{ type: string; url: string }[]>(
    [],
  );
  const [images, setImages] = useState<File[]>([]);

  const [activeCallParticipants, setActiveCallParticipants] = useState<number>(0);
  const [isUserInCall, setIsUserInCall] = useState<boolean>(false);
  const [activeCallSessionId, setActiveCallSessionId] = useState<string | null>(null);
  const [endedCallDurations, setEndedCallDurations] = useState<
    Record<string, TEndedCallDuration>
  >({});
  const latestCallEventsRef = useRef<UmojaLinnChat[]>([]);
  const latestMessagesCountRef = useRef<number>(0);
  const previousSessionIdRef = useRef<string | null>(null);

  const { handleError } = useHandleError("Send Chat");

  useEffect(() => {
    const chatPath = base62ToUuidSafe(projectId);
    const messagesRef = ref(database, `chats/${chatPath}/messages`);
    const callEventsRef = ref(database, `chats/${chatPath}/call_events`);
    const activeCallRef = ref(database, `chats/${chatPath}/active_call`);

    let latestMessages: UmojaLinnChat[] = [];
    let latestCallEvents: UmojaLinnChat[] = [];

    const mergeAndSetData = () => {
      const visibleCallEvents = latestCallEvents.filter(
        (chat) => chat.type !== "CALL_END",
      );
      const merged = sortByCreatedAt([...latestMessages, ...visibleCallEvents]);
      setData(merged);
    };

    const deriveEndedCallDurations = (events: UmojaLinnChat[]) => {
      const durations: Record<string, TEndedCallDuration> = {};
      events.forEach((event) => {
        if (event.type === "CALL_END" && event.sessionId) {
          durations[event.sessionId] = {
            endedAt: event.endedAt,
            callDurationSeconds: event.callDurationSeconds,
          };
        }
      });
      setEndedCallDurations(durations);
    };

    const unSubscribeMessages = onValue(messagesRef, (snapshot) => {
      const dataItem: Record<string, UmojaLinnChat> | null = snapshot.val();
      latestMessages = dataItem ? Object.values(dataItem) : [];
      const nextCount = latestMessages.length;

      if (
        latestMessagesCountRef.current > 0 &&
        nextCount < latestMessagesCountRef.current
      ) {
        console.warn("Messages count shrank", {
          chatPath,
          previousCount: latestMessagesCountRef.current,
          nextCount,
        });
      }
      latestMessagesCountRef.current = nextCount;

      mergeAndSetData();
    });

    const unSubscribeCallEvents = onValue(callEventsRef, (snapshot) => {
      const dataItem: Record<string, UmojaLinnChat> | null = snapshot.val();
      latestCallEvents = dataItem ? Object.values(dataItem) : [];
      latestCallEventsRef.current = latestCallEvents;
      deriveEndedCallDurations(latestCallEvents);
      mergeAndSetData();
    });

    const unSubscribeCall = onValue(activeCallRef, async (snapshot) => {
      const activeCall = snapshot.val();
      const participants = activeCall?.participants;
      const currentSessionId = activeCall?.sessionId ?? null;
      setActiveCallSessionId(currentSessionId);

      if (participants) {
        const participantIds = Object.keys(participants);
        setActiveCallParticipants(participantIds.length);
        setIsUserInCall(participantIds.includes(session?.user?.id as string));
      } else {
        setActiveCallParticipants(0);
        setIsUserInCall(false);
      }

      const previousSessionId = previousSessionIdRef.current;
      const callJustEnded = previousSessionId && !currentSessionId;

      if (callJustEnded) {
        const hasCallEnd = latestCallEventsRef.current.some(
          (chat) => chat.type === "CALL_END" && chat.sessionId === previousSessionId,
        );

        if (!hasCallEnd) {
          const latestCallEventsSnapshot = await get(callEventsRef);
          const latestEvents = Object.values(
            (latestCallEventsSnapshot.val() || {}) as Record<string, UmojaLinnChat>,
          );
          const stillMissingCallEnd = !latestEvents.some(
            (chat) => chat.type === "CALL_END" && chat.sessionId === previousSessionId,
          );

          if (stillMissingCallEnd) {
            const callStartedAt = latestEvents
              .filter(
                (chat) =>
                  chat.type === "CALL_JOIN" && chat.sessionId === previousSessionId,
              )
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )[0]?.createdAt;
            const endTimestamp = new Date().toISOString();
            const durationSeconds = callStartedAt
              ? Math.max(
                  0,
                  Math.floor(
                    (new Date(endTimestamp).getTime() -
                      new Date(callStartedAt).getTime()) /
                      1000,
                  ),
                )
              : undefined;

            await push(callEventsRef, {
              type: "CALL_END",
              sessionId: previousSessionId,
              endedAt: endTimestamp,
              callDurationSeconds: durationSeconds,
              createdAt: endTimestamp,
              user: {
                id: session?.user?.id || "",
                firstName: session?.user?.firstName || "User",
                lastName: session?.user?.lastName || "",
                profilePhotoUri: null,
              },
            } satisfies UmojaLinnChat);
          }
        }
      }

      previousSessionIdRef.current = currentSessionId;
    });

    return () => {
      unSubscribeMessages();
      unSubscribeCallEvents();
      unSubscribeCall();
    };
  }, [projectId, session?.user?.firstName, session?.user?.id, session?.user?.lastName]);

  const handleSend = async () => {
    try {
      setLoading(true);
      await sendChatInProject(projectId, jsonToFormData({ message, images }));
      setMessage("");
      setImages([]);
      setPreviewMedia([]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    handleSend,
    loading,
    message,
    setMessage,
    previewMedia,
    setPreviewMedia,
    images,
    setImages,
    isCallActive: activeCallParticipants > 0,
    activeCallSessionId,
    endedCallDurations,
    isUserInCall,
  };
};
