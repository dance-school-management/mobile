export function formatDateRange(start: Date, end: Date) {
    const dateOpts: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short' };
    const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    const day = start.toLocaleDateString(undefined, dateOpts);
    const startTime = start.toLocaleTimeString([], timeOpts);
    const endTime = end.toLocaleTimeString([], timeOpts);
    return { day, startTime, endTime };
}

export function formattedDate(date: Date) {
    return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function getDateYearsAfter(date: Date, years: number) {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
}