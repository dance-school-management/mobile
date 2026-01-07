import { ScheduleItem, CalendarEvent } from "@/util/types/schedule";

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

const formatEvent = (event : ScheduleItem) : CalendarEvent => {
  return {
    id: event.id,
    title: event.classTemplate.name,
    description: event.classTemplate.description,
    start: { dateTime: event.startDate },
    end: { dateTime: event.endDate },
    classroom: event.classRoom,
    price: event.classTemplate.price,
    danceCategory: event.classTemplate.danceCategory,
    advancementLevel: event.classTemplate.advancementLevel,
    scheduleItem: event,
  }
}

export { getMondaySunday, formatEvent, getDayStart, getDayEnd };