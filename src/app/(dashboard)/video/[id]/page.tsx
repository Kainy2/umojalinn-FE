import React from "react";
import AgoraVideo from "@/components/video/agora/agora-video";
import { PageProps } from "@/types/util";

const VideoCallPage = async (props: PageProps<{ id: string }>) => {
  const params = await props.params;

  return (
    <div className="h-screen">
      <AgoraVideo channelId={params.id} />
    </div>
  );
};

export default VideoCallPage;
