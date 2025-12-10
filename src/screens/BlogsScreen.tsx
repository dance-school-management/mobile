import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { Pressable } from '@/components/ui/pressable';
import api from '@/server/axios';
import { Alert, AlertText, Skeleton } from '@/components/ui';
import { API_PATHS } from '@/util/endpoints';
import { BlogLight } from '@/util/types/blog';
import BlogCard from '@/components/blog/BlogCard';
import { router } from 'expo-router';

export default function BlogsScreen() {
  const [blogs, setBlogs] = useState<BlogLight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, _] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadBlogs = async (pageToLoad: number, reset: boolean = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await api.get(`${API_PATHS.getBlogs}?page=${pageToLoad}&limit=${limit}`);
      const newBlogs: BlogLight[] = response.data.data;

      if (newBlogs.length === 0) {
        setHasMore(false);
        if (reset) setBlogs([]);
      } else {
        setBlogs((prev) => reset ? newBlogs : [...prev, ...newBlogs]);
        setPage(pageToLoad + 1);
        setHasMore(true);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = () => {
    if (!hasMore || loading) return;
    return loadBlogs(page);
  };

  useEffect(() => {
    loadBlogs(1, true);
  }, []);

  const onRefresh = React.useCallback(async () => {
    if (refreshing || loading) return;
    setRefreshing(true);
    setHasMore(true);
    await loadBlogs(1, true);
    setRefreshing(false);
  }, [refreshing, loading]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <FlatList
        className="flex-1 mt-2 px-4"
        data={blogs}
        renderItem={({ item }) => {
          return (
            <Pressable onPress={() => {router.push(`/(drawer)/(tabs)/blog/${item.id}`)}}>
              <BlogCard blog={item} />
            </Pressable>
          )
        }}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={fetchBlogs}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={() => {
          if (loading) return null;
          return (
            <Alert className="w-full max-w-md mt-4" action="info" variant='solid'>
              <AlertText className="text-center">
                No blogs available.
              </AlertText>
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
          )
        }}
      />
    </SafeAreaView>
  )
}