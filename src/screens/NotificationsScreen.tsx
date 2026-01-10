import React, { useEffect, useState, useCallback } from 'react';
import api from '@/server/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, View } from 'react-native';
import Notification from '@/components/notification/notification';
import { Alert, AlertText, Skeleton, Box } from '@/components/ui';
import NotificationDetails from '@/components/notification/notificationDetails';
import { NotificationProp } from '@/util/types/notification';
import { API_PATHS } from '@/util/endpoints';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';
import { Button, ButtonText } from '@/components/ui/button';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const formatDate = (d: Date | null) => {
  if (!d) return '—';
  return d.toLocaleDateString();
};

const toIso = (d: Date) => d.toISOString();

type DateOverrides = { dateFrom?: Date | null; dateTo?: Date | null };

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationProp[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationProp | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const [appliedFromDate, setAppliedFromDate] = useState<Date | null>(null);
  const [appliedToDate, setAppliedToDate] = useState<Date | null>(null);

  const showToast = useAppToast();

  const buildQueryString = (pageToLoad: number, overrides?: DateOverrides) => {
    const effectiveFrom = overrides?.dateFrom !== undefined ? overrides.dateFrom : appliedFromDate;
    const effectiveTo = overrides?.dateTo !== undefined ? overrides.dateTo : appliedToDate;

    const params = new URLSearchParams({
      page: pageToLoad.toString(),
      limit: limit.toString(),
    });

    if (effectiveFrom) params.append('dateFrom', toIso(startOfDay(effectiveFrom)));
    if (effectiveTo) params.append('dateTo', toIso(endOfDay(effectiveTo)));

    return params.toString();
  };

  const loadNotifications = async (
    pageToLoad: number,
    reset: boolean = false,
    overrides?: DateOverrides,
  ) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await api.get(
        `${API_PATHS.getNotifications}?${buildQueryString(pageToLoad, overrides)}`,
      );
      const newItems: NotificationProp[] = response.data.data;

      if (newItems.length === 0) {
        setHasMore(false);
        if (reset) setNotifications([]);
      } else {
        setNotifications((prev) => (reset ? newItems : [...prev, ...newItems]));
        setPage(pageToLoad + 1);
        setHasMore(newItems.length >= limit);
      }
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchNotifications = () => {
    if (!hasMore || loading) return;
    return loadNotifications(page, false);
  };

  useEffect(() => {
    void loadNotifications(1, true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadNotifications(1, true);
    }, []),
  )

  const onRefresh = useCallback(async () => {
    if (refreshing || loading) return;
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    await loadNotifications(1, true);
  }, [refreshing, loading]);

  const openFromPicker = useCallback(() => {
    DateTimePickerAndroid.open({
      value: fromDate ?? new Date(),
      mode: 'date',
      is24Hour: true,
      onChange: (_event, selected) => {
        if (!selected) return;
        const nextFrom = startOfDay(selected);
        if (toDate && nextFrom.getTime() > endOfDay(toDate).getTime()) {
          setToDate(nextFrom);
        }
        setFromDate(nextFrom);
      },
    });
  }, [fromDate, toDate]);

  const openToPicker = useCallback(() => {
    DateTimePickerAndroid.open({
      value: toDate ?? fromDate ?? new Date(),
      mode: 'date',
      is24Hour: true,
      onChange: (_event, selected) => {
        if (!selected) return;
        const nextTo = startOfDay(selected);
        if (fromDate && endOfDay(nextTo).getTime() < startOfDay(fromDate).getTime()) {
          setFromDate(nextTo);
        }
        setToDate(nextTo);
      },
    });
  }, [fromDate, toDate]);

  const handleApplyFilters = useCallback(() => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);

    setHasMore(true);
    setPage(1);
    void loadNotifications(1, true, { dateFrom: fromDate, dateTo: toDate });
  }, [fromDate, toDate]);

  const handleClearFilters = useCallback(() => {
    setFromDate(null);
    setToDate(null);
    setAppliedFromDate(null);
    setAppliedToDate(null);

    setHasMore(true);
    setPage(1);
    void loadNotifications(1, true, { dateFrom: null, dateTo: null });
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <Box className="p-2 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <Box className="mt-2">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              variant="outline"
              action="secondary"
              onPress={openFromPicker}
              className="flex-1 rounded-md"
            >
              <ButtonText>From: {formatDate(fromDate)}</ButtonText>
            </Button>
            <Button
              variant="outline"
              action="secondary"
              onPress={openToPicker}
              className="flex-1 rounded-md"
            >
              <ButtonText>To: {formatDate(toDate)}</ButtonText>
            </Button>
          </View>
        </Box>

        <Box className="flex-row gap-2 justify-between mt-2">
          <Button disabled={loading} onPress={handleApplyFilters} className="flex-1 rounded-md">
            <ButtonText>Apply Filters</ButtonText>
          </Button>
          <Button action="secondary" disabled={loading} onPress={handleClearFilters} className="flex-1 rounded-md">
            <ButtonText>Clear Filters</ButtonText>
          </Button>
        </Box>
      </Box>

      <FlatList
        className="flex-1 p-2"
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Notification
            notification={item}
            onPress={(it) => {
              setSelectedNotification(it);
              setVisible(true);
            }}
          />
        )}
        onEndReached={fetchNotifications}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={refreshing}
        contentContainerStyle={{ paddingBottom: 10 }}
        ListEmptyComponent={() => {
          if (loading) return null;
          return (
            <Alert className="w-full max-w-md mt-4" action="info" variant="solid">
              <AlertText className="text-center">No notifications available.</AlertText>
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
          );
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
  );
}
