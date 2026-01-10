import React from 'react';
import { Box, Text } from '@/components/ui';
import { BroadcastHistory } from "@/util/types/broadcast";

export default function NotificationLogCard({ broadcast }: { broadcast: BroadcastHistory }) {
  const color = broadcast.isAutomatic ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300';

  return (
    <Box className={`p-4 mb-2 border rounded-lg ${color}`}>
      <Text className="font-bold text-lg mb-2">{broadcast.title}</Text>
      <Text className="mb-2 text-wrap" numberOfLines={2} ellipsizeMode="tail">{broadcast.body}</Text>
      <Text className="text-sm text-gray-500">Sent at: {new Date(broadcast.sendDate).toLocaleString()}</Text>
    </Box>
  );
}