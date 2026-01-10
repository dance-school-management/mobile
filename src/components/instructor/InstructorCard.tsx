import React from 'react';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { InstructorShort } from '@/util/types/instructors';
import { Image } from "react-native";

export default function InstructorCard({ instructor }: { instructor: InstructorShort }) {
    return (
        <Card className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-1 mb-1">
            <Box className="flex-row items-center">
                <Image
                    source={{ uri: `https://randomuser.me/api/portraits/men/${instructor?.id}.jpg` }}
                    className="w-16 h-16 rounded-full mr-2"
                />
                <Heading size="lg" className="flex-1 ml-2">
                    {instructor.name} {instructor.surname}
                </Heading>
            </Box>
            <Text className="text-gray-600 mt-1">Specializations:</Text>
            {instructor.favouriteDanceCategories && instructor.favouriteDanceCategories.length > 0 && (
                <Box className="flex-row flex-wrap mt-1">
                    {instructor.favouriteDanceCategories.map((danceCategory, index) => (
                        <Badge key={`${index}-${danceCategory}`} variant="outline" action="info" className="mr-2 mb-2 rounded-lg">
                            <Text className="text-sm">{danceCategory}</Text>
                        </Badge>
                    ))}
                </Box>
            )}
        </Card>
    )
}