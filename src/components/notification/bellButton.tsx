import { BellIcon } from 'lucide-react-native';
import { Pressable } from '@/components/ui/pressable';
import { Box } from '@/components/ui/box';
import { router } from 'expo-router';

export default function BellButton() {
    return (
        <Box className="relative">
            <Pressable
                className="p-2 m-4 rounded-full bg-gray-200 dark:bg-gray-800"
                onPress={() => {
                    router.push('/(drawer)/notifications');
                }}
            >
                <BellIcon size={24} color="#000" />
            </Pressable>
        </Box>
    )
}