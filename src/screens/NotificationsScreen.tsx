import React, { useEffect, useState } from 'react';
import api from '@/server/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import Notification from '@/components/notification/notification';
import { Alert, AlertText, Skeleton } from '@/components/ui';
import NotificationDetails from '@/components/notification/notificationDetails';

interface NotificationProp {
  id: number,
  title: string,
  body: string,
  sendDate: Date,
  payload: object,
  hasBeenRead: boolean,
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationProp[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationProp | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, _] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchNotifications = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await api.get(`/notification/notification?dateFrom=2025-10-11T00:00:00Z&dateTo=2026-05-31T23:59:59Z&page=${page}&limit=${limit}`);
      const newNotifications = response.data.data;

      if (newNotifications.length === 0) {
        setHasMore(false);
      } else {
        setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching more notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = React.useCallback(() => {
    if (refreshing || loading) return;
    setRefreshing(true);
    setPage(1)
    setNotifications([]);
    fetchNotifications().then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
      <FlatList
        className="flex-1 mt-2"
        data={notifications}
        renderItem={({ item }) => {
          console.log(item);
          return (
            <Notification
              key={item.id}
              notification={item}
              onPress={(item) => {
                setSelectedNotification(item);
                setVisible(true);
              }}
            />
          )
        }}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={fetchNotifications}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={() => {
          if (loading) return null;
          return (
            <Alert className="w-full max-w-md mt-4" action="info" variant='solid'>
              <AlertText className="text-center">
                No notifications available.
              </AlertText>
            </Alert>
          );
        }}
        ListFooterComponent={() => {
          if (!loading) return null;
          return (
            <>
              <Skeleton variant="rounded" className="h-[100px] w-full m-2" />
              <Skeleton variant="rounded" className="h-[100px] w-full m-2" />
              <Skeleton variant="rounded" className="h-[100px] w-full m-2" />
            </>
          )
        }}
      />
      <NotificationDetails
        notification={selectedNotification}
        visible={visible}
        onClose={() => {
          setVisible(false);
          setSelectedNotification(null);
        }}
      />
    </SafeAreaView>
  )
}