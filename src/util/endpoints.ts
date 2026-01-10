export const API_PATHS = {
    getDanceCategories: '/product/public/cms/dance_category',
    getClassRooms: '/product/public/cms/class_room',
    getAdvancementLevels: '/product/public/cms/advancement_level',
    getMostPopularCourses: '/product/public/pricing/most_popular_courses',
    getSchedule: '/product/public/schedule',
    getScheduleCourses: '/product/public/schedule/search/courses',
    getScheduleCoursesClasses: '/product/public/schedule/courses/classes',
    getSchedulePersonal: '/product/schedule/personal',
    getProgressLearntDanceCategories: '/enroll/progress/learnt-dance-categories',
    getProgressCoursesAttendanceRates: '/enroll/progress/courses-attendance-rates',
    getProgressHoursSpentDanceCategories: '/enroll/progress/hours-spent/dance-categories',
    getProgressHoursSpentInstructors: '/enroll/progress/hours-spent/instructors',
    getTickets: '/enroll/ticket/retrieve',
    putScanTicket: '/enroll/ticket/scan',
    getTicketValidation: '/enroll/ticket/scan',
    postOrderClass: '/enroll/order/class',
    postOrderCourse: '/enroll/order/course',
    postOrderPrivateClass: '/enroll/order/class/private/pay',
    postBlog: '/blog/posts',
    getBlogs: '/blog/public/posts',
    getProfile: '/profile/user/profile',
    changePassword: '/auth/api/auth/change-password',
    getInstructors: '/profile/public/instructors',
    getNotifications: '/notification/notification',
    putNotificationReadStatus: '/notification/notification/status',
    getNotificationRegistrationStatus: '/notification/notification/status',
    postRegisterPushNotifications: '/notification/notification/register',
    postToggleNotifications: '/notification/notification/toggle',
    putUnregisterPushNotifications: '/notification/notification/push/unregister',
    postCreateNotification: '/notification/notification/management',
    getNotificationLogs: '/notification/notification/management',
    getStudents: '/profile/search',
    deleteUser: '/auth/api/auth/delete-user',
    ticketRefund: '/enroll/ticket/retrieve/refund'
}

export const getApiUrl = (
    path: typeof API_PATHS[keyof typeof API_PATHS],
    params?: Record<string, string | number>
): string => {
    let url = path;
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url += url.includes('?') ? '&' : '?';
            url += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
    }
    console.log(url)
    return url;
};