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

export type SendMessageParams = FileMessage | TextMessage;

export interface NewMessageNotificationDto {
  reqContractId: string;
  reqChannelId: string;
  reqSenderId: string;
  reqRecipientId: string;
}

export interface SupportedFileIcons {
  pdf: JSX.Element;
  png: JSX.Element;
  jpeg: JSX.Element;
}

export type SupportedFileIcon = keyof SupportedFileIcons;
