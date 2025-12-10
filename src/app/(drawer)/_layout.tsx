import { Image, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
  HomeIcon,
  TicketsIcon,
  CalendarIcon,
  ChartColumnIcon,
  SettingsIcon,
  NewspaperIcon,
  LogOutIcon,
  BookUpIcon
} from 'lucide-react-native';
import { router, usePathname } from 'expo-router';
import { User } from 'lucide-react-native';
import { Button, ButtonText, Pressable, Text, View } from '@/components/ui';
import { useSessionQuery } from '@/lib/auth/session';
import { useLogoutMutation } from '@/lib/auth/logout';
import { Role } from '@/util/types/roles';
import { Divider } from '@/components/ui/divider';
import { queryClient } from '../_layout';

const CustomDrawerContent = (props : any) => {
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

  // @ts-ignore
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
      {
        label: 'Home',
        route: '/(tabs)/home',
        icon: HomeIcon,
        pathMatch: '/home',
      },
      {
        label: 'Schedule',
        route: '/(tabs)/schedule',
        icon: CalendarIcon,
        pathMatch: '/schedule',
      },
      {
        label: 'Tickets',
        route: '/(tabs)/tickets',
        icon: TicketsIcon,
        pathMatch: '/tickets',
      },
      {
        label: 'Progress',
        route: '/(tabs)/progress',
        icon: ChartColumnIcon,
        pathMatch: '/progress',
      },
      {
        label: 'Courses',
        route: '/(tabs)/courses',
        icon: BookUpIcon,
        pathMatch: '/courses',
      },
      {
        label: 'Blog',
        route: '/(tabs)/blogs',
        icon: NewspaperIcon,
        pathMatch: '/blogs',
      },
      {
        label: 'Instructors',
        route: '/(tabs)/instructors',
        icon: User,
        pathMatch: '/instructors',
      },
      {
        label: 'Settings',
        route: '/(tabs)/settings',
        icon: SettingsIcon,
        pathMatch: '/settings',
      },
    ],
    INSTRUCTOR: [
      {
        label: 'Home',
        route: '/(tabs)/home',
        icon: HomeIcon,
        pathMatch: '/home',
      },
      {
        label: 'Schedule',
        route: '/(tabs)/schedule',
        icon: CalendarIcon,
        pathMatch: '/schedule',
      },
      {
        label: 'Blog',
        route: '/(tabs)/blogs',
        icon: NewspaperIcon,
        pathMatch: '/blogs',
      },
      {
        label: 'Instructors',
        route: '/(tabs)/instructors',
        icon: User,
        pathMatch: '/instructors',
      },
      {
        label: 'Settings',
        route: '/(tabs)/settings',
        icon: SettingsIcon,
        pathMatch: '/settings',
      },
    ],
    COORDINATOR: [
      {
        label: 'Home',
        route: '/(tabs)/home',
        icon: HomeIcon,
        pathMatch: '/home',
      },
      {
        label: 'Schedule',
        route: '/(tabs)/schedule',
        icon: CalendarIcon,
        pathMatch: '/schedule',
      },
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
                  router.push('/(drawer)/(tabs)/profile');
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
            </>
          )}
        </View>
      </View>
      {menuItemsByRole[role].map((item) => (
        <DrawerItem
          key={item.label}
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
            props.navigation.closeDrawer?.();
          }}
        />
      ))}
      <Divider className="my-2" />
      <DrawerItem
        icon={({ size }) => (
          <LogOutIcon size={size} />
        )}
        labelStyle={[{ color: '#000' }]}
        label="Logout"
        onPress={() => {
          logoutMutation.mutate();
          queryClient.removeQueries({ queryKey: ['session'], exact: true });
          queryClient.setQueryData(['session'], null);
          router.replace('/');
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  const { width: windowWidth } = Dimensions.get('window');
  const drawerWidth = Math.max(200, Math.min(320, Math.round(windowWidth * 0.55)));

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false, drawerStyle: { width: drawerWidth } }}
    >
    </Drawer>
  );
}
