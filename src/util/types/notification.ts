export interface NotificationProp {
  id: number,
  title: string,
  body: string,
  sendDate: Date,
  payload: object,
  hasBeenRead: boolean,
}