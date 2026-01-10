import React, { useState, useEffect, useCallback } from 'react';
import { FlatList } from 'react-native';
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

export default function BroadcastScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [broadcasts, setBroadcasts] = useState<BroadcastHistory[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [onlyOwned, setOnlyOwned] = useState<boolean>(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const showToast = useAppToast();

  const fetchBroadcastHistory = async (targetPage: number) => {
    if (loading || (!hasMore && targetPage !== 1)) return;
    setLoading(true);

    try {
      const response = await api.get(
        API_PATHS.getNotificationLogs +
          `?onlyOwned=${onlyOwned}&page=${targetPage}&limit=${limit}`
      );
      const newBroadcasts = response.data.data;

      if (targetPage === 1) {
        setBroadcasts(newBroadcasts);
        setHasMore(newBroadcasts.length >= limit);
      } else {
        if (newBroadcasts.length === 0) {
          setHasMore(false);
        } else {
          setBroadcasts((prevBroadcasts) => [
            ...prevBroadcasts,
            ...newBroadcasts,
          ]);
          setHasMore(newBroadcasts.length >= limit);
        }
      }
      setPage(targetPage);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Failed to fetch broadcast history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBroadcastHistory(1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBroadcastHistory(1);
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchBroadcastHistory(1);
    setRefreshing(false);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchBroadcastHistory(page + 1);
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <FlatList
        className="flex-1 p-2"
        data={broadcasts}
        renderItem={({ item }) => (
          <NotificationLogCard key={item.id} broadcast={item} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <Box className="p-1 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-2">
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
            <Button
              disabled={loading}
              onPress={() => fetchBroadcastHistory(1)}
              className="mt-1 rounded-md"
            >
              <ButtonText>Apply Filters</ButtonText>
            </Button>
          </Box>
        }
        ListEmptyComponent={() => {
          if (loading) return null;
          return (
            <Alert
              className="w-full max-w-md mt-4"
              action="info"
              variant="solid"
            >
              <AlertText className="text-center">
                No broadcast history available.
              </AlertText>
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
