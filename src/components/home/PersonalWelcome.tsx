import React, { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { useSessionQuery } from '@/lib/auth/session';
import { API_PATHS, getApiUrl } from '@/util/endpoints'
import api from '@/server/axios';
import { Skeleton } from '@/components/ui/skeleton';
import { ScheduleItemPersonal } from '@/util/types/schedule';
import UpcomingClasses from '@/components/schedule/UpcomingClasses';

export default function PersonalWelcome({ refreshKey }: { refreshKey?: number }) {
  const [loading, setLoading] = useState(true);
  const { data: sessionData } = useSessionQuery();
  // @ts-ignore
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';
  const name = sessionData?.data?.user?.name || role;
  const [todayClasses, setTodayClasses] = useState<ScheduleItemPersonal[]>([]);

  const fetchTodayClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get(getApiUrl(API_PATHS.getSchedulePersonal, { dateFrom: new Date().toISOString(), dateTo: '2026-02-10T23:59:59.000Z' }));
      const data = response.data;
      setTodayClasses(data)
    } catch (error) {
      console.error('Error fetching today classes:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodayClasses();
  }, [refreshKey]);

  if (loading) {
    return (
      <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </Box>
    )
  }

  return (
    <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
      <Heading className="text-2xl font-bold mb-2">
        Welcome {name}!
      </Heading>
      <UpcomingClasses classes={todayClasses} />
    </Box>
  )
}