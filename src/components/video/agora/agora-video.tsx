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
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneMissed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { cn } from "@/lib/utils";
import { createAgoraConfig, validateAgoraConfig } from "./config";
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import { useSendCallNotification } from "@/tanstack/hooks/useUser";

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
  const [error, setError] = useState<string | null>(null);

  // Initialize Agora client and local tracks on mount
  useEffect(() => {
    const initializeAgora = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        // Create Agora client
        const agoraClient = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8"
        });
        setClient(agoraClient);

        // Get local tracks (camera and microphone)
        const [videoTrack, audioTrack] = await Promise.all([
          AgoraRTC.createCameraVideoTrack(),
          AgoraRTC.createMicrophoneAudioTrack(),
        ]);

        setLocalVideoTrack(videoTrack);
        setLocalAudioTrack(audioTrack);

        // Play local video in waiting room
        videoTrack.play("local-video-preview");

        setIsInitializing(false);
      } catch (err) {
        console.error("Failed to initialize Agora:", err);
        const error = err as Error;
        if (error.message.includes("NotAllowedError")) {
          setError("Camera/microphone access denied. Please enable permissions.");
        } else if (error.message.includes("NotFoundError")) {
          setError("No camera/microphone found.");
        } else {
          setError("Failed to initialize. Please try again.");
        }
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
    if (!client || !localVideoTrack || !localAudioTrack) {
      setError("Tracks not ready. Please try again.");
      return;
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

      // Publish local tracks
      await client.publish([localVideoTrack, localAudioTrack]);

      // Stop video in preview container before transitioning
      try {
        localVideoTrack.stop();
      } catch (err) {
        console.error("Failed to stop preview video:", err);
      }

      // Transition to call view
      setIsInCall(true);

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

    if (isAudioMuted) {
      await localAudioTrack.setEnabled(true);
      setIsAudioMuted(false);
    } else {
      await localAudioTrack.setEnabled(false);
      setIsAudioMuted(true);
    }
  };

  // Toggle video mute
  const toggleVideoMute = async () => {
    if (!localVideoTrack) return;

    if (isVideoMuted) {
      await localVideoTrack.setEnabled(true);
      setIsVideoMuted(false);
    } else {
      await localVideoTrack.setEnabled(false);
      setIsVideoMuted(true);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!session?.user?.email) return "U";
    const email = session.user.email;
    return email.charAt(0).toUpperCase();
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
                  >
                    {isVideoMuted ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
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
                      <div className="mb-2">Initializing camera...</div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Join Call Section with User Info */}
              <div className="flex flex-col gap-6 p-8 bg-background border border-border rounded-lg">
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
                  disabled={!localVideoTrack || !localAudioTrack || isInitializing || isJoining}
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
        <div className="relative w-full h-[80vh] bg-background">
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

          {/* Local Video - PiP */}
          <div className="absolute bottom-24 right-10 w-[280px] h-[210px] rounded-lg overflow-hidden z-10 border-2 border-border bg-gray-900">
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

          {/* Call Controls - Bottom Center */}
          <div className="absolute left-1/2 bottom-10 -translate-x-1/2 flex gap-3 z-10">
            {/* Audio Mute */}
            <Button
              size="icon"
              variant={isAudioMuted ? "destructive" : "secondary"}
              onClick={toggleAudioMute}
              className="rounded-full h-12 w-12"
            >
              {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {/* Video Mute */}
            <Button
              size="icon"
              variant={isVideoMuted ? "destructive" : "secondary"}
              onClick={toggleVideoMute}
              className="rounded-full h-12 w-12"
            >
              {isVideoMuted ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
            </Button>

            {/* Leave Call */}
            <Button
              size="icon"
              variant="destructive"
              onClick={handleLeaveCall}
              className="rounded-full h-14 w-14"
            >
              <PhoneMissed className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default AgoraVideo;
