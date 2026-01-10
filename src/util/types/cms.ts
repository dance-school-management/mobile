export interface DanceCategory {
    id: number;
    name: string;
    photoPath: string;
    description: string;
}

export interface ClassRoom {
    id: number;
    name: string;
    peopleLimit: number;
    description: string;
}

export interface AdvancementLevel {
    id: number;
    name: string;
    description: string;
}