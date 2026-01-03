export interface TicketProp {
  classId: number;
  classType: string;
  qrCodeUUID: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  classRoomName: string;
  danceCategoryName: string;
  advancementLevelName: string;
  price: number;
  paymentStatus: string;
  coursePaymentStatus: string;
  attendanceStatus: string;
  attendanceLastUpdated: Date | null;
}