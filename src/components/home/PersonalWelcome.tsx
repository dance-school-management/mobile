import React, { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { useSessionQuery } from '@/lib/auth/session';
import { API_PATHS, getApiUrl } from '@/util/endpoints'
import api from '@/server/axios';
import { Skeleton } from '@/components/ui/skeleton';
import { ScheduleItemPersonal } from '@/util/types/schedule';
import UpcomingClasses from '@/components/schedule/UpcomingClasses';
import { getDateStart, getDateEnd } from '@/util/dates';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

export default function PersonalWelcome({ refreshKey }: { refreshKey?: number }) {
  const [loading, setLoading] = useState(false);
  const { data: sessionData } = useSessionQuery();
  // @ts-ignore
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';
  const name = sessionData?.data?.user?.name || role;
  const [todayClasses, setTodayClasses] = useState<ScheduleItemPersonal[]>([]);
  const showToast = useAppToast();

  const fetchTodayClasses = async () => {
    if (role !== 'STUDENT' && role !== 'INSTRUCTOR') return;
    try {
      setLoading(true);
      const response = await api.get(getApiUrl(API_PATHS.getSchedulePersonal, { dateFrom: getDateStart(new Date()).toISOString(), dateTo: getDateEnd(new Date()).toISOString() }));
      const data = response.data;
      setTodayClasses(data)
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Failed to fetch today\'s classes.');
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
      {(role === 'STUDENT' || role === 'INSTRUCTOR') && (
        <UpcomingClasses classes={todayClasses} />
      )}
    </Box>
  )
}