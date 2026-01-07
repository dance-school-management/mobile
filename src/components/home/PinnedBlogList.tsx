import { Box, Button, Pressable, Text } from '@/components/ui';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/server/axios';
import { API_PATHS } from '@/util/endpoints';
import { Blog } from '@/util/types/blog';
import BlogCard from '@/components/blog/BlogCard';

export default function PinnedBlogList({ refreshKey }: { refreshKey: number }) {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_PATHS.getBlogs}?page=1&limit=3`);
      const data = response.data;
      setBlogs(data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [refreshKey]);

  if (loading) {
    return (
      <Box className="mb-3">
        <Text className="text-3xl font-bold text-black mb-2">Blog Posts</Text>
        <Skeleton className="h-40 w-full mt-4 mb-4" />
        <Skeleton className="h-40 w-full mt-4 mb-4" />
        <Skeleton className="h-40 w-full mt-4 mb-4" />
      </Box>
    );
  }

  return (
    <Box className="mb-3">
      <Box className="flex-row justify-between items-center mb-2">
        <Text className="text-3xl font-bold text-black mb-2">Blog Posts</Text>
        <Button
          className="px-3 py-1 border border-gray-300 rounded-md bg-white"
          variant="outline"
          onPress={() => router.push('/blogs')}
        >
          <Text className="text-sm">See All Blogs</Text>
        </Button>
      </Box>
      {blogs.map((blog) => (
        <Pressable
          key={blog.id}
          onPress={() => router.push(`/blog/${blog.id}`)}
        >
          <BlogCard blog={blog} />
        </Pressable>
      ))}
    </Box>
  );
}
