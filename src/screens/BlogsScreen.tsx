import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TextInput } from 'react-native';
import { Button, ButtonText, Fab, FabIcon, Box } from '@/components/ui';
import { BadgePlusIcon } from 'lucide-react-native';
import { Pressable } from '@/components/ui/pressable';
import api from '@/server/axios';
import { Alert, AlertText, Skeleton } from '@/components/ui';
import { API_PATHS } from '@/util/endpoints';
import { BlogLight } from '@/util/types/blog';
import BlogCard from '@/components/blog/BlogCard';
import { router, useFocusEffect } from 'expo-router';
import { useSessionQuery } from '@/lib/auth/session';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

export default function BlogsScreen() {
  const [blogs, setBlogs] = useState<BlogLight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [titleQuery, setTitleQuery] = useState<string>('');
  const [tagQuery, setTagQuery] = useState<string>('');
  const { data: sessionData } = useSessionQuery();
  // @ts-ignore
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';
  const showToast = useAppToast();

  const buildQueryString = (
    pageToLoad: number,
    overrides?: { titleQuery?: string; tagQuery?: string },
  ) => {
    const effectiveTitle = overrides?.titleQuery ?? titleQuery;
    const effectiveTag = overrides?.tagQuery ?? tagQuery;

    const params = new URLSearchParams({
      page: pageToLoad.toString(),
      limit: limit.toString(),
    });

    if (effectiveTitle.trim()) {
      params.append('q', effectiveTitle.trim());
    }

    if (effectiveTag.trim()) {
      params.append('tag', effectiveTag.trim());
    }

    return params.toString();
  };

  const loadBlogs = async (
    pageToLoad: number,
    reset: boolean = false,
    overrides?: { titleQuery?: string; tagQuery?: string },
  ) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await api.get(
        `${API_PATHS.getBlogs}?${buildQueryString(pageToLoad, overrides)}`,
      );
      const newBlogs: BlogLight[] = response.data.data;

      if (newBlogs.length === 0) {
        setHasMore(false);
        if (reset) setBlogs([]);
      } else {
        setBlogs((prev) => (reset ? newBlogs : [...prev, ...newBlogs]));
        setPage(pageToLoad + 1);
        setHasMore(true);
      }
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Failed to fetch blogs.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = () => {
    if (!hasMore || loading) return;
    return loadBlogs(page);
  };

  const handleClearFilters = () => {
    setTitleQuery('');
    setTagQuery('');
    setHasMore(true);
    setPage(1);
    loadBlogs(1, true, { titleQuery: '', tagQuery: '' });
  };

  useEffect(() => {
    loadBlogs(1, true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadBlogs(1, true);
    }, []),
  );

  const onRefresh = React.useCallback(async () => {
    if (refreshing || loading) return;
    setRefreshing(true);
    setHasMore(true);
    await loadBlogs(1, true);
    setRefreshing(false);
  }, [refreshing, loading, titleQuery, tagQuery]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <Box className="p-2 bg-white dark:bg-gray-800 shadow-md">
        <TextInput
          value={titleQuery}
          onChangeText={setTitleQuery}
          placeholder="Filter by title"
          autoCapitalize="none"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <TextInput
          value={tagQuery}
          onChangeText={setTagQuery}
          placeholder="Filter by tag"
          autoCapitalize="none"
          className="w-full rounded-md border border-gray-300 px-3 py-2 mt-1"
        />
        <Box className="flex-row gap-2 justify-between mt-2">
          <Button disabled={loading} onPress={() => loadBlogs(1, true)} className="flex-1 rounded-md">
            <ButtonText>Apply Filters</ButtonText>
          </Button>
          <Button action="secondary" disabled={loading} onPress={handleClearFilters} className="flex-1 rounded-md">
            <ButtonText>Clear Filters</ButtonText>
          </Button>
        </Box>
      </Box>
      <FlatList
        className="flex-1 px-2"
        data={blogs}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/blog/${item.id}`)}>
            <BlogCard blog={item} />
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={fetchBlogs}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={() => {
          if (loading) return null;
          return (
            <Alert className="w-full max-w-md mt-4" action="info" variant="solid">
              <AlertText className="text-center">No blogs available.</AlertText>
            </Alert>
          );
        }}
        ListFooterComponent={() => {
          if (!loading) return null;
          return (
            <>
              <Skeleton className="h-40 w-full mb-4 rounded-lg" />
              <Skeleton className="h-40 w-full mb-4 rounded-lg" />
            </>
          );
        }}
      />
      {role === 'COORDINATOR' && (
        <Fab
          onPress={() => router.push('/blogEditor')}
          size="md"
          placement="bottom right"
          className="bg-success-600 hover:bg-success-700 active:bg-success-800"
        >
          <FabIcon as={BadgePlusIcon} width={25} height={25} />
        </Fab>
      )}
    </SafeAreaView>
  );
}
