import { BellIcon } from 'lucide-react-native';
import { Pressable } from '@/components/ui/pressable';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { useState } from 'react';
import { router } from 'expo-router';


export default function BellButton() {
    const [unreadCount, setUnreadCount] = useState(5);

    return (
        <Box className="relative">
            {unreadCount > 0 && (
                <Badge
                    className="z-10 self-end h-[22px] w-[22px] bg-red-600 rounded-full absolute top-0 left-0"
                    variant="solid"
                >
                    <BadgeText className="text-white">{unreadCount}</BadgeText>
                </Badge>
            )}
            <Pressable
                className="p-2 m-2 rounded-full bg-gray-200 dark:bg-gray-800"
                onPress={() => {
                    router.push('/(drawer)/notifications');
                }}
            >
                <BellIcon size={24} color="#000" />
            </Pressable>
        </Box>
    )
}