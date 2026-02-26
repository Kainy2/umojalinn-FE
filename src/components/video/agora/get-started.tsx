"use client"

import { useState } from "react";
import { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { AgoraManager } from "./agora-manager";
import config from "./config";
import { Button } from "@/components/ui/button";

export function GetStarted() {
	// @ts-expect-error: localCameraTrack and localMicrophoneTrack being imported from a diff sdk but still works
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: config.selectedProduct }));
  const [joined, setJoined] = useState(false);

  const handleJoinClick = () => {
    setJoined(true);
  };

  const handleLeaveClick = () => {
    setJoined(false);
  };

  const renderActionButton = () => {
    return joined ? (
      <Button onClick={handleLeaveClick}>Leave</Button>
    ) : (
      <Button onClick={handleJoinClick}>Join</Button>
    );
  };
  
  return (
    <div>
      <h1>Get Started with Video Calling</h1>
      {renderActionButton()}
      {joined && (
        <AgoraRTCProvider client={agoraEngine}>
          <AgoraManager config={config} >
						.
          </AgoraManager>
        </AgoraRTCProvider>
      )}
    </div>
  );
}

export default GetStarted;