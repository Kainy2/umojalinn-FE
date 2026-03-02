import { UID, SDK_MODE } from "agora-rtc-sdk-ng";

// Type for Agora configuration
export type AgoraConfigType = {
  uid: UID;
  appId: string;
  channelName: string;
  rtcToken: string;
  selectedProduct: SDK_MODE;
};

// Fetch token from API
export const fetchAgoraToken = async (
  channelName: string,
  uid: UID = 0
): Promise<{ token: string; appId: string }> => {
  const response = await fetch("/api/agora/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ channelName, uid }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch token");
  }

  const data = await response.json();
  return { token: data.token, appId: data.appId };
};

// Helper function to create config with dynamic channel
export const createAgoraConfig = async (
  channelName: string
): Promise<AgoraConfigType> => {
  const { token, appId } = await fetchAgoraToken(channelName);

  return {
    uid: 0, // 0 = auto-assign by Agora
    appId,
    channelName,
    rtcToken: token,
    selectedProduct: "rtc" as SDK_MODE,
  };
};

// Validation helper
export const validateAgoraConfig = (config: AgoraConfigType): boolean => {
  if (!config.appId) {
    console.error("Agora App ID is missing");
    return false;
  }
  if (!config.channelName) {
    console.error("Channel name is required");
    return false;
  }
  if (!config.rtcToken) {
    console.error("RTC token is missing");
    return false;
  }
  return true;
};
