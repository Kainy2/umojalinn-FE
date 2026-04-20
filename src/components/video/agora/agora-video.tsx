"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack
} from "agora-rtc-sdk-ng";
import { Mic, MicOff, Video as VideoIcon, VideoOff, ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createAgoraConfig, validateAgoraConfig } from "./config";
import ChatWindow from "@/section/dashboard/project/ChatWindow";
import useClipboard from "@/hooks/useClipboard";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";

import { useSendCallNotification } from "@/tanstack/hooks/useUser";
import { database } from "@/lib/firebase";
import { ref, push, set, remove, onDisconnect } from "firebase/database";
import { base62ToUuidSafe } from "@/lib/uuid";
import { formatDate } from "date-fns";

type AgoraVideoProps = {
  channelId: string;
};

type RemoteUser = {
  uid: string | number;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
};

export function AgoraVideo({ channelId }: AgoraVideoProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: projectData } = useGetProjectById(channelId);
  const { mutate: sendNotification } = useSendCallNotification();

  // Agora state
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);

  // UI state
  const [isInCall, setIsInCall] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null); // Blocking errors (mic)
  const [cameraWarning, setCameraWarning] = useState<string | null>(null); // Non-blocking warnings

  // Call timing state
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0); // in seconds

  // Fetch project data to get other participant info
  const project = projectData?.data?.data;

  // Get current user data (same pattern as topbar)
  const { data: meData } = useGetMe();
  const me = meData?.data?.data;

  // Determine other participant based on session role
  const currentUserRole = session?.user?.profileRole;
  const isCurrentUserBuyer = currentUserRole === "BUYER";
  const otherParticipant = isCurrentUserBuyer
    ? project?.designer?.user
    : project?.buyer?.user;

  // Participant info for waiting screen
  const participantName = otherParticipant
    ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
    : "User";
  const participantAvatar = otherParticipant?.profilePhotoUri;

  // Set CSS variable for topbar height
  useEffect(() => {
    const topbar = document.querySelector('[data-topbar]') || document.querySelector('header');
    if (topbar) {
      const height = topbar.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--topbar-height', `${height}px`);
    } else {
      // Fallback if topbar not found
      document.documentElement.style.setProperty('--topbar-height', '64px');
    }
  }, []);

  // Helper function to get user-friendly error messages
  const getDeviceErrorMessage = (
    error: Error,
    deviceType: 'camera' | 'microphone'
  ): string => {
    const errorName = error.name;
    const errorMessage = error.message;

    const isNotAllowed = errorName === 'NotAllowedError' ||
      errorMessage.includes('NotAllowedError') ||
      errorMessage.includes('Permission denied');

    const isNotFound = errorName === 'NotFoundError' ||
      errorMessage.includes('NotFoundError') ||
      errorMessage.includes('not found');

    const isNotReadable = errorName === 'NotReadableError' ||
      errorMessage.includes('NotReadableError') ||
      errorMessage.includes('already in use');

    if (deviceType === 'camera') {
      if (isNotAllowed) {
        return "Camera access denied. You'll join with audio only. To enable camera, click the camera icon in your browser's address bar.";
      }
      if (isNotFound) {
        return "No camera detected. You'll join with audio only.";
      }
      if (isNotReadable) {
        return "Camera is in use by another application. You'll join with audio only.";
      }
      return "Camera unavailable. You'll join with audio only.";
    } else {
      if (isNotAllowed) {
        return "Microphone access denied. Please click the camera icon in your browser's address bar and allow microphone access, then try again.";
      }
      if (isNotFound) {
        return "No microphone detected. Please connect a microphone and refresh the page.";
      }
      if (isNotReadable) {
        return "Your microphone is currently in use by another application. Please close other apps (like Zoom, Teams, or Skype) and try again.";
      }
      return "Unable to access your microphone. Please check your device settings and try again.";
    }
  };

  // Initialize Agora client and local tracks on mount
  useEffect(() => {
    const initializeAgora = async () => {
      try {
        setIsInitializing(true);
        setError(null);
        setCameraWarning(null);

        // Create Agora client
        const agoraClient = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8"
        });
        setClient(agoraClient);

        // Initialize camera track (non-blocking)
        let videoTrack: ICameraVideoTrack | null = null;
        try {
          videoTrack = await AgoraRTC.createCameraVideoTrack();
          setLocalVideoTrack(videoTrack);
          videoTrack.play("local-video-preview");
          console.log("Camera initialized successfully");
        } catch (cameraError) {
          console.warn("Camera initialization failed:", cameraError);
          const cameraErrorMessage = getDeviceErrorMessage(cameraError as Error, 'camera');
          setCameraWarning(cameraErrorMessage);
          // Don't throw - allow user to continue with audio only
        }

        // Initialize microphone track (blocking)
        let audioTrack: IMicrophoneAudioTrack | null = null;
        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          setLocalAudioTrack(audioTrack);
          console.log("Microphone initialized successfully");
        } catch (micError) {
          console.error("Microphone initialization failed:", micError);
          const micErrorMessage = getDeviceErrorMessage(micError as Error, 'microphone');
          setError(micErrorMessage);

          // Clean up camera track if it was initialized
          if (videoTrack) {
            videoTrack.stop();
            videoTrack.close();
            setLocalVideoTrack(null);
          }

          setIsInitializing(false);
          return; // Block initialization
        }

        setIsInitializing(false);
      } catch (err) {
        console.error("Failed to initialize Agora:", err);
        setError("Failed to initialize video call. Please refresh and try again.");
        setIsInitializing(false);
      }
    };

    void initializeAgora();

    // Cleanup on unmount
    return () => {
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (client) {
        void client.leave();
      }

      // Cleanup participant from Firebase if unmounting while in call
      if (session?.user?.id && channelId) {
        const participantRef = ref(database, `chats/${base62ToUuidSafe(channelId)}/active_call/participants/${session.user.id}`);
        void remove(participantRef);
      }
    };
  }, []);

  // Retry camera initialization
  const retryCamera = async () => {
    if (!client) return;

    setCameraWarning(null);

    try {
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalVideoTrack(videoTrack);

      if (isInCall) {
        videoTrack.play("local-video-call");
        if (client) {
          await client.publish([videoTrack]);
        }
      } else {
        videoTrack.play("local-video-preview");
      }

      console.log("Camera retry successful");
    } catch (cameraError) {
      console.warn("Camera retry failed:", cameraError);
      const cameraErrorMessage = getDeviceErrorMessage(cameraError as Error, 'camera');
      setCameraWarning(cameraErrorMessage);
    }
  };

  // Setup Agora event listeners when client is ready
  useEffect(() => {
    if (!client) return;

    // User joined
    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      console.log("User joined:", user.uid);
      setRemoteUsers(prev => [...prev, { uid: user.uid }]);
    };

    // User left
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      console.log("User left:", user.uid);
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    // User published (video/audio)
    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: "video" | "audio") => {
      console.log("User published:", user.uid, mediaType);
      await client.subscribe(user, mediaType);

      if (mediaType === "video") {
        const videoTrack = user.videoTrack;
        setRemoteUsers(prev =>
          prev.map(u =>
            u.uid === user.uid ? { ...u, videoTrack } : u
          )
        );
        // Play remote video
        videoTrack?.play(`remote-video-${user.uid}`);
      }

      if (mediaType === "audio") {
        const audioTrack = user.audioTrack;
        setRemoteUsers(prev =>
          prev.map(u =>
            u.uid === user.uid ? { ...u, audioTrack } : u
          )
        );
        // Play remote audio automatically
        audioTrack?.play();
      }
    };

    // User unpublished
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser, mediaType: "video" | "audio") => {
      console.log("User unpublished:", user.uid, mediaType);
      if (mediaType === "video") {
        setRemoteUsers(prev =>
          prev.map(u =>
            u.uid === user.uid ? { ...u, videoTrack: undefined } : u
          )
        );
      }
    };

    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);
    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    return () => {
      client.off("user-joined", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
    };
  }, [client]);

  // Play local video in call container when entering call view
  useEffect(() => {
    if (!isInCall || !localVideoTrack) return;

    // DOM element should now be mounted, safe to play video
    try {
      localVideoTrack.play("local-video-call");
      console.log("Local video playing in call view");
    } catch (err) {
      console.error("Failed to play local video in call view:", err);
      setError("Failed to display local video. Please check your camera.");
    }

    // Cleanup: stop playing when leaving call view
    return () => {
      try {
        localVideoTrack.stop();
        console.log("Local video stopped in call view");
      } catch (err) {
        console.error("Failed to stop local video:", err);
      }
    };
  }, [isInCall, localVideoTrack]);

  // Update call duration every second when in call
  useEffect(() => {
    if (!isInCall || !callStartTime) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      const seconds = Math.floor((now.getTime() - callStartTime.getTime()) / 1000);
      setCallDuration(seconds);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isInCall, callStartTime]);

  // Join call handler
  const handleJoinCall = async () => {
    // Only audio track is required - video is optional
    if (!client || !localAudioTrack) {
      setError("Audio is required to join the call. Please check your microphone and try again.");
      return;
    }

    if (!localVideoTrack) {
      console.log("Joining call without video track (audio-only mode)");
    }

    setIsJoining(true);
    setError(null);

    try {
      const config = await createAgoraConfig(channelId);

      if (!validateAgoraConfig(config)) {
        setError("Invalid Agora configuration. Please check your setup.");
        setIsJoining(false);
        return;
      }

      // Join the channel
      await client.join(
        config.appId,
        config.channelName,
        config.rtcToken,
        config.uid
      );

      // CRITICAL FIX: Ensure tracks are enabled before publishing
      // Agora SDK requires tracks to be enabled when publishing
      // If user muted in waiting room, tracks were disabled via setEnabled(false)
      if (localVideoTrack && !localVideoTrack.enabled) {
        console.log("Re-enabling video track before publish");
        await localVideoTrack.setEnabled(true);
      }
      if (localAudioTrack && !localAudioTrack.enabled) {
        console.log("Re-enabling audio track before publish");
        await localAudioTrack.setEnabled(true);
      }

      // Build array of available tracks
      const tracksToPublish: (ICameraVideoTrack | IMicrophoneAudioTrack)[] = [];

      if (localAudioTrack) {
        tracksToPublish.push(localAudioTrack);
      }

      if (localVideoTrack) {
        tracksToPublish.push(localVideoTrack);
      }

      // Publish only available tracks
      if (tracksToPublish.length > 0) {
        await client.publish(tracksToPublish);
        console.log(`Published ${tracksToPublish.length} track(s)`);
      } else {
        console.error("No tracks available to publish");
        setError("Unable to publish media. Please refresh and try again.");
        setIsJoining(false);
        return;
      }

      // Re-apply user's mute preferences if they had muted in waiting room
      // Use setMuted() for in-call muting (keeps track active but stops transmission)
      if (isVideoMuted && localVideoTrack) {
        console.log("Re-applying video mute state");
        await localVideoTrack.setMuted(true);
      }
      if (isAudioMuted && localAudioTrack) {
        console.log("Re-applying audio mute state");
        await localAudioTrack.setMuted(true);
      }

      // Stop video in preview container before transitioning
      try {
        if (localVideoTrack) {
          localVideoTrack.stop();
        }
      } catch (err) {
        console.error("Failed to stop preview video:", err);
      }

      // Send call join notification directly to Firebase BEFORE transitioning to call view
      try {
        const messagesRef = ref(database, `chats/${base62ToUuidSafe(channelId)}/messages`);
        await push(messagesRef, {
          message: channelId, // Store channelId in message field for Join Call button
          type: "CALL_JOIN",
          user: {
            id: session?.user?.id || '',
            firstName: me?.firstName || 'User',
            lastName: me?.lastName || '',
            profilePhotoUri: me?.profilePhotoUri || null
          },
          createdAt: new Date().toISOString()
        });
        console.log("Call join notification sent directly to Firebase");
      } catch (notificationErr) {
        console.error("Failed to send call join notification to Firebase:", notificationErr);
        // Don't block call join if notification fails
      }

      // Transition to call view
      setIsInCall(true);
      setCallStartTime(new Date()); // Track when call started

      // Send notification to the other party
      if (projectData?.data) {
        const project = projectData.data;
        const receiverId = session?.user?.id === project.data.buyer.userId
          ? project.data.designer.userId
          : project.data.buyer.userId;

        if (receiverId) {
          sendNotification({
            receiverId,
            callId: channelId
          });
        }
      }

      // Track participant in Firebase
      if (session?.user?.id) {
        const participantRef = ref(database, `chats/${base62ToUuidSafe(channelId)}/active_call/participants/${session.user.id}`);
        await set(participantRef, {
          id: session.user.id,
          firstName: me?.firstName || 'User',
          lastName: me?.lastName || '',
          profilePhotoUri: me?.profilePhotoUri || null,
          joinedAt: new Date().toISOString()
        });
        onDisconnect(participantRef).remove();
      }

      // Note: Local video will be played by useEffect when DOM is ready

      console.log("Joined channel:", config.channelName);
    } catch (err) {
      console.error("Failed to join call:", err);
      if (err instanceof Error) {
        console.error("Error details:", err.message);
      }
      setError("Failed to join call. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  // Leave call handler
  const handleLeaveCall = async () => {
    if (!client) return;

    try {
      // Stop local tracks
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }

      // Leave channel
      await client.leave();

      // Remove participant from Firebase
      if (session?.user?.id) {
        const participantRef = ref(database, `chats/${base62ToUuidSafe(channelId)}/active_call/participants/${session.user.id}`);
        await remove(participantRef);
      }

      // Navigate back
      router.back();
    } catch (err) {
      console.error("Failed to leave call:", err);
      // Remove participant even on error
      if (session?.user?.id) {
        const participantRef = ref(database, `chats/${base62ToUuidSafe(channelId)}/active_call/participants/${session.user.id}`);
        void remove(participantRef);
      }
      // Navigate back anyway
      router.back();
    }
  };

  // Toggle audio mute
  const toggleAudioMute = async () => {
    if (!localAudioTrack) return;

    if (isInCall) {
      // During call: use setMuted() to control transmission
      if (isAudioMuted) {
        await localAudioTrack.setMuted(false);
        setIsAudioMuted(false);
      } else {
        await localAudioTrack.setMuted(true);
        setIsAudioMuted(true);
      }
    } else {
      // In waiting room: use setEnabled() to control hardware
      if (isAudioMuted) {
        await localAudioTrack.setEnabled(true);
        setIsAudioMuted(false);
      } else {
        await localAudioTrack.setEnabled(false);
        setIsAudioMuted(true);
      }
    }
  };

  // Toggle video mute
  const toggleVideoMute = async () => {
    if (!localVideoTrack) return;

    if (isInCall) {
      // During call: use setMuted() to control transmission
      if (isVideoMuted) {
        await localVideoTrack.setMuted(false);
        setIsVideoMuted(false);
      } else {
        await localVideoTrack.setMuted(true);
        setIsVideoMuted(true);
      }
    } else {
      // In waiting room: use setEnabled() to control hardware
      if (isVideoMuted) {
        await localVideoTrack.setEnabled(true);
        setIsVideoMuted(false);
      } else {
        await localVideoTrack.setEnabled(false);
        setIsVideoMuted(true);
      }
    }
  };

  // Copy meeting link to clipboard
  const { handleCopy } = useClipboard();

  const handleCopyMeetingLink = () => {
    const meetingUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/video/${channelId}`;
    handleCopy(meetingUrl);
  };

  // Format call duration as HH:MM:SS or MM:SS
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Waiting Room */}
      {!isInCall && (
        <div
          className="w-full bg-background flex items-center justify-center"
          style={{ height: 'calc(100vh - 100px)' }}
        >
          <div className="w-full max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT PANEL: Camera Preview */}
              <div className="bg-muted lg:col-span-2 rounded-3xl overflow-hidden flex flex-col">
                {/* Video Preview Area */}
                <div className="relative flex-1 min-h-[400px] lg:min-h-[500px]">
                  {/* Video container */}
                  <div
                    id="local-video-preview"
                    className="w-full h-full"
                    style={{ background: isVideoMuted ? "#000" : "transparent" }}
                  />

                  {/* Video muted overlay - show user avatar */}
                  {isVideoMuted && (
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          className="object-cover"
                          src={me?.profilePhotoUri || ""}
                          alt={me?.firstName}
                        />
                        <AvatarFallback className="text-4xl">
                          {me?.firstName?.[0]?.toLocaleUpperCase?.()}
                          {me?.lastName?.[0]?.toLocaleUpperCase?.()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  {/* Error Overlay */}
                  {error && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6">
                      <div className="bg-background rounded-lg p-6 max-w-md text-center">
                        <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
                        <p className="text-sm text-foreground-body mb-4">{error}</p>
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" onClick={() => router.back()}>
                            Go Back
                          </Button>
                          <Button variant="default" onClick={() => window && window.location.reload()}>
                            Try Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading Overlay */}
                  {isInitializing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="mb-2">Initializing devices...</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Control Buttons at Bottom */}
                <div className="flex items-center justify-center gap-4 p-3 bg-background/5">
                  {/* Video Toggle */}
                  <button
                    onClick={toggleVideoMute}
                    disabled={!localVideoTrack}
                    className="rounded-full h-12 w-12 flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: isVideoMuted || !localVideoTrack ? '#E7A808' : '#FFFFFF',
                      color: isVideoMuted || !localVideoTrack ? '#FFFFFF' : '#000000',
                      opacity: !localVideoTrack ? 0.5 : 1
                    }}
                    title={!localVideoTrack ? "Camera unavailable" : isVideoMuted ? "Turn on camera" : "Turn off camera"}
                  >
                    {isVideoMuted || !localVideoTrack ? <VideoOff className="h-6 w-6" /> : <VideoIcon className="h-6 w-6" />}
                  </button>

                  {/* Audio Toggle */}
                  <button
                    onClick={toggleAudioMute}
                    disabled={!localAudioTrack}
                    className="rounded-full h-12 w-12 flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: isAudioMuted ? '#E7A808' : '#FFFFFF',
                      color: isAudioMuted ? '#FFFFFF' : '#000000'
                      // backgroundColor: isAudioMuted ? '#6B7280' : '#FFFFFF',
                      // color: isAudioMuted ? '#FFFFFF' : '#000000'
                    }}
                    title={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
                  >
                    {isAudioMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </button>
                </div>

                {/* Camera Warning Banner (if exists) */}
                {cameraWarning && (
                  <div className="mx-4 mb-4 bg-warning-50 border border-warning-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-warning-700">{cameraWarning}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={retryCamera}
                        disabled={isJoining}
                        className="ml-4"
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT PANEL: Participant Info */}
              <div className="bg-transparent md:bg-muted rounded-none md:rounded-3xl p-0 md:p-8 flex flex-col items-center justify-center min-h-[200px] lg:min-h-[500px]">
                {/* Participant Avatar */}
                <Avatar className="h-32 w-32 mb-6 hidden md:flex">
                  <AvatarImage src={participantAvatar || undefined} />
                  <AvatarFallback className="text-4xl">
                    {otherParticipant?.firstName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Participant Name */}
                <h2 className="text-lg font-bold text-foreground mb-2 text-center hidden md:block">
                  {participantName}
                </h2>

                {/* Ready to call text */}
                <p className="text-foreground-body mb-8 hidden md:block">Ready to call?</p>

                {/* Start Call Button */}
                <Button
                  size="lg"
                  variant="default"
                  onClick={handleJoinCall}
                  disabled={!localAudioTrack || isInitializing || isJoining}
                  loading={isJoining}
                  className="rounded-full px-8"
                >
                  {isJoining ? 'Starting...' : 'Start Call'}
                </Button>

                {/* Cancel Button */}
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => router.back()}
                  className="mt-4"
                >
                  Cancel
                </Button>

                {/* Call ID (small text at bottom) */}
                <p className="text-xs text-foreground-body mt-8">
                  Call ID: <span className="font-mono">{channelId}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Call View */}
      {isInCall && (
        <div
          className="relative w-full bg-background flex flex-col"
          style={{ height: 'calc(100vh - var(--topbar-height, 64px))' }}
        >
          {/* Header Section */}
          <div className="flex-none border-b border-border bg-background px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Call Info */}
              <div className="flex items-center gap-3 ">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <div className="flex flex-col gap-4">
                  <p className="text-sm md:text-base font-semibold text-foreground">
                    Call with {participantName}
                  </p>
                  {callStartTime && (
                    <p className="text-xs text-foreground-body">
                      Started at {formatDate(callStartTime, "hh:mm aa")}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Avatars and Duration */}
              <div className="flex flex-col items-end gap-2">
                {/* Avatars Row */}
                <div className="flex items-center gap-1">
                  {/* Current User Avatar */}
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-primary">
                    <AvatarImage
                      className="object-cover"
                      src={me?.profilePhotoUri || ""}
                      alt={me?.firstName}
                    />
                    <AvatarFallback className="text-xs">
                      {me?.firstName?.[0]?.toLocaleUpperCase?.()}
                      {me?.lastName?.[0]?.toLocaleUpperCase?.()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Remote Users Avatars (max 3 shown) */}
                  {remoteUsers.slice(0, 3).map((user) => (
                    <Avatar
                      key={user.uid}
                      className="h-8 w-8 md:h-10 md:w-10 border-2 border-secondary"
                      style={{ marginLeft: '-4px' }}
                    >
                      <AvatarFallback className="text-xs">
                        {String(user.uid).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}

                  {remoteUsers.length > 3 && (
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-muted border-2 border-border flex items-center justify-center text-xs font-semibold ml-[-4px]">
                      +{remoteUsers.length - 3}
                    </div>
                  )}
                </div>

                {/* Duration Counter */}
                <p className="text-xs text-foreground-body font-mono">
                  Call Duration - {formatDuration(callDuration)}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-2">
            {/* Video Section */}
            <div className="relative flex-1 bg-background">
              {/* Remote Users Grid */}
              {remoteUsers.length > 0 ? (
                <div className="absolute inset-0 grid grid-cols-1 gap-2 p-4 z-0">
                  {remoteUsers.map((user) => (
                    <div
                      key={user.uid}
                      id={`remote-video-${user.uid}`}
                      className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden"
                      style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                    >
                      {!user.videoTrack && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Avatar className="h-24 w-24">
                            <AvatarFallback className="text-2xl">
                              {String(user.uid).charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black rounded-lg">
                  <div className="text-center px-4">
                    <p className="text-sm md:text-lg font-semibold text-white mb-2">
                      Waiting for {otherParticipant?.firstName ?? 'User'} to join...
                    </p>
                    <p className="text-xs md:text-sm text-white">
                      Share the call ID: <span className="font-mono text-xs md:text-sm">{channelId}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Local Video - PiP (Bottom Left) */}
              <div className="absolute bottom-28 md:bottom-36 left-3 md:left-6 w-[120px] h-[90px] md:w-[200px] md:h-[150px] rounded-lg overflow-hidden z-10 border-2 border-border bg-gray-900 shadow-lg ">
                <div
                  id="local-video-call"
                  className="w-full h-full"
                  style={{ background: isVideoMuted ? "#000" : "transparent" }}
                />
                {isVideoMuted && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <Avatar className="h-10 w-10 md:h-16 md:w-16">
                      <AvatarImage
                        className="object-cover"
                        src={me?.profilePhotoUri || ""}
                        alt={me?.firstName}
                      />
                      <AvatarFallback>
                        {me?.firstName?.[0]?.toLocaleUpperCase?.()}
                        {me?.lastName?.[0]?.toLocaleUpperCase?.()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>

              {/* Call Controls - Bottom Bar */}
              <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-10 max-w-5xl w-[95%] md:w-[90%]">
                <div
                  className="flex flex-row items-center justify-between gap-2 md:gap-4 px-3 md:px-8 py-2 md:py-5 rounded-2xl md:rounded-full"
                  style={{ backgroundColor: '#FFFFFF33' }}
                >
                  {/* Left: End Meeting Button */}
                  <button
                    onClick={handleLeaveCall}
                    className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full text-white text-sm md:text-base font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#FF6B6B' }}
                  >
                    <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="hidden sm:inline">End Meeting</span>
                    <span className="sm:hidden">End</span>
                  </button>

                  {/* Center: Media Controls */}
                  <div className="flex items-center gap-2 md:gap-3">
                    {/* Microphone Button */}
                    <button
                      onClick={toggleAudioMute}
                      className="rounded-full h-10 w-10 md:h-14 md:w-14 flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: isAudioMuted ? '#EF4444' : 'white',
                        color: isAudioMuted ? 'white' : 'black'
                      }}
                      title={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
                    >
                      {isAudioMuted ? <MicOff className="h-5 w-5 md:h-6 md:w-6" /> : <Mic className="h-5 w-5 md:h-6 md:w-6" />}
                    </button>

                    {/* Video Button */}
                    <button
                      onClick={toggleVideoMute}
                      disabled={!localVideoTrack}
                      className="rounded-full h-10 w-10 md:h-14 md:w-14 flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: isVideoMuted || !localVideoTrack ? '#EF4444' : '#F59E0B',
                        color: 'white',
                        opacity: !localVideoTrack ? 0.5 : 1
                      }}
                      title={!localVideoTrack ? "Camera unavailable" : isVideoMuted ? "Turn on camera" : "Turn off camera"}
                    >
                      {isVideoMuted || !localVideoTrack ? <VideoOff className="h-5 w-5 md:h-6 md:w-6" /> : <VideoIcon className="h-5 w-5 md:h-6 md:w-6" />}
                    </button>
                  </div>

                  {/* Right: Call ID with Copy */}
                  <button
                    onClick={handleCopyMeetingLink}
                    className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 rounded-full font-mono text-xs md:text-sm transition-opacity hover:opacity-80"
                    style={{ backgroundColor: '#E5E7EB', color: '#1F2937' }}
                    title="Copy meeting link"
                  >
                    <span className="hidden sm:inline">{channelId}</span>
                    <span className="sm:hidden">{channelId.substring(0, 8)}...</span>
                    <Copy className="h-3 w-3 md:h-4 md:w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Panel */}
            <div className="hidden sm:block w-full lg:w-[400px] lg:flex-none border-t lg:border-t-0 lg:border-l border-border bg-background">
              <ChatWindow
                projectId={channelId}
                className="h-full max-h-none"
              />
            </div>
          </div>
        </div>
      )}

      <div className="sm:hidden w-full lg:w-[400px] lg:flex-none border-t lg:border-t-0 lg:border-l border-border bg-background">
        <ChatWindow
          projectId={channelId}
          className="h-full max-h-none"
        />
      </div>
    </>
  );
}

export default AgoraVideo;
