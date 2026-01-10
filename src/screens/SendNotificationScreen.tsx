import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Box, Button, Text } from '@/components/ui';
import React, { useState, useEffect, useMemo } from 'react';
import api from '@/server/axios';
import { API_PATHS } from '@/util/endpoints';
import { ProfileProps } from '@/util/types/profile';
import { XIcon } from 'lucide-react-native';
import { useAppToast } from '@/hooks/useAppToast';
import { router } from 'expo-router';
import { showToastErrorAxiosMessage } from '@/util/errors';

export default function SendNotificationScreen() {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [allUsers, setAllUsers] = useState<ProfileProps[]>([]);
  const [query, setQuery] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<ProfileProps[]>([]);
  const showToast = useAppToast();

  const fetchAllUsers = async () => {
    try {
      const responseStudents = await api.get(API_PATHS.getStudents);
      const responseInstructors = await api.get(API_PATHS.getInstructors);

      const students: ProfileProps[] = responseStudents.data;
      const instructors: ProfileProps[] = responseInstructors.data.instructors;

      setAllUsers([...students, ...instructors]);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const selectedIds = new Set(selectedUsers.map(u => u.id));

    return allUsers
      .filter(u => !selectedIds.has(u.id))
      .filter(u => {
        const firstName = (u.name ?? '').toLowerCase();
        const lastName = (u.surname ?? '').toLowerCase();
        const email = (u.email ?? '').toLowerCase();
        return (
          firstName.includes(q) ||
          lastName.includes(q) ||
          email.includes(q)
        );
      })
      .slice(0, 5);
  }, [query, allUsers, selectedUsers]);

  const handleAddUser = (user: ProfileProps) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(prev => [...prev, user]);
    }
    setQuery('');
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim() || selectedUsers.length === 0) {
      showToast({
        title: 'Error',
        description: 'Please fill in all fields and select at least one recipient.',
        type: 'error',
      });
      return;
    }
    try {
      const userIds = selectedUsers.map(u => u.id);

      await api.post(API_PATHS.postCreateNotification, {
        title,
        body,
        userIds,
      });
      showToast({
        title: 'Success',
        description: 'The notification has been sent successfully.',
        type: 'success',
      });
      setTitle('');
      setBody('');
      setSelectedUsers([]);
      router.replace('/broadcast/history')
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Failed to send notification.');
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-2">
          <Box className="mb-4 flex-row items-center">
            <Text className="font-bold text-lg">Title:</Text>
            <TextInput
              placeholder="Enter notification title"
              value={title}
              className="flex-1 ml-2 p-2 border border-gray-300 rounded-md"
              onChangeText={setTitle}
            />
          </Box>

          <Box className="mb-4 flex-col">
            <Text className="font-bold text-lg">Body:</Text>
            <TextInput
              placeholder="Enter notification body"
              value={body}
              className="my-2 p-2 border border-gray-300 rounded-md text-top"
              onChangeText={setBody}
              multiline
            />
          </Box>

          <Box className="mb-2">
            <Text className="font-bold text-lg mb-1">Recipients:</Text>
            <Box className="flex-row items-center">
              <TextInput
                placeholder="Search by name, surname or email"
                className="flex-1 p-2 border border-gray-300 rounded-md"
                value={query}
                onChangeText={setQuery}
              />
            </Box>

            {filteredUsers.length > 0 && (
              <Box className="mt-2 border border-gray-200 rounded-md bg-white dark:bg-gray-900">
                {filteredUsers.map(user => (
                  <TouchableOpacity
                    key={user.id}
                    onPress={() => handleAddUser(user)}
                    className="px-3 py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <Text className="font-medium text-gray-800">
                      {user.name} {user.surname}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {user.email}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Box>
            )}
          </Box>

          <Box className="flex-row flex-wrap mb-4 mt-2">
            {selectedUsers.length === 0 ? (
              <Button
                className="rounded-md w-full"
                action="primary"
                onPress={() => setSelectedUsers(allUsers)}
              >
                <Text className="text-white">Add all users as recipients</Text>
              </Button>
            ) : (
              <>
                {selectedUsers.slice(-5).map(user => (
                  <Box
                    key={user.id}
                    className="flex-row items-center bg-yellow-100 border border-yellow-400 rounded-full px-3 py-1 mr-2 mb-2"
                  >
                    <Text className="text-yellow-800 mr-2">
                      {user.name} {user.surname}
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveUser(user.id)}>
                      <XIcon size={16} color="#b45309" />
                    </TouchableOpacity>
                  </Box>
                ))}
                {selectedUsers.length > 1 && (
                  <TouchableOpacity
                    onPress={() => setSelectedUsers([])}
                    className="flex-row items-center bg-red-100 border border-red-400 rounded-full px-3 py-1 mr-2 mb-2"
                  >
                    <XIcon size={16} color="#b91c1c" className="mr-2" />
                    <Text className="text-red-800 font-bold">
                      Remove all
                    </Text>
                  </TouchableOpacity>
                )}
                {selectedUsers.length > 5 && (
                  <Box className="flex-row items-center bg-gray-100 border border-gray-300 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-gray-700">
                      +{selectedUsers.length - 5} more
                    </Text>
                  </Box>
                )}
              </>
            )}
          </Box>

          <Button className="mt-4 rounded-md" action="positive" onPress={handleSend}>
            <Text className="text-white font-bold">
              Send Notification
            </Text>
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
