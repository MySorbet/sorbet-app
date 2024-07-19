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
  nickname: string;
  avatar?: string;
  timestampData?: SBMessageTimeDto;
}