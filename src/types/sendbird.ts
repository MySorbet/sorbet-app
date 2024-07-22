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
  fileUrl?: string;
  file?: File[];
  nickname: string;
  avatar?: string;
  timestampData?: SBMessageTimeDto;
}
//size, type ,array buffer, stream, text

export interface SBFileMessage {
  size: any;
  type: any;
  arrayBuffer: any;
  stream: any;
  text: any;
}
