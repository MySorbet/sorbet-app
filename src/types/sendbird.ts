export interface SBMessageTimeDto {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
}

export interface SBMessage {
  userId: string;
  message: string;
  fileData?: SBFileMessage;
  nickname: string;
  avatar?: string;
  timestampData?: SBMessageTimeDto;
}

export interface SBFileMessage {
  name: string;
  sendbirdUrl: string;
  type: string;
  size: number;
}

export interface FileMessage {
  type: 'file';
  message: File[];
}

export interface TextMessage {
  type: 'text';
  message: string;
}

// Union type for SendMessageParams
export type SendMessageParams = FileMessage | TextMessage;
