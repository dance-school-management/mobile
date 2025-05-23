import { Text } from '@/components/ui';
import { View } from '@/components/ui';

export default function IconWithText(props: { Icon: React.ReactNode; text: string }) {
  return (
    <View className="flex-row my-2">
      {props.Icon}
      <Text>{props.text}</Text>
    </View>
  );
}
