import { Role } from "./roles";

export interface InstructorShort {
    name: string;
    id: string;
    surname: string;
    email: string | null;
    phone: string | null;
    startDate: Date | null;
    description: string | null;
    photoPath: string | null;
    favouriteDanceCategories: string[];
    role: Role;
}

export interface Instructor extends InstructorShort {
  experience: {advancementLevelName: string, danceCategoryName: string, spentHours: number}[];
}