import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Badge,
  BadgeIcon,
  BadgeText,
  Box,
  HStack,
  Icon,
  Image,
  LinkText,
  Pressable,
  Text,
  VStack,
} from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { exampleInstructorImage } from 'assets/ts/img';
import { Link } from 'expo-router';
import { View } from 'react-native';

const instructors = [
  {
    id: 1,
    name: 'Janusz',
    surname: 'Kowalski',
    email: 'jkowalski@gmail.com',
    classesConducted: 200,
    specializations: ['Salsa', 'Tango'],
  },
  {
    id: 2,
    name: 'Anna',
    surname: 'Nowak',
    email: 'anowak@gmail.com',
    classesConducted: 130,
    specializations: ['Ballet', 'Folk dance'],
  },
  {
    id: 3,
    name: 'Tomasz',
    surname: 'Tadeusz',
    email: 'ttadeusz@gmail.com',
    classesConducted: 500,
    specializations: ['Jazz', 'Swing Dance', 'Belly dance', 'Ballet'],
  },
];

export default function Page() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Box className="items-center mb-6">
          <Text className="text-3xl font-bold text-black">Our Instructors</Text>
        </Box>

        <VStack space="md">
          {/* <Text className="text-xs text-gray-400">*CC - classes conducted</Text>
          <Text className="text-xs text-gray-400">*Spec - specializations</Text> */}
          {instructors.map((instructor) => (
            <Link href={`/instructor_profile/${instructor.id}`} key={instructor.id}>
              {' '}
              {/* ZMIENIĆ HREF NA WIDOK POJEDYNCZEGO PROFILU */}
              <HStack
                className="justify-between items-center bg-white rounded-md"
                key={instructor.id}
              >
                <HStack space="md" className="p-2">
                  <Avatar className="bg-primary-500">
                    <AvatarFallbackText>
                      {instructor.name} {instructor.surname}
                    </AvatarFallbackText>
                    <AvatarImage source={exampleInstructorImage} />
                  </Avatar>
                  <VStack className="w-full" space="xs">
                    <Text>
                      {instructor.name} {instructor.surname}
                    </Text>
                    {/*                     <Text className="text-gray-500 font-normal">
                      {instructor.email}
                    </Text> */}
                    <Text size="sm" className="text-typography-500">
                      Specializations:{' '}
                    </Text>
                    <View className="flex flex-row flex-wrap w-3/5 gap-1">
                      {instructor.specializations.map((spec) => (
                        <Badge
                          key={spec}
                          variant="solid"
                          action="info"
                          size="md"
                          className="rounded-md"
                        >
                          <BadgeText>{spec}</BadgeText>
                        </Badge>
                      ))}
                    </View>
                    <HStack>
                      <Text size="sm" className="text-typography-500">
                        Conducted classes:{' '}
                      </Text>
                      <Badge>
                        <BadgeText>{instructor.classesConducted}</BadgeText>
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>
              </HStack>
            </Link>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
