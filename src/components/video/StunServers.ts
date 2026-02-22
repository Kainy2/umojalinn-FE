// Initialize WebRTC
// export const servers = {
//   iceServers:  [
//     {
//       urls: [
//         "stun:stun.l.google.com:19302",
//         "stun:stun1.l.google.com:19302",
//         "stun:stun2.l.google.com:19302",
//         "stun:stun3.l.google.com:19302",
//         "stun:stun4.l.google.com:19302",
//       ],
//     },
// 		{
// 			urls: "turn:openrelay.metered.ca:80",
// 			username: "openrelayproject",
// 			credential: "openrelayproject"
// 		}
		
//   ],
//   iceCandidatePoolSize: 10,
// };

export const servers:RTCConfiguration = {
  iceTransportPolicy: "relay",
  iceServers: [
    {
      urls: [
        "turn:openrelay.metered.ca:80?transport=tcp",
        "turn:openrelay.metered.ca:443?transport=tcp"
      ],
      username: "openrelayproject",
      credential: "openrelayproject"
    }
  ]
};