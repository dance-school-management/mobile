import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@/components/ui/modal';
import { Icon, ArrowLeftIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Divider } from '@/components/ui/divider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function NotificationDetails({ notification, visible, onClose }) {
    const insets = useSafeAreaInsets();

    return (
        <Modal isOpen={visible} onClose={onClose} size="full">
            <ModalBackdrop />
            <ModalContent className="flex-1 h-full flex-start" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
                <ModalCloseButton>
                    <Icon size='xl' as={ArrowLeftIcon} className="stroke-background-500" />
                </ModalCloseButton>
                <ModalHeader className="justify-center items-center">
                    <Heading className="text-typography-950 font-semibold mb-4 mt-4" size="2xl">
                        {notification?.title}
                    </Heading>
                </ModalHeader>
                <ModalBody className="mt-3 mb-4">
                    <Divider />
                    <Text>
                        {new Date(notification?.sendDate).toLocaleDateString()}, { }
                        {new Date(notification?.sendDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                    <Text className="mb-4 mt-4">
                        {notification?.description}
                    </Text>
                </ModalBody>
                <ModalFooter className="flex justify-center" style={{ paddingBottom: insets.bottom }}>
                    <Button variant="solid" action="secondary" size="lg" isDisabled={notification?.hasBeenRead}>
                        <ButtonText>Mark as read</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
