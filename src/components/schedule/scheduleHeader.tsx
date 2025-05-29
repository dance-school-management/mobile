import { View, ScrollView } from 'react-native';
import { useState } from 'react';
import { Button, ButtonText, ButtonIcon, ButtonGroup } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { CalendarDaysIcon } from 'lucide-react-native';
import { getMondaySunday, getDayStart, getDayEnd } from '@/util/schedule';


export default function ScheduleHeader({setCurrentDate, setMinDate, setMaxDate, setActiveModal }) {
    const [currentPressed, setCurrentPressed] = useState('today');

    return (
        <View className="flex-none m-1">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className='flex-none flex-row p-2' contentContainerStyle={{ paddingRight: 16 }}>
                <Button size="sm" variant="solid" action="secondary" className="mr-2" onPress={() => {
                    setActiveModal('filter');
                }}>
                    <ButtonText>Filter</ButtonText>
                </Button>
                <Divider orientation="vertical" className="bg-slate-900"/>
                <Button size="sm" variant="solid" className="ml-2 mr-2" action={currentPressed === "today" ? "primary" : "secondary"} onPress={() => {
                    setMinDate(getDayStart(new Date()));
                    setMaxDate(getDayEnd(new Date()));
                    setCurrentDate(new Date());
                    setCurrentPressed('today');
                }}>
                    <ButtonText>Today</ButtonText>
                </Button>
                <Button size="sm" variant="solid" className="ml-2 mr-2" action={currentPressed === "tomorrow" ? "primary" : "secondary"} onPress={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(new Date().getDate() + 1);
                    setMinDate(getDayStart(tomorrow));
                    setMaxDate(getDayEnd(tomorrow));
                    setCurrentDate(tomorrow);
                    setCurrentPressed('tomorrow');
                }}>
                    <ButtonText>Tomorrow</ButtonText>
                </Button>
                <Button size="sm" variant="solid" className="ml-2 mr-2" action={currentPressed === "thisWeek" ? "primary" : "secondary"} onPress={() => {
                    const current = new Date();
                    const { monday, sunday } = getMondaySunday(current);
                    
                    setMinDate(getDayStart(monday));
                    setMaxDate(getDayEnd(sunday));
                    setCurrentDate(current);
                    setCurrentPressed('thisWeek');
                }}>
                    <ButtonText>This week</ButtonText>
                </Button>
                <Button size="sm" variant="solid" className="ml-2 mr-2" action={currentPressed === "nextWeek" ? "primary" : "secondary"} onPress={() => {
                    const current = new Date();
                    const next = new Date(current);
                    next.setDate(current.getDate() + 7);
                    next.setHours(0,0,0,0);

                    const { monday, sunday } = getMondaySunday(next);
                    setMinDate(getDayStart(monday));
                    setMaxDate(getDayEnd(sunday));
                    setCurrentDate(next);
                    setCurrentPressed('nextWeek');
                }}>
                    <ButtonText>Next Week</ButtonText>
                </Button>
                <Button size="sm" variant="solid" className="ml-2" action={currentPressed === "otherWeek" ? "primary" : "secondary"} onPress={() => {
                    setActiveModal('calendar');
                    setCurrentPressed('otherWeek');
                }}>
                    <ButtonIcon as={CalendarDaysIcon} />
                </Button>
            </ScrollView>
        </View>
    )
}