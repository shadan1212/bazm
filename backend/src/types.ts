// Messeges from Client to Server:
export interface CreateRoomMessage {
  type: "create";
  senderName: string;
}

export interface JoinRoomMessage {
  type: "join";
  roomId: string;
  senderName: string;
}

export interface ChatMessage {
  type: "chat";
  roomId: string;
  senderName: string;
  text: string;
}

export type ClientMessage = CreateRoomMessage | JoinRoomMessage | ChatMessage;

// Messeges from Sever to Client:
export interface RoomCreatedMessage {
  type: "room_created";
  roomId: string;
}

export interface SystemMessage {
  type: "system";
  text: string;
}

export interface ServerChatMessage {
  type: "chat";
  senderName: string;
  text: string;
  timestamp: number;
}

export interface ErrorMessage {
  type: "error";
  message: string;
}

export type ServerMessage =
  | RoomCreatedMessage
  | SystemMessage
  | ServerChatMessage
  | ErrorMessage;
