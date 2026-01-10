import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Blog } from '@/util/types/blog';
import api from '@/server/axios';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import { API_PATHS } from '@/util/endpoints';
import { RefreshControl, ScrollView } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { PinIcon, SquarePenIcon, Trash2Icon } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { formattedDate } from '@/util/dates';
import { Divider } from '@/components/ui/divider';
import { useSessionQuery } from '@/lib/auth/session';
import {
  Fab,
  FabIcon,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
  Button } from '@/components/ui';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

export default function BlogScreen() {
  const { blogId }  = useLocalSearchParams();
  const [blog, setBlog] = useState<Blog>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: sessionData } = useSessionQuery();
  // @ts-ignore
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const showToast = useAppToast();

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_PATHS.getBlogs}/${blogId}`);
      setBlog(response.data);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Failed to fetch blog.');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`${API_PATHS.postBlog}/${blogId}`);
      showToast({
        title: 'Blog deleted successfully.',
        type: 'success',
      })
      router.push('/blogs');
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Failed to delete blog.');
    } finally {
      setShowDeleteDialog(false);
    }
  }

  const togglePin = async () => {
    try {
      if (blog?.isPinned) {
        await api.patch(`blog/posts/${blogId}/unpin`);
        showToast({
          title: 'Blog unpinned successfully.',
          type: 'success',
        })
      } else {
        const now = new Date();
        const pinnedUntil = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate(),
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds(),
        ).toISOString();

        await api.patch(`blog/posts/${blogId}/pin`, {
          pinnedUntil,
        });
        showToast({
          title: 'Blog pinned successfully.',
          type: 'success',
        });
      }
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Failed to toggle pin status.');
    } finally {
      fetchBlog();
    }
  }

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchBlog().then(() => setRefreshing(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
        <ScrollView style={{ padding: 6 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Divider className="my-4" />
            <Skeleton className="h-40 w-full mb-4 rounded-lg" />
          </Box>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <ScrollView style={{ padding: 6 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
          <Box className="mb-4 flex-row items-center">
            <Heading size="lg" className="flex-1 text-black dark:text-white">
              {blog?.title}
            </Heading>
            {role === 'COORDINATOR' ? (
              <Box className="flex-row items-center ml-2">
                {blog && blog.isPinned && (
                  <Badge
                    action="info"
                    className="mr-2 flex-row items-center"
                  >
                    <PinIcon size={16} className="mr-1" />
                  </Badge>
                )}
                <Button
                  size="md"
                  variant="outline"
                  onPress={togglePin}
                  className="px-2"
                >
                  <Text className="text-md">
                    {blog?.isPinned ? 'Unpin' : 'Pin'}
                  </Text>
                </Button>
              </Box>
            ) : (
              <>
              {blog && blog.isPinned && (
                <Badge action="info" className="ml-2 flex-row items-center">
                  <PinIcon size={16} className="mr-1" />
                </Badge>
              )}
              </>
            )}
          </Box>
          {blog?.tags && blog.tags.length > 0 && (
          <Box className="flex-row flex-wrap mb-4">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline" action="warning" className="mr-2 mb-2 rounded-lg">
                <Text className="text-sm">{tag}</Text>
              </Badge>
            ))}
          </Box>
          )}
          <Box className="flex-row flex-wrap mb-2">
            <Text className="text-sm italic text-gray-600">
              Reading Time: {blog?.readingTime ?? '—'} min.
            </Text>
          </Box>
          <Box className="flex-row items-center justify-between mb-4">
            <Text className="text-sm">Author: {blog?.authorId ?? '—'}</Text>
            <Text className="text-sm text-gray-500">
              {blog?.createdAt ? formattedDate(new Date(blog.createdAt)) : '—'}
            </Text>
          </Box>
          <Divider className="mb-4" />
          <Markdown
            style={markdownStyles}
          >
            {blog?.content}
          </Markdown>
        </Box>
      </ScrollView>
      <AlertDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <AlertDialogBackdrop className="flex-1 items-center justify-center" />
        <AlertDialogContent className="opacity-100">
          <AlertDialogHeader>
            <Text className="text-black dark:text-white text-lg font-bold">Delete Blog</Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-black dark:text-white">Are you sure you want to delete this blog? This action cannot be undone.</Text>
          </AlertDialogBody>
          <AlertDialogFooter className="mt-2">
            <Button variant="outline" onPress={() => setShowDeleteDialog(false)} className="mr-2">
              <Text className="text-black dark:text-white">Cancel</Text>
            </Button>
            <Button variant="solid" action="negative" onPress={handleDelete}>
              <Text className="text-white">Delete</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {role === 'COORDINATOR' && (
        <>
          <Fab
            onPress={() => router.push(`/blogEditor?blogId=${blogId}`)}
            size="md"
            placement="bottom right"
            className="mb-16 bg-info-600 hover:bg-info-700 active:bg-info-800"
          >
            <FabIcon as={SquarePenIcon} width={25} height={25} />
          </Fab>

          <Fab
            onPress={() => setShowDeleteDialog(true)}
            size="md"
            placement="bottom right"
            className="bg-error-600 hover:bg-error-700 active:bg-error-800"
          >
            <FabIcon as={Trash2Icon} width={25} height={25} />
          </Fab>
        </>
      )}
    </SafeAreaView>
  );
}

const markdownStyles = {
  body: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 16,
    paddingTop: 6,
    paddingBottom: 6,
  },
  heading2: {
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 12,
    paddingTop: 4,
    paddingBottom: 4,
  },
  heading3: {
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 10,
    paddingTop: 3,
    paddingBottom: 3,
  },
  link: {
    color: '#3B82F6',
  },
};