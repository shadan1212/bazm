import { useEffect, useState } from "react";
import Lobby from "./components/lobby";
import ChatRoom from "./components/chat-room";

function App() {
  const [userName, setUserName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600 animate-pulse">
          Connecting to server...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {!roomId ? (
        <Lobby
          socket={socket}
          userName={userName}
          setUserName={setUserName}
          setRoomId={setRoomId}
        />
      ) : (
        // <ChatRoom
        //   socket={socket}
        //   userName={userName}
        //   roomId={roomId}
        //   onLeave={() => setRoomId("")}
        // />
        <p>hello</p>
      )}
    </div>
  );
}

export default App;
