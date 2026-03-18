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
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";

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

      // Transition to call view
      setIsInCall(true);

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

      // Navigate back
      router.back();
    } catch (err) {
      console.error("Failed to leave call:", err);
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

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!session?.user?.email) return "U";
    const email = session.user.email;
    return email.charAt(0).toUpperCase();
  };

  // Copy meeting link to clipboard
  const { handleCopy } = useClipboard();

  const handleCopyMeetingLink = () => {
    const meetingUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/video/${channelId}`;
    handleCopy(meetingUrl);
  };

  return (
    <>
      {/* Waiting Room */}
      {!isInCall && (
        <div className="min-h-screen bg-background p-6 flex items-center justify-center">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 items-center">
              {/* LEFT: Video Preview */}
              <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                {/* Video container */}
                <div
                  id="local-video-preview"
                  className="w-full h-full"
                  style={{ background: isVideoMuted ? "#000" : "transparent" }}
                />

                {/* Video muted overlay */}
                {isVideoMuted && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={session?.user?.profilePhotoUri || undefined} />
                      <AvatarFallback className="text-2xl">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}

                {/* Floating Mute Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  <Button
                    size="icon"
                    variant={isAudioMuted ? "destructive" : "secondary"}
                    onClick={toggleAudioMute}
                    disabled={!localAudioTrack}
                    className="rounded-full"
                  >
                    {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>

                  <Button
                    size="icon"
                    variant={isVideoMuted ? "destructive" : "secondary"}
                    onClick={toggleVideoMute}
                    disabled={!localVideoTrack}
                    className="rounded-full"
                    title={!localVideoTrack ? "Camera unavailable" : "Toggle camera"}
                  >
                    {isVideoMuted || !localVideoTrack ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
                  </Button>
                </div>

                {/* Error Overlay */}
                {error && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-6">
                    <div className="bg-background rounded-lg p-6 max-w-md text-center">
                      <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
                      <p className="text-sm text-foreground-body mb-4">{error}</p>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" onClick={() => router.back()}>
                          Go Back
                        </Button>
                        <Button variant="default" onClick={() => window.location.reload()}>
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

              {/* RIGHT: Join Call Section with User Info */}
              <div className="flex flex-col gap-6 p-8 bg-background border border-border rounded-lg">
                {/* Camera Warning Banner */}
                {cameraWarning && !isInCall && (
                  <div className="mb-4 bg-warning-50 border border-warning-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-warning-800 mb-1">Camera Unavailable</h3>
                        <p className="text-sm text-warning-700">{cameraWarning}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={retryCamera}
                        disabled={isJoining}
                        className="ml-4"
                      >
                        Retry Camera
                      </Button>
                    </div>
                  </div>
                )}

                {/* User Info */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={session?.user?.profilePhotoUri || undefined} />
                    <AvatarFallback className="text-2xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-foreground">
                      {session?.user?.email || "Guest User"}
                    </h2>
                    <p className="text-sm text-foreground-body">
                      Ready to join the call
                    </p>
                  </div>
                </div>

                {/* Call Info */}
                <div className="text-center">
                  <p className="text-sm text-foreground-body">
                    Call ID: <span className="font-mono text-xs">{channelId}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <Button
                  size="lg"
                  variant="default"
                  onClick={handleJoinCall}
                  disabled={!localAudioTrack || isInitializing || isJoining}
                  loading={isJoining}
                  fullWidth
                >
                  {isJoining ? 'Joining...' : 'Join Call'}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.back()}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Call View */}
      {isInCall && (
        <div className="relative w-full h-[80vh] bg-background flex flex-col">
          {/* Header Section */}
          <div className="flex-none border-b border-border bg-background px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Back Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              {/* Center: Avatars and Call Info */}
              <div className="flex-1 flex items-center gap-3">
                {/* Current User Avatar */}
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src={session?.user?.profilePhotoUri || undefined} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>

                {/* Remote Users Avatars (max 3 shown) */}
                {remoteUsers.slice(0, 3).map((user, index) => (
                  <Avatar
                    key={user.uid}
                    className="h-10 w-10 border-2 border-secondary"
                    style={{ marginLeft: index > 0 ? '-8px' : '0' }}
                  >
                    <AvatarFallback>
                      {String(user.uid).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}

                {remoteUsers.length > 3 && (
                  <div className="h-10 w-10 rounded-full bg-muted border-2 border-border flex items-center justify-center text-xs font-semibold ml-[-8px]">
                    +{remoteUsers.length - 3}
                  </div>
                )}
              </div>

              {/* Right: Copy Meeting Link Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyMeetingLink}
                className="hidden md:flex gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-10">
            {/* Video Section */}
            <div className="relative flex-1 bg-background">
              {/* Remote Users Grid */}
              {remoteUsers.length > 0 ? (
                <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                  {remoteUsers.map((user) => (
                    <div
                      key={user.uid}
                      id={`remote-video-${user.uid}`}
                      className="relative h-full aspect-video bg-gray-900 rounded-lg overflow-hidden"
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
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Waiting for others to join...
                    </p>
                    <p className="text-sm text-foreground-body">
                      Share the call ID: <span className="font-mono">{channelId}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Local Video - PiP (Bottom Left) */}
              <div className="absolute bottom-32 left-6 w-[200px] lg:w-[280px] h-[150px] lg:h-[210px] rounded-lg overflow-hidden z-10 border-2 border-border bg-gray-900 shadow-lg">
                <div
                  id="local-video-call"
                  className="w-full h-full"
                  style={{ background: isVideoMuted ? "#000" : "transparent" }}
                />
                {isVideoMuted && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={session?.user?.profilePhotoUri || undefined} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>

              {/* Call Controls - Bottom Bar */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 max-w-5xl w-[90%]">
                <div
                  className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-4 md:px-8 py-4 md:py-5 rounded-3xl opacity-20"
                  style={{ backgroundColor: '#1F1F1F30',}}
                >
                  {/* Left: End Meeting Button */}
                  <button
                    onClick={handleLeaveCall}
                    className="flex items-center gap-3 px-6 py-3 rounded-full text-white font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#FF6B6B' }}
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>End Meeting</span>
                  </button>

                  {/* Center: Media Controls */}
                  <div className="flex items-center gap-3">
                    {/* Microphone Button */}
                    <button
                      onClick={toggleAudioMute}
                      className="rounded-full h-14 w-14 flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: isAudioMuted ? '#EF4444' : 'white',
                        color: isAudioMuted ? 'white' : 'black'
                      }}
                      title={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
                    >
                      {isAudioMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </button>

                    {/* Video Button */}
                    <button
                      onClick={toggleVideoMute}
                      disabled={!localVideoTrack}
                      className="rounded-full h-14 w-14 flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: isVideoMuted || !localVideoTrack ? '#EF4444' : '#F59E0B',
                        color: 'white',
                        opacity: !localVideoTrack ? 0.5 : 1
                      }}
                      title={!localVideoTrack ? "Camera unavailable" : isVideoMuted ? "Turn on camera" : "Turn off camera"}
                    >
                      {isVideoMuted || !localVideoTrack ? <VideoOff className="h-6 w-6" /> : <VideoIcon className="h-6 w-6" />}
                    </button>
                  </div>

                  {/* Right: Call ID with Copy */}
                  <button
                    onClick={handleCopyMeetingLink}
                    className="flex items-center gap-3 px-5 py-3 rounded-full font-mono text-sm transition-opacity hover:opacity-80"
                    style={{ backgroundColor: '#E5E7EB', color: '#1F2937' }}
                    title="Copy meeting link"
                  >
                    <span className="hidden sm:inline">{channelId}</span>
                    <span className="sm:hidden">{channelId.substring(0, 12)}...</span>
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Panel */}
            <div className="w-full lg:w-[400px] pl-10 lg:flex-none border-t lg:border-t-0 lg:border-l border-border bg-background">
              <ChatWindow
                projectId={channelId}
                className="h-full max-h-none"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AgoraVideo;
