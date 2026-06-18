import { useEffect, useState } from "react";
import type { ClientMessage, ServerMessage } from "../types";

interface LobbyProps {
  socket: WebSocket;
  userName: string;
  setUserName: (name: string) => void;
  setRoomId: (id: string) => void;
}

const Lobby = ({ socket, userName, setUserName, setRoomId }: LobbyProps) => {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as ServerMessage;

      if (message.type === "room_created") {
        setRoomId(message.roomId);
      } else if (message.type === "error") {
        setError(message.message);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, setRoomId]);

  const handleCreateRoom = () => {
    if (!userName.trim()) return setError("Please enter your name first!");

    const msg: ClientMessage = { type: "create", senderName: userName };
    socket.send(JSON.stringify(msg));
  };

  const handleJoinRoom = () => {
    if (!userName.trim()) return setError("Please enter your name first!");
    if (!joinCode.trim()) return setError("Please enter a room code!");

    const msg: ClientMessage = {
      type: "join",
      senderName: userName,
      roomId: joinCode.toUpperCase(),
    };
    socket.send(JSON.stringify(msg));

    setRoomId(joinCode.toUpperCase());
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* 1. Header & Logo Section */}
      <div className="flex flex-col items-center mb-8">
        {/* App Logo */}
        <div className="w-14 h-14 bg-[#bf988a] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#031c26"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <path d="M8 10h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M16 10h.01"></path>
          </svg>
        </div>

        {/* Real-time Badge */}
        <div className="border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-6 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
          </svg>
          Real-time chat rooms
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-4xl font-semibold text-[#bf988a] mb-2 font-serif">
          Bazm
        </h1>
        <p className="text-gray-400 text-sm">
          Create a room or join one with an ID
        </p>
      </div>

      {/* 2. Main Form Card */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl w-full backdrop-blur-sm">
        {error && (
          <p className="text-red-400 text-sm text-center mb-4 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Your name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full bg-[#031c26]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#bf988a] focus:ring-1 focus:ring-[#bf988a] transition"
            />
          </div>

          {/* Create Room Button */}
          <div>
            <button
              onClick={handleCreateRoom}
              className="w-full bg-[#bf988a] hover:bg-[#a88579] text-[#031c26] font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create new room
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="grow border-t border-white/10"></div>
            <span className="shrink-0 mx-4 text-gray-500 text-[10px] tracking-widest uppercase">
              OR JOIN EXISTING
            </span>
            <div className="grow border-t border-white/10"></div>
          </div>

          {/* Join Room Section */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Room ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="ABC123"
                className="grow bg-[#031c26]/50 border border-white/10 rounded-xl px-4 py-3 text-white uppercase placeholder-gray-500 focus:outline-none focus:border-[#bf988a] focus:ring-1 focus:ring-[#bf988a] transition"
              />
              <button
                onClick={handleJoinRoom}
                className="bg-[#031c26] border border-white/10 hover:bg-[#042633] text-white font-medium py-3 px-5 rounded-xl transition flex items-center gap-2"
              >
                Join
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer */}
      <p className="text-gray-500 text-xs text-center mt-6">
        No sign-up required - Messages sync in real-time
      </p>
    </div>
  );
};

export default Lobby;
