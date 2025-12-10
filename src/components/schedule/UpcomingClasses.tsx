import React from "react";
import { ScheduleItemPersonal } from "@/util/types/schedule";
import {
    Accordion,
    AccordionContent,
    AccordionIcon,
    AccordionItem,
    AccordionTitleText,
    AccordionTrigger,
    Badge,
    Box,
    ChevronDownIcon,
    ChevronUpIcon,
    Text,
} from '@/components/ui';
import { getRandomBgColorWithBorder } from "@/util/colors";

export default function UpcomingClasses({ classes }: { classes: ScheduleItemPersonal[] }) {
    return (
        <Accordion size="sm" type="single" isCollapsible={true} className="w-full shadow rounded-lg bg-white my-2">
            <AccordionItem value="classes">
                <AccordionTrigger>
                    {({ isExpanded } : { isExpanded: boolean }) => (
                        <>
                            <AccordionTitleText className="text-lg font-semibold">
                                Your Today's Classes
                            </AccordionTitleText>
                            {isExpanded ? (
                                <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                            ) : (
                                <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                            )}
                        </>
                    )}
                </AccordionTrigger>
                <AccordionContent>
                    {classes.length === 0 ? (
                        <Text className="text-gray-500">You have no classes scheduled for today.</Text>
                    ) : (
                        classes.map((item) => {
                            return (
                                <Box key={item.id} className={`mb-2 p-2 border rounded-lg ${getRandomBgColorWithBorder()}`}>
                                    <Text className="font-semibold text-md">{item.classTemplate.name}</Text>
                                    <Text className="text-sm text-gray-600">
                                        {new Date(item.startDate).toLocaleString()} - {new Date(item.endDate).toLocaleString()}
                                    </Text>
                                    <Text className="text-sm">Room: {item.classRoom.name}</Text>
                                    <Box className="flex-row flex-wrap mt-2">
                                        <Badge variant="outline" action="info" className="mr-2 rounded-lg">
                                            <Text className="text-sm">{item.classTemplate.danceCategory.name} - {item.classTemplate.advancementLevel.name}</Text>
                                        </Badge>
                                    </Box>
                                </Box>
                            );
                        })
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
