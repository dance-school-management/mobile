import { Image } from 'react-native';
import React, { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
  HomeIcon,
  TicketsIcon,
  CalendarIcon,
  ChartColumnIcon,
  NotebookTextIcon,
  SettingsIcon,
} from 'lucide-react-native';
import { router, usePathname } from 'expo-router';
import { User } from 'lucide-react-native';
import BellButton from '@/components/notification/bellButton';
import { Button, ButtonText, Pressable, Text, View } from '@/components/ui';
import { useSessionQuery } from '@/lib/auth/session';
import { useLogoutMutation } from '@/lib/auth/logout';
import { queryClient } from '../../../lookup/src/api';

const CustomDrawerContent = (props) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  const {
    data: sessionData,
    error: sessionError,
    isLoading: sessionIsLoading,
    refetch: refetchSession,
  } = useSessionQuery();

  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';

  const menuItemsByRole: Record<
    Role,
    Array<{
      label: string;
      route: string;
      icon: React.ElementType;
      pathMatch: string;
    }>
  > = {
    STUDENT: [
      { label: 'Home', route: '/(drawer)/(tabs)/feed', icon: HomeIcon, pathMatch: '/feed' },
      { label: 'My Tickets', route: '/(drawer)/(tabs)/tickets', icon: TicketsIcon, pathMatch: '/tickets' },
      { label: 'Schedule', route: '/schedule', icon: CalendarIcon, pathMatch: '/schedule' },
      { label: 'My progress', route: '/progress', icon: ChartColumnIcon, pathMatch: '/progress' },
      { label: 'Contact', route: '/contact', icon: NotebookTextIcon, pathMatch: '/contact' },
      { label: 'Our instructors', route: '/instructors', icon: User, pathMatch: '/instructors' },
      { label: 'Settings', route: '/settings', icon: SettingsIcon, pathMatch: '/settings' },
    ],
    INSTRUCTOR: [
      { label: 'Home', route: '/(drawer)/(tabs)/feed', icon: HomeIcon, pathMatch: '/feed' },
      { label: 'Schedule', route: '/schedule', icon: CalendarIcon, pathMatch: '/schedule' },
      { label: 'Our instructors', route: '/instructors', icon: User, pathMatch: '/instructors' },
      { label: 'Settings', route: '/settings', icon: SettingsIcon, pathMatch: '/settings' },
    ],
    COORDINATOR: [
      { label: 'Home', route: '/(drawer)/(tabs)/feed', icon: HomeIcon, pathMatch: '/feed' },
      { label: 'Schedule', route: '/schedule', icon: CalendarIcon, pathMatch: '/schedule' },
    ],
  };

  const logoutMutation = useLogoutMutation();
  return (
    <DrawerContentScrollView {...props}>
      <View className="flex-row items-center border-b border-gray-300 pb-4 mb-4">
        <View className="mt-5 ml-2">
          {sessionData?.data?.user && !sessionIsLoading && (
            <>
              <Pressable
                onPress={() => {
                  router.push('/(drawer)/profile');
                }}
              >
                <Image
                  source={{ uri: "https://randomuser.me/api/portraits/women/26.jpg" }}
                  className="w-20 h-20 rounded-full ml-2"
                />
              </Pressable>
              <Text className="text-16 bold">{sessionData.data?.user.name}</Text>
              <Text className="text-16 italic">
                {sessionData.data?.user.email}
              </Text>
              <Button
                onPress={() => {
                  logoutMutation.mutate();
                }}
              >
                <ButtonText>Logout</ButtonText>
              </Button>
            </>
          )}
        </View>
      </View>
      {menuItemsByRole[role].map((item) => (
        <DrawerItem
          key={item.label}
          className="font-18"
          icon={({ size }) => (
            <item.icon size={size} color={pathname == item.pathMatch ? '#fff' : '#000'} />
          )}
          label={item.label}
          labelStyle={[
            { color: pathname == item.pathMatch ? '#fff' : '#000' },
          ]}
          style={{ backgroundColor: pathname == item.pathMatch ? '#333' : '#fff' }}
          onPress={() => {
            router.push(item.route);
          }}
        />
      ))}
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  const { data: sessionData } = useSessionQuery();
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';

  const screensByRole: Record<Role, Array<{ name: string, title: string }>> = {
    STUDENT: [
      { name: "schedule", title: "Schedule" },
      { name: "progress", title: "Progress" },
      { name: "contact", title: "Contact" },
      { name: "tickets", title: "Tickets" },
      { name: "instructors", title: "Instructors" },
      { name: "profile", title: "Profile" },
      { name: "settings", title: "Settings" },
      { name: "notifications", title: "NotificationsScreen" },
      { name: "course", title: "Course" },
      { name: "instructor_profile", title: "Instructor Profile" },
    ],
    INSTRUCTOR: [
      { name: "schedule", title: "Schedule" },
      { name: "settings", title: "Settings" },
      { name: "instructors", title: "Instructors" },
      { name: "notifications", title: "NotificationsScreen" },
      { name: "instructor_profile", title: "Instructor Profile" },
      { name: "profile", title: "Profile" },
    ],
    COORDINATOR: [
      { name: "schedule", title: "Schedule" }
    ]
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {screensByRole[role].map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          options={{ headerTitle: screen.title, headerShown: true, headerRight: () => <BellButton /> }}
        />
      ))}
    </Drawer>
  );
}
