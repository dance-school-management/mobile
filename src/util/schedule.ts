const getMondaySunday = (date: Date) => {
    const day = date.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    monday.setHours(0,0,0,0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { monday, sunday };
}

const getDayStart = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
}

const getDayEnd = (date: Date) => {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
}

interface EventProp {
  id: number;
  instructors: {
    id: number;
    name: string;
    surname: string;
  }
  owned: boolean;
  paymentStatus: string | null;
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
    danceCategory: {
      id: number;
      name: string;
      description: string;
      photoPath: string;
    }
    advancementLevel: {
      id: number;
      name: string;
      description: string;
    }
    course: {
      id: number;
      name: string;
      description: string;
      danceCategoryId: number;
      advancementLevelId: number;
      courseStatus: string;
      customPrice: string;
    }
  }
}

const formatEvent = (event : EventProp) => {
  return {
    id: event.id,
    name: event.classTemplate.name,
    description: event.classTemplate.description,
    start: { dateTime: event.startDate },
    end: { dateTime: event.endDate },
    classroom: event.classRoomId,
    classStatus: event.classStatus,
    bgColor: event.classTemplate.scheduleTileColor,
    price: event.classTemplate.price,
    currency: event.classTemplate.currency,
    classType: event.classTemplate.classType,
    danceCategory: event.classTemplate.danceCategory ? {
      id: event.classTemplate.danceCategory.id,
      name: event.classTemplate.danceCategory.name,
    } : null,
    advancementLevel: event.classTemplate.advancementLevel ? {
      id: event.classTemplate.advancementLevel.id,
      name: event.classTemplate.advancementLevel.name,
    } : null,
    course: event.classTemplate.course ? {
      id: event.classTemplate.course.id,
      name: event.classTemplate.course.name,
    } : null,
  }
}

export { getMondaySunday, formatEvent, getDayStart, getDayEnd };