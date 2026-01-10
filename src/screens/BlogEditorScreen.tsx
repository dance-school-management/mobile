import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Box, Button, Skeleton, Divider } from '@/components/ui';
import {
  HeadingIcon,
  BoldIcon,
  ItalicIcon,
  ListIcon,
  CodeIcon,
  HighlighterIcon,
  XIcon,
} from 'lucide-react-native';
import api from "@/server/axios";
import { API_PATHS } from "@/util/endpoints";
import { router, useLocalSearchParams } from "expo-router";
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

export default function BlogEditorScreen() {
  const { blogId } = useLocalSearchParams<{ blogId?: string }>();
  const [content, setContent] = useState<string>('# New blog heading\n\nhere context in Markdown...');
  const [title, setTitle] = useState<string>('');
  const [excerpt, setExcerpt] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const showToast = useAppToast();

  useEffect(() => {
    if (!blogId) return;
    setLoading(true);
    const fetchBlog = async () => {
      try {
        const response = await api.get(`${API_PATHS.postBlog}/${blogId}`);
        const blogData = response.data;
        setTitle(blogData.title);
        setExcerpt(blogData.excerpt);
        setContent(blogData.content);
        setTags(blogData.tags || []);
      } catch (error) {
        showToastErrorAxiosMessage(showToast, error, 'Failed to fetch blog.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const insertAtSelection = (before: string, after: string = '') => {
    const start = selection.start;
    const end = selection.end;
    const text = content;

    const selectedText = text.slice(start, end);
    const newText =
      text.slice(0, start) + before + selectedText + after + text.slice(end);

    const cursorPos = start + before.length + selectedText.length + after.length;

    setContent(newText);
    setSelection({ start: cursorPos, end: cursorPos });
  };

  const applyHeader = () => {
    const startOfLine = content.lastIndexOf('\n', selection.start - 1) + 1;
    const newText =
      content.slice(0, startOfLine) + '# ' + content.slice(startOfLine);
    const offset = 2;
    setContent(newText);
    setSelection({
      start: selection.start + offset,
      end: selection.end + offset,
    });
  };

  const applyBold = () => {
    insertAtSelection('**', '**');
  };

  const applyItalic = () => {
    insertAtSelection('*', '*');
  };

  const applyBulletList = () => {
    const startOfLine = content.lastIndexOf('\n', selection.start - 1) + 1;
    const newText =
      content.slice(0, startOfLine) + '- ' + content.slice(startOfLine);
    const offset = 2;
    setContent(newText);
    setSelection({
      start: selection.start + offset,
      end: selection.end + offset,
    });
  };

  const applyCodeInline = () => {
    insertAtSelection('`', '`');
  };

  const applyCodeBlock = () => {
    insertAtSelection('\n```ts\n', '\n```\n');
  };

  const handlePublishBlog = async () => {
    try {
      if (blogId) {
        await api.patch(`${API_PATHS.postBlog}/${blogId}`, {
          title,
          excerpt,
          content,
          tags,
          status: 'published',
        });
        showToast({
          title: 'Blog updated successfully.',
          type: 'success',
        });
      } else {
        await api.post(API_PATHS.postBlog, {
          title,
          excerpt,
          content,
          tags,
          status: 'published',
        });
        showToast({
          title: 'Blog published successfully.',
          type: 'success',
        });
      }
      router.push('/blogs');
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Failed to publish blog.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1" edges={['left', 'right']}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Divider className="my-4" />
            <Skeleton className="h-40 w-full mb-4 rounded-lg" />
          </Box>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-2">
          <Box className="mb-4 flex-row items-center">
            <Text className="font-bold text-lg">Title:</Text>
            <TextInput
              placeholder="Enter blog title"
              value={title}
              className="flex-1 ml-2 p-2 border border-gray-300 rounded-md"
              onChangeText={setTitle}
            />
          </Box>
          <Box className="mb-4 flex-row items-center">
            <Text className="font-bold text-lg">Excerpt:</Text>
            <TextInput
              placeholder="Enter blog excerpt"
              value={excerpt}
              className="flex-1 ml-2 p-2 border border-gray-300 rounded-md"
              onChangeText={setExcerpt}
            />
          </Box>
          <Box className="mb-4 flex-row items-center">
            <Text className="font-bold text-lg">Tags:</Text>
            <TextInput
              placeholder="Enter blog tag"
              className="flex-1 ml-2 p-2 border border-gray-300 rounded-md"
              value={tag}
              onChangeText={setTag}
            />
            <Button
              className="ml-2 rounded-md"
              onPress={() => {
                if (tag.trim() && !tags.includes(tag.trim())) {
                  setTags([...tags, tag.trim()]);
                  setTag('');
                }
              }}
            >
              <Text className="text-white font-bold">Add Tag</Text>
            </Button>
          </Box>
          <Box className="flex-row flex-wrap mb-4">
            {tags.map((t) => (
              <Box
                key={t}
                className="flex-row items-center bg-yellow-100 border border-yellow-400 rounded-full px-3 py-1 mr-2 mb-2"
              >
                <Text className="text-yellow-800 mr-2">{t}</Text>
                <TouchableOpacity
                  onPress={() => setTags(tags.filter((tag) => tag !== t))}
                >
                  <XIcon size={16} color="#b45309" />
                </TouchableOpacity>
              </Box>
            ))}
          </Box>

          <View style={styles.toolbarContainer}>
            <TouchableOpacity style={styles.toolbarButton} onPress={applyHeader}>
              <HeadingIcon width={18} height={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolbarButton} onPress={applyBold}>
              <BoldIcon width={18} height={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolbarButton} onPress={applyItalic}>
              <ItalicIcon width={18} height={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolbarButton} onPress={applyBulletList}>
              <ListIcon width={18} height={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolbarButton} onPress={applyCodeInline}>
              <HighlighterIcon width={18} height={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolbarButton} onPress={applyCodeBlock}>
              <CodeIcon width={18} height={18} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Context (Markdown)</Text>
          <TextInput
            multiline
            value={content}
            onChangeText={setContent}
            style={styles.textInput}
            textAlignVertical="top"
            onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
          />

          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewContainer}>
            <Markdown>{content}</Markdown>
          </View>

          <Button className="mt-4 rounded-md" action="positive" onPress={handlePublishBlog}>
            <Text className="text-white font-bold">
              {blogId ? 'Update Blog' : 'Publish Blog'}
            </Text>
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  toolbarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 4,
  },
  toolbarButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    marginRight: 4,
    marginBottom: 4,
  },
  toolbarButtonText: {
    fontWeight: '600',
    color: '#111827',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
    color: '#374151',
  },
  textInput: {
    minHeight: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 10,
    fontSize: 16,
    color: '#111827',
  },
  previewContainer: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
    backgroundColor: '#f9fafb',
  },
});