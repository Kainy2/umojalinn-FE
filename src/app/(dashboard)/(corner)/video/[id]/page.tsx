import React from "react";
import AgoraVideo from "@/components/video/agora/agora-video";

type PageProps = {
  params: {
    id: string;
  };
};

const VideoCallPage = ({ params }: PageProps) => {
  return (
    <div className="h-screen">
      <AgoraVideo channelId={params.id} />
    </div>
  );
};

export default VideoCallPage;
