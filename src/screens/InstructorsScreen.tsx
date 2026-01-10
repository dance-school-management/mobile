import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import api from '@/server/axios';
import { API_PATHS } from '@/util/endpoints';
import { InstructorShort } from '@/util/types/instructors';
import { Pressable } from '@/components/ui/pressable';
import InstructorCard from '@/components/instructor/InstructorCard';
import { Alert, AlertText } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Box, Input, InputField, InputIcon, InputSlot, SearchIcon } from '@/components/ui';
import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

const normalize = (v: unknown) => String(v ?? '').toLowerCase().trim();

const matchesInstructor = (instructor: InstructorShort, query: string) => {
  const q = normalize(query);
  if (!q) return true;

  const fullName = `${(instructor as any).name ?? ''} ${(instructor as any).surname ?? ''}`.trim();

  const haystack = [fullName, (instructor as any).description]
    .map(normalize)
    .filter(Boolean)
    .join(' ');

  return haystack.includes(q);
};

export default function InstructorsScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [instructors, setInstructors] = useState<InstructorShort[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>('');

  const [displayedInstructors, setDisplayedInstructors] = useState<InstructorShort[]>([]);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const showToast = useAppToast();

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_PATHS.getInstructors);
      setInstructors(response.data.instructors as InstructorShort[]);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching instructors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInstructors();
  }, []);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchInstructors();
    setRefreshing(false);
  }, [refreshing]);

  const handleApplyFilters = useCallback(() => {
    setAppliedSearchQuery(searchQuery);
  }, [searchQuery]);

  const filteredInstructors = useMemo(() => {
    return instructors.filter((i) => matchesInstructor(i, appliedSearchQuery));
  }, [instructors, appliedSearchQuery]);

  const resetPagination = useCallback(
    (source: InstructorShort[]) => {
      const first = source.slice(0, limit);
      setDisplayedInstructors(first);
      setPage(1);
      setHasMore(source.length > first.length);
    },
    [limit],
  );

  useEffect(() => {
    resetPagination(filteredInstructors);
  }, [filteredInstructors, resetPagination]);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const start = (nextPage - 1) * limit;
      const end = start + limit;
      const nextSlice = filteredInstructors.slice(start, end);

      if (nextSlice.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedInstructors((prev) => [...prev, ...nextSlice]);
        setPage(nextPage);
        setHasMore(filteredInstructors.length > end);
      }

      setLoadingMore(false);
    }, 600);
  }, [filteredInstructors, hasMore, limit, loading, loadingMore, page]);

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <Box className="p-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
        <Input className="h-12 items-center bg-white rounded-md border border-gray-300">
          <InputSlot className="pl-2">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField
            type="text"
            placeholder="Search instructors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            className="flex-1 py-0 h-full leading-none text-base"
            style={{ textAlignVertical: 'center', paddingVertical: 0 }}
          />
        </Input>

        <Button disabled={loading} onPress={handleApplyFilters} className="mt-2 rounded-md">
          <ButtonText>Apply Filters</ButtonText>
        </Button>
      </Box>
      <FlatList
        className="flex-1 px-2"
        data={displayedInstructors}
        keyExtractor={(item) => `instructor-${(item as any).id}-${(item as any).name}-${(item as any).surname}`}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/instructor/${(item as any).id}`)}>
            <InstructorCard instructor={item} />
          </Pressable>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => {
          if (loading || refreshing) return null;
          return (
            <Alert action="info" className="mt-4">
              <AlertText>No instructors found.</AlertText>
            </Alert>
          );
        }}
        ListFooterComponent={() => {
          if (!loadingMore) return null;
          return (
            <Box className="pb-4">
              <Skeleton className="h-30 w-full mt-4 mb-4" />
              <Skeleton className="h-30 w-full mt-4 mb-4" />
            </Box>
          );
        }}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </SafeAreaView>
  );
}
