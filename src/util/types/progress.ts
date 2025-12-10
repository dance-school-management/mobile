export interface LearntDanceCategoryProp {
    courseId: number;
    danceCategoryId: number;
    danceCategoryName: string;
    advancementLevelId: number;
    advancementLevelName: string;
    finishedDate: Date;
    instructorsNames: string[];
}

export interface CourseAttendanceRatesProp {
    courseId: number;
    courseName: string;
    hasStarted: boolean;
    instructorsNames: string[];
    attendedCount: number;
    allCount: number;
}

export interface HoursSpentPerDanceCategoryProp {
    danceCategoryName: string;
    spentHours: number;
}

export interface HoursSpentPerInstructorProp {
    instructorFirstname: string;
    instructorSurname: string;
    spentHours: number;
}