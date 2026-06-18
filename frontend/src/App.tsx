import { useEffect, useState } from "react";
import Lobby from "./components/lobby";
import ChatRoom from "./components/chat-room";

function App() {
  const [userName, setUserName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const WS_URL = import.meta.env.PROD
      ? "wss://YOUR_BACKEND_NAME.onrender.com"
      : "ws://localhost:8080";

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("Connected to server!");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("Disconnected from server.");
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  if (!socket) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#031c26]">
        <p className="text-xl text-gray-600 animate-pulse">
          Connecting to server...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen  bg-[#031c26]">
      {/* Background Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-white/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-[#bf988a]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Main Rendering Logic */}
      {!roomId ? (
        // LOBBY CONTAINER (Centered)
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <Lobby
            socket={socket}
            userName={userName}
            setUserName={setUserName}
            setRoomId={setRoomId}
          />
        </div>
      ) : (
        // CHAT ROOM CONTAINER (Full Screen, Not Centered)
        <div className="relative z-10 w-full h-full block">
          <ChatRoom
            socket={socket}
            userName={userName}
            roomId={roomId}
            onLeave={() => setRoomId("")}
          />
        </div>
      )}
    </div>
  );
}

export default App;
