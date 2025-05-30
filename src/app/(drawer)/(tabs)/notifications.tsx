import { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Alert, AlertText } from '@/components/ui/alert';
import { Heading } from '@/components/ui/heading';
import { Divider } from '@/components/ui/divider';
import Notification from '@/components/notification/notification';
import NotificationDetails from '@/components/notification/notificationDetails';

const mockNotifications = [
    {
        id: 1,
        title: 'New Class Available',
        description: 'We have added a new Salsa class to our schedule starting next week.',
        hasBeenRead: false,
        sendDate: '2025-05-29T12:00:00Z',
    },
    {
        id: 2,
        title: 'Class Cancellation',
        description: 'The Tango class scheduled for tomorrow has been cancelled.',
        hasBeenRead: false,
        sendDate: '2025-05-28T09:00:00Z',
    },
    {
        id: 3,
        title: 'New Instructor',
        description: 'We have a new instructor joining our team next week.',
        hasBeenRead: true,
        sendDate: '2025-05-27T15:30:00Z',
    },
    {
        id: 4,
        title: 'Schedule Update',
        description: 'The schedule has been updated with new classes for next month.',
        hasBeenRead: false,
        sendDate: '2025-05-26T08:45:00Z',
    },
    {
        id: 5,
        title: 'Event Reminder',
        description: 'Don\'t forget the upcoming dance event this Saturday!',
        hasBeenRead: true,
        sendDate: '2025-05-25T10:15:00Z',
    },
    {
        id: 6,
        title: 'Feedback Request',
        description: 'We would love to hear your feedback on our classes.',
        hasBeenRead: false,
        sendDate: '2025-05-24T14:20:00Z',
    },
    {
        id: 7,
        title: 'Holiday Schedule',
        description: 'Check out our special holiday schedule for next week.',
        hasBeenRead: true,
        sendDate: '2025-05-23T11:00:00Z',
    },
    {
        id: 8,
        title: 'New Dance Style',
        description: 'We are introducing a new dance style next month, stay tuned!',
        hasBeenRead: false,
        sendDate: '2025-05-22T16:30:00Z',
    },
]


export default function Notifications() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setNotifications(mockNotifications);
    }, []);

    return (
        <SafeAreaView className="flex-1">
        <View className="flex-1">
        <Heading className="text-typography-950 font-semibold text-center mt-4 mb-2" size="lg">
            Notifications:
        </Heading>
        <Divider />
        <ScrollView className="flex-1">
            {notifications.length === 0 ? (
                <Alert className="w-full max-w-md mt-4" action="info" variant='solid'>
                    <AlertText className="text-center">
                        No notifications available.
                    </AlertText>
                </Alert>
            ) : (  
                notifications.map((notification) => (
                    <Notification
                        key={notification.id}
                        notification={notification}
                        onPress={(notification) => {
                            setSelectedNotification(notification);
                            setVisible(true);
                        }}
                    />
                ))
            )}
            <NotificationDetails
                notification={selectedNotification}
                visible={visible}
                onClose={() => {
                    setVisible(false);
                    setSelectedNotification(null);
                }}
            />
        </ScrollView>
        </View>
        </SafeAreaView>
    )
}