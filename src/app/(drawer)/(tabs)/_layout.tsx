import React from 'react';
import { Tabs } from 'expo-router';
import { HomeIcon, TicketsIcon, CalendarIcon, BellIcon } from 'lucide-react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';
import BellButton from '@/components/notification/bellButton';
import { useSessionQuery } from '@/lib/auth/session';

export default function _layout() {
  const { data: sessionData } = useSessionQuery();
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';

  const tabsByRole: Record<Role, Array<{ name: string, label: string, title: string, icon: React.ElementType, hide?: boolean }>> = {
    STUDENT: [
      { name: 'feed', label: 'Home', title: 'Home', icon: HomeIcon },
      { name: 'tickets', label: 'My Tickets', title: 'My Tickets', icon: TicketsIcon },
      { name: 'schedule', label: 'Schedule', title: 'Schedule', icon: CalendarIcon },
    ],
    INSTRUCTOR: [
      { name: 'feed', label: 'Home', title: 'Home', icon: HomeIcon },
      { name: 'schedule', label: 'Schedule', title: 'Schedule', icon: CalendarIcon },
      { name: 'tickets', label: 'My Tickets', title: 'My Tickets', icon: TicketsIcon, hide: true },
    ],
    COORDINATOR: [
      { name: 'feed', label: 'Home', title: 'Home', icon: HomeIcon },
      { name: 'schedule', label: 'Schedule', title: 'Schedule', icon: CalendarIcon },
      { name: 'tickets', label: 'My Tickets', title: 'My Tickets', icon: TicketsIcon, hide: true },
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