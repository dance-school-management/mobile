import { DanceCategory, AdvancementLevel } from '@/util/types/cms'

export interface CourseProp {
  id: number;
  name: string;
  description: string;
  danceCategoryId: number;
  advancementLevelId: number;
  courseStatus: string;
  price: string;
  danceCategory: DanceCategory;
  advancementLevel: AdvancementLevel;
  instructors: { id: string; name: string; surname: string }[];
}

export interface ClassProp {
  id: number;
  classTemplateId: number;
  groupNumber: number;
  startDate: Date;
  endDate: Date;
  peopleLimit: number;
  classRoomId: number;
  classStatus: string;
  classTemplate: {
    id: number;
    courseId: number;
    name: string;
    description: string;
    price: string;
    currency: string;
    danceCategoryId: number;
    advancementLevelId: number;
    classType: string;
    scheduleTileColor: string;
    course: {
      id: number;
      name: string;
      description: string;
      danceCategoryId: number;
      advancementLevelId: number;
      courseStatus: string;
      customPrice: string;
      danceCategory: {
        id: number;
        name: string;
        description: string;
        photoPath: string;
      },
      advancementLevel: {
        id: number;
        name: string;
        description: string;
      }
    }
  },
  instructors: [
    {
      id: string;
      name: string;
      surname: string;
    }
  ]
}

export interface CourseDetailsProp {
  courseData: CourseProp;
  classes: ClassProp[];
}

export interface Course {
  id: number;
  name: string;
  description: string;
  danceCategoryId: number;
  advancementLevelId: number;
  courseStatus: string;
  customPrice: string;
}