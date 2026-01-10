import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Box,
  Skeleton,
  Fab,
  FabIcon,
  Alert,
  AlertText,
  Button,
  ButtonText,
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
  CheckIcon,
} from '@/components/ui';
import { BadgePlusIcon } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import api from '@/server/axios';
import { API_PATHS } from '@/util/endpoints';
import { BroadcastHistory } from '@/util/types/broadcast';
import NotificationLogCard from '@/components/broadcasts/NotificationLogCard';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useSessionQuery } from '@/lib/auth/session';

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const formatDate = (d?: Date) => {
  if (!d) return '—';
  return d.toLocaleDateString();
};

type FilterOverrides = {
  onlyOwned?: boolean;
  dateFrom?: Date | null;
  dateTo?: Date | null;
};

export default function BroadcastScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: sessionData } = useSessionQuery();
  // @ts-ignore
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';

  const [broadcasts, setBroadcasts] = useState<BroadcastHistory[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [onlyOwned, setOnlyOwned] = useState<boolean>(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const [appliedOnlyOwned, setAppliedOnlyOwned] = useState<boolean>(false);
  const [appliedDateFrom, setAppliedDateFrom] = useState<Date | undefined>(undefined);
  const [appliedDateTo, setAppliedDateTo] = useState<Date | undefined>(undefined);

  const showToast = useAppToast();

  const buildQueryString = (pageToLoad: number, overrides?: FilterOverrides) => {
    const effectiveOnlyOwned =
      overrides?.onlyOwned !== undefined ? overrides.onlyOwned : appliedOnlyOwned;

    const effectiveFrom =
      overrides?.dateFrom !== undefined ? overrides.dateFrom : appliedDateFrom;

    const effectiveTo =
      overrides?.dateTo !== undefined ? overrides.dateTo : appliedDateTo;

    const params = new URLSearchParams({
      onlyOwned: String(Boolean(effectiveOnlyOwned)),
      page: pageToLoad.toString(),
      limit: limit.toString(),
    });

    if (effectiveFrom) params.append('dateFrom', startOfDay(effectiveFrom).toISOString());
    if (effectiveTo) params.append('dateTo', endOfDay(effectiveTo).toISOString());

    return params.toString();
  };

  const loadBroadcastHistory = async (
    pageToLoad: number,
    reset: boolean = false,
    overrides?: FilterOverrides,
  ) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await api.get(
        `${API_PATHS.getNotificationLogs}?${buildQueryString(pageToLoad, overrides)}`,
      );

      const newItems: BroadcastHistory[] = response.data.data;

      if (newItems.length === 0) {
        setHasMore(false);
        if (reset) setBroadcasts([]);
      } else {
        setBroadcasts((prev) => (reset ? newItems : [...prev, ...newItems]));
        setPage(pageToLoad + 1);
        setHasMore(newItems.length >= limit);
      }
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Failed to fetch broadcast history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMore = () => {
    if (!hasMore || loading || refreshing) return;
    return loadBroadcastHistory(page, false);
  };

  useEffect(() => {
    void loadBroadcastHistory(1, true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadBroadcastHistory(1, true);
    }, []),
  );

  const onRefresh = useCallback(async () => {
    if (refreshing || loading) return;
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    await loadBroadcastHistory(1, true);
  }, [refreshing, loading]);

  const openFromPicker = useCallback(() => {
    DateTimePickerAndroid.open({
      value: dateFrom ?? new Date(),
      mode: 'date',
      is24Hour: true,
      onChange: (_event, selected) => {
        if (!selected) return;
        const nextFrom = startOfDay(selected);
        if (dateTo && nextFrom.getTime() > endOfDay(dateTo).getTime()) {
          setDateTo(nextFrom);
        }
        setDateFrom(nextFrom);
      },
    });
  }, [dateFrom, dateTo]);

  const openToPicker = useCallback(() => {
    DateTimePickerAndroid.open({
      value: dateTo ?? dateFrom ?? new Date(),
      mode: 'date',
      is24Hour: true,
      onChange: (_event, selected) => {
        if (!selected) return;
        const nextTo = startOfDay(selected);
        if (dateFrom && endOfDay(nextTo).getTime() < startOfDay(dateFrom).getTime()) {
          setDateFrom(nextTo);
        }
        setDateTo(nextTo);
      },
    });
  }, [dateFrom, dateTo]);

  const handleApplyFilters = useCallback(() => {
    setAppliedOnlyOwned(onlyOwned);
    setAppliedDateFrom(dateFrom);
    setAppliedDateTo(dateTo);

    setHasMore(true);
    setPage(1);

    void loadBroadcastHistory(1, true, {
      onlyOwned,
      dateFrom: dateFrom ?? null,
      dateTo: dateTo ?? null,
    });
  }, [onlyOwned, dateFrom, dateTo]);

  const handleClearFilters = useCallback(() => {
    setOnlyOwned(false);
    setDateFrom(undefined);
    setDateTo(undefined);

    setAppliedOnlyOwned(false);
    setAppliedDateFrom(undefined);
    setAppliedDateTo(undefined);

    setHasMore(true);
    setPage(1);

    void loadBroadcastHistory(1, true, { onlyOwned: false, dateFrom: null, dateTo: null });
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <Box className="p-2 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <Checkbox
          value="Only My Broadcasts"
          className="flex-row items-center p-2"
          isChecked={onlyOwned}
          onChange={setOnlyOwned}
        >
          <CheckboxIndicator>
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
          <CheckboxLabel className="ml-2">Only My Broadcasts</CheckboxLabel>
        </Checkbox>

        <Box className="mt-2">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button variant="outline" action="secondary" onPress={openFromPicker} className="flex-1 rounded-md">
              <ButtonText>From: {formatDate(dateFrom)}</ButtonText>
            </Button>
            <Button variant="outline" action="secondary" onPress={openToPicker} className="flex-1 rounded-md">
              <ButtonText>To: {formatDate(dateTo)}</ButtonText>
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
        data={broadcasts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NotificationLogCard broadcast={item} />}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={() => {
          if (loading) return null;
          return (
            <Alert className="w-full max-w-md mt-4" action="info" variant="solid">
              <AlertText className="text-center">No broadcast history available.</AlertText>
            </Alert>
          );
        }}
        ListFooterComponent={() => {
          if (!loading || refreshing) return null;
          return (
            <Box className="pb-4">
              <Skeleton variant="rounded" className="h-[100px] w-full" />
              <Skeleton variant="rounded" className="h-[100px] w-full mt-2" />
            </Box>
          );
        }}
      />

      <Fab
        onPress={() => router.push({ pathname: '/broadcast/send' })}
        size="md"
        placement="bottom right"
        className="bg-success-600 hover:bg-success-700 active:bg-success-800"
      >
        <FabIcon as={BadgePlusIcon} width={25} height={25} />
      </Fab>
    </SafeAreaView>
  );
}
