import React from 'react';
import { Tabs } from 'expo-router';
import { HomeIcon, TicketsIcon, CalendarIcon, ScanQrCodeIcon } from 'lucide-react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';
import BellButton from '@/components/notification/bellButton';
import { useSessionQuery } from '@/lib/auth/session';
import { Role } from '@/util/types/roles';

export default function _layout() {
  const { data: sessionData } = useSessionQuery();
  // @ts-ignore
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';

  const tabsByRole: Record<Role, Array<{ name: string, label: string, title: string, icon: React.ElementType, hide?: boolean }>> = {
    STUDENT: [
      { name: 'home', label: 'Home', title: 'Home', icon: HomeIcon },
      { name: 'tickets', label: 'Tickets', title: 'Tickets', icon: TicketsIcon },
      { name: 'schedule', label: 'Schedule', title: 'Schedule', icon: CalendarIcon },
      { name: 'qr', label: 'QR Scanner', title: 'QR Scanner', icon: ScanQrCodeIcon, hide: true },
      { name: 'blogs', label: 'Blog', title: 'Blog', icon: HomeIcon, hide: true },
      { name: 'blog/[blogId]', label: 'Blog', title: 'Blog', icon: HomeIcon, hide: true },
      { name: 'instructors', label: 'Instructors', title: 'Instructors', icon: HomeIcon, hide: true },
      { name: 'instructor/[instructorId]', label: 'Instructor', title: 'Instructor', icon: HomeIcon, hide: true },
      { name: 'profile', label: 'Profile', title: 'Profile', icon: HomeIcon, hide: true },
      { name: 'notifications', label: 'Notifications', title: 'Notifications', icon: HomeIcon, hide: true },
      { name: 'settings', label: 'Settings', title: 'Settings', icon: HomeIcon, hide: true },
      { name: 'progress', label: 'Progress', title: 'Progress', icon: HomeIcon, hide: true },
      { name: 'course/[courseId]', label: 'Course', title: 'Course', icon: HomeIcon, hide: true },
      { name: 'courses', label: 'Courses', title: 'Courses', icon: HomeIcon, hide: true },
    ],
    INSTRUCTOR: [
      { name: 'home', label: 'Home', title: 'Home', icon: HomeIcon },
      { name: 'schedule', label: 'Schedule', title: 'Schedule', icon: CalendarIcon },
      { name: 'tickets', label: 'Tickets', title: 'Tickets', icon: TicketsIcon, hide: true },
      { name: 'qr', label: 'QR Scanner', title: 'QR Scanner', icon: ScanQrCodeIcon },
    ],
    COORDINATOR: [
      { name: 'home', label: 'Home', title: 'Home', icon: HomeIcon },
      { name: 'schedule', label: 'Schedule', title: 'Schedule', icon: CalendarIcon },
      { name: 'tickets', label: 'My Tickets', title: 'My Tickets', icon: TicketsIcon, hide: true },
      { name: 'qr', label: 'QR Scanner', title: 'QR Scanner', icon: ScanQrCodeIcon },
    ],
  };

  return (
    <Tabs screenOptions={{ headerLeft: () => <DrawerToggleButton tintColor='#000' />, headerRight: () => <BellButton /> }}>
      {tabsByRole[role].map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            href: tab.hide ? null : undefined,
            tabBarLabel: tab.label,
            title: tab.title,
            tabBarIcon: ({ color, size }) => <tab.icon color={color} size={size} />,
          }}
        />
      ))}
    </Tabs>
  );
}