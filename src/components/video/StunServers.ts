// Initialize WebRTC


export const servers:RTCConfiguration = {
  iceServers:  [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
		{
			urls: "stun:stun.relay.metered.ca:80",
		},
		{
			urls: "turn:global.relay.metered.ca:80",
			username: "f8637c1452f6e5f7408544c6",
			credential: "xGQYldfCKXcNZggE",
		},
		{
			urls: "turn:global.relay.metered.ca:80?transport=tcp",
			username: "f8637c1452f6e5f7408544c6",
			credential: "xGQYldfCKXcNZggE",
		},
		{
			urls: "turn:global.relay.metered.ca:443",
			username: "f8637c1452f6e5f7408544c6",
			credential: "xGQYldfCKXcNZggE",
		},
		{
			urls: "turns:global.relay.metered.ca:443?transport=tcp",
			username: "f8637c1452f6e5f7408544c6",
			credential: "xGQYldfCKXcNZggE",
		},
  ],
  iceCandidatePoolSize: 10,
};
