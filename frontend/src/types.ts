// src/types.ts

export interface CreateRoomMessage {
  type: "create";
  senderName: string;
}

export interface JoinRoomMessage {
  type: "join";
  senderName: string;
  roomId: string;
}

export interface ChatMessage {
  type: "chat";
  roomId: string;
  senderName: string;
  text: string;
}

export interface LeaveRoomMessage {
  type: "leave";
  senderName: string;
  roomId: string;
}

export type ClientMessage =
  | CreateRoomMessage
  | JoinRoomMessage
  | ChatMessage
  | LeaveRoomMessage;

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
