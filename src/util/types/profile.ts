export interface ProfileProps {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    startDate: Date;
    description: string;
    photoPath: string;
    favouriteDanceCategories: number[];
    role: string
}