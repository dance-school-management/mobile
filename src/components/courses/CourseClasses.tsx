import { ClassProp } from '@/util/types/course';
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
import { getRandomBgColorWithBorder } from '@/util/colors';
import React from 'react';

export default function CourseClasses({ classes }: { classes: ClassProp[] }) {
  return (
    <Accordion size="sm" type="single" isCollapsible={true} className="w-full shadow rounded-lg bg-white my-2">
      <AccordionItem value="classes">
        <AccordionTrigger>
          {({ isExpanded } : { isExpanded: boolean }) => (
            <>
              <AccordionTitleText className="text-lg font-semibold">
                Upcoming Classes:
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
            <Text className="text-gray-500">There are no upcoming classes.</Text>
          ) : (
            classes.map((item) => {
              return (
                <Box key={item.id} className={`mb-2 p-2 border rounded-lg ${getRandomBgColorWithBorder()}`}>
                  <Text className="font-semibold text-md">{item.classTemplate.name}</Text>
                  <Text className="text-sm text-gray-600">
                    {new Date(item.startDate).toLocaleString()} - {new Date(item.endDate).toLocaleString()}
                  </Text>
                  <Box className="flex-row flex-wrap">
                    <Badge variant="outline" action="info" className="mr-2 mt-2 rounded-lg">
                      <Text className="text-sm">{item.classTemplate.course.danceCategory.name} - {item.classTemplate.course.advancementLevel.name}</Text>
                    </Badge>
                  </Box>
                  <Text className="text-sm mt-1">Instructors: {item.instructors.map(i => `${i.name} ${i.surname}`).join(', ')}</Text>
                </Box>
              );
            })
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}