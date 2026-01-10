import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@/server/axios';
import { API_PATHS, getApiUrl } from '@/util/endpoints';
import { CourseProp } from '@/util/types/course';
import CourseCard from '@/components/courses/CourseCard';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';
import {
  Box,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  Skeleton,
  Alert,
  AlertText,
} from '@/components/ui';
import { Button, ButtonText } from '@/components/ui/button';

const normalize = (v: unknown) => String(v ?? '').toLowerCase().trim();

const matchesCourse = (course: CourseProp, query: string) => {
  const q = normalize(query);
  if (!q) return true;

  const title = (course as any).name ?? (course as any).title ?? '';
  const description = (course as any).description ?? '';
  const category = (course as any).danceCategoryName ?? (course as any).danceCategory?.name ?? '';
  const level = (course as any).advancementLevelName ?? (course as any).advancementLevel?.name ?? '';
  const instructor = `${(course as any).instructorName ?? ''} ${(course as any).instructorSurname ?? ''}`.trim();

  const haystack = [title, description, category, level, instructor]
    .map(normalize)
    .filter(Boolean)
    .join(' ');

  return haystack.includes(q);
};

const getCoursePrice = (course: CourseProp): number | null => {
  const raw =
    (course as any).price ??
    (course as any).cost ??
    (course as any).amount ??
    (course as any).ticketPrice ??
    null;

  const n = typeof raw === 'number' ? raw : Number(String(raw ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

const parsePriceInput = (v: string): number | null => {
  const s = normalize(v).replace('zł', '').replace(/\s+/g, '').replace(',', '.');
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

export default function CoursesScreen() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [courses, setCourses] = useState<CourseProp[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>('');

  const [priceMinText, setPriceMinText] = useState<string>('');
  const [priceMaxText, setPriceMaxText] = useState<string>('');

  const [appliedPriceMin, setAppliedPriceMin] = useState<number | null>(null);
  const [appliedPriceMax, setAppliedPriceMax] = useState<number | null>(null);

  const [displayedCourses, setDisplayedCourses] = useState<CourseProp[]>([]);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const showToast = useAppToast();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get(getApiUrl(API_PATHS.getScheduleCourses));
      setCourses(response.data as CourseProp[]);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCourses();
  }, []);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  }, [refreshing]);

  const handleApplyFilters = useCallback(() => {
    setAppliedSearchQuery(searchQuery);
    setAppliedPriceMin(parsePriceInput(priceMinText));
    setAppliedPriceMax(parsePriceInput(priceMaxText));
  }, [priceMaxText, priceMinText, searchQuery]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setAppliedSearchQuery('');

    setPriceMinText('');
    setPriceMaxText('');
    setAppliedPriceMin(null);
    setAppliedPriceMax(null);
  }, []);

  const filteredCourses = useMemo(() => {
    const minP = appliedPriceMin;
    const maxP = appliedPriceMax;

    return courses.filter((c) => {
      if (!matchesCourse(c, appliedSearchQuery)) return false;

      if (minP == null && maxP == null) return true;

      const p = getCoursePrice(c);
      if (p == null) return false;

      if (minP != null && p < minP) return false;
      if (maxP != null && p > maxP) return false;
      return true;
    });
  }, [courses, appliedPriceMax, appliedPriceMin, appliedSearchQuery]);

  const resetPagination = useCallback(
    (source: CourseProp[]) => {
      const first = source.slice(0, limit);
      setDisplayedCourses(first);
      setPage(1);
      setHasMore(source.length > first.length);
    },
    [limit],
  );

  useEffect(() => {
    resetPagination(filteredCourses);
  }, [filteredCourses, resetPagination]);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const start = (nextPage - 1) * limit;
      const end = start + limit;
      const nextSlice = filteredCourses.slice(start, end);

      if (nextSlice.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedCourses((prev) => [...prev, ...nextSlice]);
        setPage(nextPage);
        setHasMore(filteredCourses.length > end);
      }

      setLoadingMore(false);
    }, 600);
  }, [filteredCourses, hasMore, limit, loading, loadingMore, page]);

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <Box className="p-2 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <Input className="h-10 items-center bg-white rounded-md border border-gray-300">
          <InputSlot className="pl-2">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            className="flex-1 py-0 h-full leading-none text-base"
            style={{ textAlignVertical: 'center', paddingVertical: 0 }}
          />
        </Input>

        <Box className="mt-2">
          <Box className="flex-row gap-2">
            <Input className="h-10 flex-1 items-center bg-white rounded-md border border-gray-300">
              <InputField
                type="text"
                placeholder="Min price"
                value={priceMinText}
                onChangeText={setPriceMinText}
                keyboardType="numeric"
                autoCapitalize="none"
                className="flex-1 py-0 h-full leading-none text-base"
                style={{ textAlignVertical: 'center', paddingVertical: 0 }}
              />
            </Input>

            <Input className="h-10 flex-1 items-center bg-white rounded-md border border-gray-300">
              <InputField
                type="text"
                placeholder="Max price"
                value={priceMaxText}
                onChangeText={setPriceMaxText}
                keyboardType="numeric"
                autoCapitalize="none"
                className="flex-1 py-0 h-full leading-none text-base"
                style={{ textAlignVertical: 'center', paddingVertical: 0 }}
              />
            </Input>
          </Box>
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
        className="flex-1 px-2"
        data={displayedCourses}
        keyExtractor={(item, index) => String((item as any).id ?? `course-${index}`)}
        renderItem={({ item }) => <CourseCard course={item} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 10 }}
        ListEmptyComponent={() => {
          if (loading || refreshing) return null;
          return (
            <Alert action="info" variant="outline" className="mt-4">
              <AlertText>No courses found</AlertText>
            </Alert>
          );
        }}
        ListFooterComponent={() => {
          if (!loading && !loadingMore) return null;
          return (
            <Box className="pb-4">
              <Skeleton className="h-40 w-full mt-2 rounded-lg" />
              <Skeleton className="h-40 w-full mt-2 rounded-lg" />
            </Box>
          );
        }}
      />
    </SafeAreaView>
  );
}
