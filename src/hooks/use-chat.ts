import { UmojaLinnChat } from '@/types/project';
import { useEffect, useRef, useState } from 'react'
import { database } from "@/lib/firebase";

import { sendChatInProject } from "@/actions/project";
import { ref, onValue, get, push } from "firebase/database";
import { jsonToFormData } from '@/lib/utils';
import useHandleError from './useHandleError';
import {  base62ToUuidSafe } from '@/lib/uuid';

import { useSession } from 'next-auth/react';

 export const useChat = (
	projectId: string
) => {
	const { data: session } = useSession();
	const [data, setData] = useState<UmojaLinnChat[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [previewMedia, setPreviewMedia] = useState<{type: string, url: string}[]>([]);
	const [images, setImages] = useState<File[]>([]);

	const [activeCallParticipants, setActiveCallParticipants] = useState<number>(0);
	const [isUserInCall, setIsUserInCall] = useState<boolean>(false);
	const [activeCallSessionId, setActiveCallSessionId] = useState<string | null>(null);
	const latestMessagesRef = useRef<UmojaLinnChat[]>([]);
	const previousSessionIdRef = useRef<string | null>(null);

	const { handleError } = useHandleError("Send Chat");

	useEffect(() => {
		// Reference to the specific collection in the database
		const chatPath = base62ToUuidSafe(projectId);
		const collectionRef = ref(database, `chats/${chatPath}/messages`);
		const activeCallRef = ref(database, `chats/${chatPath}/active_call`);

		// Listen for messages
		const unSubscribeMessages = onValue(collectionRef, (snapshot) => {
			const dataItem: Record<string, UmojaLinnChat> | null = snapshot.val();

			if (dataItem) {
				const displayItem = Object.values(dataItem);
				setData(displayItem);
				latestMessagesRef.current = displayItem;
			} else {
				setData([]);
				latestMessagesRef.current = [];
			}
		});

		// Listen for active call metadata and participants
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

			// Watchdog fallback: if a call session disappears without CALL_END, emit one once.
			const previousSessionId = previousSessionIdRef.current;
			const callJustEnded = previousSessionId && !currentSessionId;

			if (callJustEnded) {
				const hasCallEnd = latestMessagesRef.current.some(
					(chat) => chat.type === "CALL_END" && chat.sessionId === previousSessionId
				);

				if (!hasCallEnd) {
					const latestMessagesSnapshot = await get(collectionRef);
					const latestMessages =
						Object.values((latestMessagesSnapshot.val() || {}) as Record<string, UmojaLinnChat>);
					const stillMissingCallEnd = !latestMessages.some(
						(chat) => chat.type === "CALL_END" && chat.sessionId === previousSessionId
					);

					if (stillMissingCallEnd) {
						const callStartedAt =
							latestMessages
								.filter((chat) => chat.type === "CALL_JOIN" && chat.sessionId === previousSessionId)
								.sort(
									(a, b) =>
										new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
								)[0]?.createdAt;
						const endTimestamp = new Date().toISOString();
						const durationSeconds = callStartedAt
							? Math.max(
								0,
								Math.floor(
									(new Date(endTimestamp).getTime() - new Date(callStartedAt).getTime()) / 1000
								)
							)
							: undefined;

						await push(collectionRef, {
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
		isUserInCall,
	}
}

