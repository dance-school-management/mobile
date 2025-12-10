import React from "react";
import { CourseAttendanceRatesProp } from "@/util/types/progress";
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

export default function UpcomingClasses({ courses }: { courses: CourseAttendanceRatesProp[] }) {
  return (
    <Accordion size="sm" type="single" isCollapsible={true} className="w-full shadow rounded-lg bg-white my-2">
      <AccordionItem value="classes">
        <AccordionTrigger>
          {({ isExpanded } : { isExpanded: boolean }) => (
            <>
              <AccordionTitleText className="text-lg font-semibold">
                On-going Courses
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
          {courses.length === 0 ? (
            <Text className="text-gray-500">You have no on-going courses.</Text>
          ) : (
            courses.filter((c: CourseAttendanceRatesProp) => c.hasStarted && c.attendedCount < c.allCount).map((item) => {
              return (
                <Box key={item.courseId} className={`mb-2 p-2 border rounded-lg ${getRandomBgColorWithBorder()}`}>
                  <Text className="font-semibold text-md">{item.courseName}</Text>
                  <Text className="text-sm text-gray-700">Instructors: {item.instructorsNames.join(', ')}</Text>
                  <Box className="flex-row flex-wrap mt-2">
                    <Badge variant="outline" action="info" className="mr-2 rounded-lg">
                      <Text className="text-sm">Attendance: {item.attendedCount}/{item.allCount}</Text>
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
