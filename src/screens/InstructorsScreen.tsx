import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView } from 'react-native';
import { InstructorShort } from '@/util/types/instructors';
import api from '@/server/axios';
import { API_PATHS } from '@/util/endpoints';
import { Pressable } from '@/components/ui/pressable';
import InstructorCard from '@/components/instructor/InstructorCard';
import { Alert, AlertText } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { router } from 'expo-router';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

export default function InstructorsScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [instructors, setInstructors] = useState<InstructorShort[]>([]);
  const showToast = useAppToast();

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_PATHS.getInstructors);
      setInstructors(response.data.instructors);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching instructors');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInstructors();
  }, []);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchInstructors();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Skeleton className="h-30 w-full mt-4 mb-4" />
          <Skeleton className="h-30 w-full mt-4 mb-4" />
          <Skeleton className="h-30 w-full mt-4 mb-4" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {instructors && instructors.length > 0 ? (
          instructors.map((instructor) => (
            <Pressable
              key={`instructor-${instructor.id}-${instructor.name}-${instructor.surname}`}
              onPress={() => router.push(`/instructor/${instructor.id}`)}
            >
              <InstructorCard instructor={instructor} />
            </Pressable>
          ))) : (
            <Alert action="info" className="mt-4">
              <AlertText>No instructors found.</AlertText>
            </Alert>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}