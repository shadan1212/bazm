import { useState, useEffect, useRef } from "react";
import type { ClientMessage, ServerMessage } from "../types";

interface ChatRoomProps {
  socket: WebSocket;
  userName: string;
  roomId: string;
  onLeave: () => void;
}

export default function ChatRoom({
  socket,
  userName,
  roomId,
  onLeave,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as ServerMessage;

      if (message.type === "error") {
        alert(message.message);
        onLeave();
        return;
      }

      if (message.type === "chat" || message.type === "system") {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, onLeave]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const msg: ClientMessage = {
      type: "chat",
      roomId: roomId,
      senderName: userName,
      text: inputText,
    };

    socket.send(JSON.stringify(msg));
    setInputText("");
  };

  const handleLeaveClick = () => {
    const msg: ClientMessage = {
      type: "leave",
      senderName: userName,
      roomId: roomId,
    };
    socket.send(JSON.stringify(msg));
    onLeave();
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-emerald-500",
      "bg-yellow-600",
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  const getTextColor = (name: string) => {
    const textColors = [
      "text-emerald-500",
      "text-yellow-600",
      "text-blue-500",
      "text-purple-500",
      "text-pink-500",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return textColors[sum % textColors.length];
  };

  return (
    // REMOVED flex flex-col. Using pure relative container.
    <div className="relative w-full h-full max-w-6xl mx-auto overflow-hidden bg-[#031c26]/60 backdrop-blur-xl shadow-2xl">
      {/* 1. Header Area - NAILED TO TOP (h-[76px]) */}
      <header className="absolute top-0 inset-x-0 h-[76px] z-50 flex items-center justify-between px-6 border-b border-white/10 bg-[#031c26]/90 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLeaveClick}
            className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white tracking-wide">
                Bazm
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                LIVE
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span className="uppercase tracking-[0.2em]">{roomId}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full ${getAvatarColor(userName)} flex items-center justify-center text-white text-xs font-bold shadow-lg`}
          >
            {getInitials(userName)}
          </div>
          <span className="text-sm text-white font-medium hidden sm:block">
            {userName}
          </span>
        </div>
      </header>

      {/* 2. Messages Area - PINNED BETWEEN HEADER AND FOOTER */}
      {/* top-[76px] dodges the header, bottom-[80px] dodges the footer */}
      <main className="absolute top-[76px] bottom-[80px] inset-x-0 z-10 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-sm">
              Send a message to start the conversation.
            </p>
          </div>
        )}

        {messages.map((msg, index) => {
          if (msg.type === "system") {
            return (
              <div key={index} className="flex justify-center my-4">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                  {msg.text}
                </span>
              </div>
            );
          }

          if (msg.type === "chat") {
            const isMe = msg.senderName === userName;
            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 max-w-[75%] md:max-w-[60%] ${isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!isMe && (
                    <div
                      className={`w-8 h-8 rounded-full ${getAvatarColor(msg.senderName)} flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold mt-5 shadow-md`}
                    >
                      {getInitials(msg.senderName)}
                    </div>
                  )}
                  <div
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    {!isMe && (
                      <span
                        className={`text-xs font-medium mb-1.5 ml-1 ${getTextColor(msg.senderName)}`}
                      >
                        {msg.senderName}
                      </span>
                    )}
                    <div
                      className={`px-5 py-3 shadow-lg ${isMe ? "bg-[#bf988a] text-[#031c26] rounded-2xl rounded-tr-sm" : "bg-white/5 border border-white/10 text-gray-200 rounded-2xl rounded-tl-sm backdrop-blur-sm"}`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-600 mt-1.5 mx-1 font-medium tracking-wide">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* 3. Input Area - NAILED TO BOTTOM (h-[80px]) */}
      <footer className="absolute bottom-0 inset-x-0 h-[80px] z-50 p-4 sm:px-6 bg-[#031c26]/90 backdrop-blur-md border-t border-white/5">
        <form
          onSubmit={handleSend}
          className="flex gap-3 max-w-4xl mx-auto h-full items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#bf988a]/50 focus:ring-1 focus:ring-[#bf988a]/50 transition shadow-inner"
          />
          <button
            type="submit"
            className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#bf988a] text-[#031c26] hover:bg-[#a88579] hover:shadow-lg transition disabled:opacity-50"
            disabled={!inputText.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
