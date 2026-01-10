import React from 'react'
import { ScheduleItem } from '@/util/types/schedule'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, AccordionIcon, AccordionTitleText } from '@/components/ui/accordion';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Badge } from '@/components/ui/badge';
import { ChevronDownIcon, ChevronUpIcon } from '@/components/ui/icon';
import { getRandomBgColorWithBorder } from '@/util/colors';

export default function InstructorClasses({ classes }: { classes: ScheduleItem[] }) {
    return (
        <Accordion size="sm" type="single" isCollapsible={true} className="w-full shadow rounded-lg bg-white my-2">
            <AccordionItem value="classes">
                <AccordionTrigger>
                    {({ isExpanded } : { isExpanded: boolean }) => {
                        return (
                            <>
                                <AccordionTitleText className="text-lg font-semibold">
                                    My Upcoming Classes:
                                </AccordionTitleText>
                                {isExpanded ? (
                                    <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                                ) : (
                                    <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                                )}
                            </>
                        );
                    }}
                </AccordionTrigger>
                <AccordionContent>
                    {classes.length === 0 ? (
                        <Text className="text-gray-500">No upcoming classes.</Text>
                    ) : (
                        classes.map((item) => (
                            <Box key={item.id} className={`mb-2 p-2 border rounded-lg ${getRandomBgColorWithBorder()}`}>
                                <Text className="font-semibold text-md">{item.classTemplate.name}</Text>
                                <Text className="text-sm text-gray-600">
                                    {new Date(item.startDate).toLocaleString()} - {new Date(item.endDate).toLocaleString()}
                                </Text>
                                <Box className="flex-row flex-wrap mt-2">
                                    <Badge variant="outline" action="info" className="mr-2 mb-2 rounded-lg">
                                        <Text className="text-sm">{item.classTemplate.danceCategory.name} - {item.classTemplate.advancementLevel.name}</Text>
                                    </Badge>
                                </Box>
                            </Box>
                        ))
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}