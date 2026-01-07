export interface BroadcastHistory {
  id: number;
  title: string;
  body: string;
  sendDate: Date;
  isAutomatic: boolean;
  createdBy: string;
  payload: object;
}