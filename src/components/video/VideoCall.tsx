"use client"

import { useParams } from "next/navigation";
import { useState } from "react";
import CallMenu from "./CallMenu";
import Video from "./Video";

export type PageType = "home" | "create" | "join";

const VideoCall = () => {
	const { id } = useParams<{ id: string }>();

  const [ currentPage, setCurrentPage ] = useState<PageType>( "home" );

  return (
    <div className="app">
      { currentPage === "home" ? (
        <CallMenu setPage={ setCurrentPage } />
      ) : (
        <Video
          mode={ currentPage }
          callId={ id }
          setPage={ setCurrentPage }
        />
      ) }
    </div>
  );
}

export default VideoCall;