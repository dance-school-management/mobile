import { AdvancementLevel, DanceCategory } from '@/util/types/cms';
import { Course } from '@/util/types/course';

export interface ScheduleItem {
  instructors: {id: string, name: string, surname: string}[];
  owned: boolean;
  paymentStatus: null | string;
  id: number;
  classTemplateId: number;
  groupNumber: number;
  startDate: Date;
  endDate: Date;
  peopleLimit: number;
  classRoomId: number;
  classStatus: string;
  createdBy: null | number;
  classTemplate: ScheduleItemClassTemplate;
  classRoom: {id: number, name: string};
}

export interface ScheduleItemPersonal extends Omit<ScheduleItem, 'owned'> {
  owned: undefined
}

export interface ScheduleItemClassTemplate {
  id: number;
  courseId: number;
  name: string;
  description: string;
  price: string;
  danceCategoryId: number;
  advancementLevelId: number;
  classType: string;
  createdBy: null | number;
  danceCategory: DanceCategory;
  advancementLevel: AdvancementLevel;
  course: Course;
}

export interface CalendarEvent {
  id: number | string;
  start: { dateTime: Date };
  end: { dateTime: Date };
  title: string;
  color?: string;
  classroom: { id: number; name: string };
  danceCategory?: DanceCategory;
  advancementLevel?: AdvancementLevel;
  description?: string;
  price?: string;
  scheduleItem: ScheduleItem;
}