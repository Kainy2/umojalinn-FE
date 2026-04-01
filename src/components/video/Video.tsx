
import { PageType } from "./VideoCall";
import useVideoCall from "./useVideoCall";
import { Copy, MoreVertical, PhoneMissed } from "lucide-react";


// import HangupIcon from "../icons/hangup.svg";
// import MoreIcon from "../icons/more-vertical.svg";
// import CopyIcon from "../icons/copy.svg";

type VideoProp = {
	mode: PageType; 
	callId: string;
	setPage: (page: PageType) => void;
} 

const Video = ( { mode, callId, setPage }: VideoProp ) => {
  const {
		setupSources,
		localRef,
		remoteRef,
		hangUp,
		webcamActive
	} = useVideoCall({mode, callId});

  return (
		<div className="relative w-full h-screen bg-white overflow-hidden">
		{/* Remote Video */}
		<video
			ref={remoteRef}
			autoPlay
			playsInline
			className="absolute inset-0 w-full h-full object-cover"
		/>
	
		{/* Local Video */}
		<video
			ref={localRef}
			autoPlay
			playsInline
			muted
			className="absolute bottom-10 right-10 w-[280px] h-[210px] rounded-lg z-10 object-cover"
		/>
	
		{/* Buttons */}
		<div className="absolute left-1/2 bottom-10 -translate-x-1/2 flex z-10">
			{/* Hangup */}
			<button
				onClick={hangUp}
				disabled={!webcamActive}
				className="mr-12 p-6 rounded-full bg-[#ff694f] text-white transition duration-500 ease border-2 border-transparent hover:shadow-lg disabled:opacity-50 2xl"
			>
				<PhoneMissed />
			</button>
	
			{/* More */}
			<div
				tabIndex={0}
				role="button"
				className="relative p-6 rounded-full bg-white border-2 border-gray-300 cursor-pointer transition duration-500 ease hover:shadow-lg focus-within:shadow-lg"
			>
				<MoreVertical />
	
				{/* Popover */}
				<div className="absolute bottom-full left-full invisible focus-within:visible bg-white rounded-lg shadow-lg py-5 px-0 text-base">
					<button
						onClick={() => {
							navigator.clipboard.writeText(callId);
							alert("copied");
						}}
						className="flex items-center whitespace-nowrap bg-white text-black px-5 py-2"
					>
						<Copy className="mr-5" />
						Copy joining code
					</button>
				</div>
			</div>
		</div>
	
		{/* Modal */}
		{!webcamActive && (
			<div className="absolute inset-0 z-[1000] bg-black/60">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 text-blue-600 w-[90%] max-w-md">
					<h3 className="font-normal">
						Turn on your camera and microphone and start the call
					</h3>
	
					<div className="flex mt-10">
						<button
							onClick={() => setPage("home")}
							className="ml-auto mr-5 bg-blue-50 text-blue-600 px-8 py-3 rounded-md"
						>
							Cancel
						</button>
	
						<button
							onClick={setupSources}
							className="bg-blue-600 text-white px-8 py-3 rounded-md"
						>
							Start
						</button>
					</div>
				</div>
			</div>
		)}
	</div>
	
  );
}

export default Video;