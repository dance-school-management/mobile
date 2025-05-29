export interface Instructor {
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