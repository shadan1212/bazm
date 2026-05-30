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
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        RealTime Chat
      </h1>

      {error && (
        <p className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g. Alice"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="pt-4 border-t">
          <button
            onClick={handleCreateRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Create New Room
          </button>
        </div>
        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-gray-300"></div>
          <span className="shrink-0 mx-4 text-gray-400 text-sm">OR</span>
          <div className="grow border-t border-gray-300"></div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Room Code"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
          />
          <button
            onClick={handleJoinRoom}
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
