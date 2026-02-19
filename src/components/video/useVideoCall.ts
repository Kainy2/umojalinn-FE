import { useRef, useState, useMemo } from "react";

import {
  ref,
  set,
  update,
  get,
  push,
  onValue,
  onChildAdded,
  remove,
} from "firebase/database";
import { servers } from "./StunServers";
import { PageType } from "./VideoCall";
import { database } from "@/lib/firebase";

type UseVideoOptions = {
  mode: PageType;
  callId: string;
};

// type UseVideoCallReturn = {
//   setupSources: () => Promise<void>;
//   hangUp: () => Promise<void>;
//   localRef: React.RefObject<HTMLVideoElement>;
//   remoteRef: React.RefObject<HTMLVideoElement>;
//   webcamActive: boolean;
//   // callId: string;
// };

const useVideoCall = ({
  mode,
  callId,
}: UseVideoOptions) => {
  const [webcamActive, setWebcamActive] = useState(false);
  // const [callId, ] = useState(callId);

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const pc = useMemo(() => new RTCPeerConnection(servers), []);

  const setupSources = async (): Promise<void> => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event: RTCTrackEvent) => {
      event.streams[0]?.getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    if (localRef.current) localRef.current.srcObject = localStream;
    if (remoteRef.current) remoteRef.current.srcObject = remoteStream;

    setWebcamActive(true);

    if (mode === "create") {
      const callRef = ref(database, `calls/${callId}`);
      const offerCandidatesRef = ref(database, `calls/${callId}/offerCandidates`);
      const answerCandidatesRef = ref(database, `calls/${callId}/answerCandidates`);

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await push(offerCandidatesRef, event.candidate.toJSON());
        }
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      await set(callRef, {
        offer: {
          type: offerDescription.type,
          sdp: offerDescription.sdp,
        },
      });

      // Listen for answer
      onValue(callRef, async (snapshot) => {
        const data = snapshot.val();

				if (!data?.answer) return;

				// Only set answer if we're still waiting for it
				if (pc.signalingState !== "have-local-offer") return;

				await pc.setRemoteDescription(
					new RTCSessionDescription(data.answer)
				);
      });

      // Listen for remote ICE candidates
      onChildAdded(answerCandidatesRef, (snapshot) => {
        const candidate = snapshot.val();
        if (candidate) {
          pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });
    }

    if (mode === "join") {
      const callRef = ref(database, `calls/${callId}`);
      const offerCandidatesRef = ref(database, `calls/${callId}/offerCandidates`);
      const answerCandidatesRef = ref(database, `calls/${callId}/answerCandidates`);

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await push(answerCandidatesRef, event.candidate.toJSON());
        }
      };

      const snapshot = await get(callRef);
      const callData = snapshot.val();

      if (!callData?.offer) return;

      await pc.setRemoteDescription(
        new RTCSessionDescription(callData.offer)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      await update(callRef, {
        answer: {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        },
      });

      onChildAdded(offerCandidatesRef, (snapshot) => {
        const candidate = snapshot.val();
        if (candidate) {
          pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected") {
        void hangUp();
      }
    };
  };

  const hangUp = async (): Promise<void> => {
    pc.close();

    if (!callId) return;

    const callRef = ref(database, `calls/${callId}`);
    await remove(callRef);
  };

  return {
    setupSources,
    hangUp,
    localRef,
    remoteRef,
    webcamActive,
    callId,
  };
};

export default useVideoCall;



// import { useRef, useState, useMemo } from "react";
// import { firestore } from "../utils/Firebase";
// import { servers } from "../utils/StunServers";
// import { PageType } from "./VideoCall";

// type UseVideoOptions = {
//   mode: PageType;
//   callId: string;
// };

// type UseVideoCallReturn = {
//   setupSources: () => Promise<void>;
//   hangUp: () => Promise<void>;
//   localRef: React.RefObject<HTMLVideoElement>;
//   remoteRef: React.RefObject<HTMLVideoElement>;
//   webcamActive: boolean;
//   callId: string;
// };

// const useVideoCall = ({ mode, callId }: UseVideoOptions): UseVideoCallReturn => {
//   const [webcamActive, setWebcamActive] = useState<boolean>(false);
//   const [callId, setcallId] = useState<string>(callId);

//   const localRef = useRef<HTMLVideoElement>(null);
//   const remoteRef = useRef<HTMLVideoElement>(null);

//   // Create peer connection per hook instance
//   const pc = useMemo(() => new RTCPeerConnection(servers), []);

//   const setupSources = async (): Promise<void> => {
//     const localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     const remoteStream = new MediaStream();

//     localStream.getTracks().forEach((track: MediaStreamTrack) => {
//       pc.addTrack(track, localStream);
//     });

//     pc.ontrack = (event: RTCTrackEvent) => {
//       event.streams[0]?.getTracks().forEach((track: MediaStreamTrack) => {
//         remoteStream.addTrack(track);
//       });
//     };

//     if (localRef.current) localRef.current.srcObject = localStream;
//     if (remoteRef.current) remoteRef.current.srcObject = remoteStream;

//     setWebcamActive(true);

//     if (mode === "create") {
//       const callDoc = firestore.collection("calls").doc();
//       const offerCandidates = callDoc.collection("offerCandidates");
//       const answerCandidates = callDoc.collection("answerCandidates");

//       setcallId(callDoc.id);

//       pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
//         if (event.candidate) {
//           offerCandidates.add(event.candidate.toJSON());
//         }
//       };

//       const offerDescription = await pc.createOffer();
//       await pc.setLocalDescription(offerDescription);

//       await callDoc.set({
//         offer: {
//           type: offerDescription.type,
//           sdp: offerDescription.sdp,
//         },
//       });

//       callDoc.onSnapshot((snapshot) => {
//         const data = snapshot.data();
//         if (!pc.currentRemoteDescription && data?.answer) {
//           const answerDescription = new RTCSessionDescription(data.answer);
//           pc.setRemoteDescription(answerDescription);
//         }
//       });

//       answerCandidates.onSnapshot((snapshot) => {
//         snapshot.docChanges().forEach((change) => {
//           if (change.type === "added") {
//             const candidate = new RTCIceCandidate(change.doc.data());
//             pc.addIceCandidate(candidate);
//           }
//         });
//       });
//     }

//     if (mode === "join") {
//       const callDoc = firestore.collection("calls").doc(callId);
//       const offerCandidates = callDoc.collection("offerCandidates");
//       const answerCandidates = callDoc.collection("answerCandidates");

//       pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
//         if (event.candidate) {
//           answerCandidates.add(event.candidate.toJSON());
//         }
//       };

//       const callData = (await callDoc.get()).data();
//       if (!callData?.offer) return;

//       await pc.setRemoteDescription(
//         new RTCSessionDescription(callData.offer)
//       );

//       const answerDescription = await pc.createAnswer();
//       await pc.setLocalDescription(answerDescription);

//       await callDoc.update({
//         answer: {
//           type: answerDescription.type,
//           sdp: answerDescription.sdp,
//         },
//       });

//       offerCandidates.onSnapshot((snapshot) => {
//         snapshot.docChanges().forEach((change) => {
//           if (change.type === "added") {
//             const candidate = new RTCIceCandidate(change.doc.data());
//             pc.addIceCandidate(candidate);
//           }
//         });
//       });
//     }

//     pc.onconnectionstatechange = () => {
//       if (pc.connectionState === "disconnected") {
//         void hangUp();
//       }
//     };
//   };

//   const hangUp = async (): Promise<void> => {
//     pc.close();

//     if (!callId) return;

//     const roomRef = firestore.collection("calls").doc(callId);

//     const deleteCollection = async (name: string) => {
//       const snapshot = await roomRef.collection(name).get();
//       snapshot.forEach((doc) => doc.ref.delete());
//     };

//     await deleteCollection("answerCandidates");
//     await deleteCollection("offerCandidates");
//     await roomRef.delete();

//     window.location.reload();
//   };

//   return {
//     setupSources,
//     hangUp,
//     localRef,
//     remoteRef,
//     webcamActive,
//     callId,
//   };
// };

// export default useVideoCall;
