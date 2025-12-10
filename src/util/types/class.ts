import { Course } from '@/util/types/course';
import { DanceCategory, AdvancementLevel } from '@/util/types/cms';
import { Instructor } from '@/util/types/instructors';

export interface ClassTemplate {
    id: number;
    courseId: number;
    name: string;
    description: string;
    price: string;
    currency: 'PLN' | string;
    danceCategoryId: number;
    advancementLevelId: number;
    classType: 'GROUP_CLASS' | string;
    scheduleTileColor: string;
    danceCategory: DanceCategory;
    advancementLevel: AdvancementLevel;
    course: Course;
}

export interface ClassInstance {
  id: number;
  classTemplateId: number;
  groupNumber: number;
  peopleLimit: number;
  classRoomId: number;
  startDate: string;
  endDate: string;
  paymentStatus: 'PART_OF_COURSE' | string;
  classStatus: 'NORMAL' | string;
  instructors: Instructor[];
  classTemplate: ClassTemplate;
}