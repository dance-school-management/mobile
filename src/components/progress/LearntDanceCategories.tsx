import React from "react";
import { LearntDanceCategoryProp } from "@/util/types/progress";
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

export default function LearntDanceCategories({ danceCategories }: { danceCategories: LearntDanceCategoryProp[] }) {
    return (
        <Accordion size="sm" type="single" isCollapsible={true} className="w-full shadow rounded-lg bg-white my-2">
            <AccordionItem value="classes">
                <AccordionTrigger>
                    {({ isExpanded } : { isExpanded: boolean }) => (
                        <>
                            <AccordionTitleText className="text-lg font-semibold">
                                Mastered Styles:
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
                    {danceCategories.length === 0 ? (
                        <Text className="text-gray-500">You don't have any mastered styles.</Text>
                    ) : (
                        danceCategories.sort((a, b) => new Date(b.finishedDate).getTime() - new Date(a.finishedDate).getTime()).map((item) => {
                            return (
                                <Box key={item.courseId} className={`mb-2 p-2 border rounded-lg ${getRandomBgColorWithBorder()}`}>
                                    <Text className="font-semibold text-md">{item.danceCategoryName} - {item.advancementLevelName}</Text>
                                    <Text className="text-sm text-gray-700">Mastered at: {new Date(item.finishedDate).toLocaleDateString()}</Text>
                                    <Text className="text-sm text-gray-700">{item.instructorsNames.length > 0 ? item.instructorsNames.join(', ') : 'N/A'}</Text>
                                </Box>
                            );
                        })
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
