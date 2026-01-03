import React, { useEffect, useState, useCallback } from 'react';
import api from '@/server/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import Notification from '@/components/notification/notification';
import { Alert, AlertText, Skeleton, Box } from '@/components/ui';
import NotificationDetails from '@/components/notification/notificationDetails';
import { NotificationProp } from '@/util/types/notification';
import { API_PATHS } from '@/util/endpoints';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationProp[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationProp | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchNotifications = async (targetPage: number) => {
    if (loading || (!hasMore && targetPage !== 1)) return;
    setLoading(true);

    try {
      const response = await api.get(API_PATHS.getNotifications + `?dateFrom=2025-10-11T00:00:00Z&dateTo=2026-05-31T23:59:59Z&page=${targetPage}&limit=${limit}`);
      const newNotifications = response.data.data;

      if (targetPage === 1) {
        setNotifications(newNotifications);
        setHasMore(newNotifications.length >= limit);
      } else {
        if (newNotifications.length === 0) {
          setHasMore(false);
        } else {
          setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
          setHasMore(newNotifications.length >= limit);
        }
      }
      setPage(targetPage);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    fetchNotifications(1);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <FlatList
        className="flex-1 p-2"
        data={notifications}
        renderItem={({ item }) => (
          <Notification
            key={item.id}
            notification={item}
            onPress={(item) => {
              setSelectedNotification(item);
              setVisible(true);
            }}
          />
        )}
        onEndReached={handleLoadMore}
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
          if (!loading || refreshing) return null;
          return (
            <Box className="pb-4">
              <Skeleton variant="rounded" className="h-[100px] w-full m-2" />
              <Skeleton variant="rounded" className="h-[100px] w-full m-2" />
            </Box>
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