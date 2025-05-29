import React, { useCallback, useState } from 'react';
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
import { Dimensions, RefreshControl } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { exampleInstructorImage } from 'assets/ts/img';
import { Link } from 'expo-router';
import { View } from 'react-native';
import { useInstructors } from '@/lib/hooks/useInstructors';
import { Spinner, Center } from '@/components/ui';

// const instructors = [
//   {
//     id: 1,
//     name: 'Janusz',
//     surname: 'Kowalski',
//     email: 'jkowalski@gmail.com',
//     classesConducted: 200,
//     specializations: ['Salsa', 'Tango'],
//   },
//   {
//     id: 2,
//     name: 'Anna',
//     surname: 'Nowak',
//     email: 'anowak@gmail.com',
//     classesConducted: 130,
//     specializations: ['Ballet', 'Folk dance'],
//   },
//   {
//     id: 3,
//     name: 'Tomasz',
//     surname: 'Tadeusz',
//     email: 'ttadeusz@gmail.com',
//     classesConducted: 500,
//     specializations: ['Jazz', 'Swing Dance', 'Belly dance', 'Ballet'],
//   },
// ];

export default function Page() {
  const {
    data: instructorsData,
    error: instructorsError,
    isLoading: instructorsIsLoading,
    refetch: refetchInstructors,
  } = useInstructors();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchInstructors();
    setRefreshing(false);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {instructorsIsLoading && !refreshing ? (
          <Center className="flex-1 justify-center items-center h-[320px]">
            <Spinner size={'large'} />
          </Center>
        ) : (
          <>
            <Box className="items-center mb-3">
              <Text className="text-3xl font-bold text-black">
                Our Instructors
              </Text>
            </Box>

            <VStack space="md">
              {/* <Text className="text-xs text-gray-400">*CC - classes conducted</Text>
          <Text className="text-xs text-gray-400">*Spec - specializations</Text> */}
              {instructorsIsLoading && <Spinner className="self-center mt-4" />}
              {instructorsError && (
                <Text className="text-red-500 text-center">
                  Error loading instructors: {instructorsError.message}
                </Text>
              )}
              {instructorsData && instructorsData.instructors.length === 0 && (
                <Text className="text-gray-500 text-center">
                  No instructors available at the moment.
                </Text>
              )}
              {instructorsData &&
                instructorsData.instructors.length > 0 &&
                instructorsData.instructors.map((instructor, index) => (
                  <Link
                    href={`/instructor_profile/${instructor.id}`}
                    key={index}
                  >
                    {' '}
                    <HStack
                      className="justify-between items-center bg-white rounded-md"
                      key={instructor.id}
                    >
                      <HStack space="md" className="p-2">
                        <Avatar className="bg-primary-500">
                          <AvatarFallbackText>
                            {instructor.name} {instructor.surname}
                          </AvatarFallbackText>
                          {(() => {
                            if (instructor.photoPath) {
                              console.log(
                                `http://localhost:8000/profile/${instructor.photoPath}`
                              );
                            }
                            return null; // nic nie renderujemy
                          })()}

                          <AvatarImage
                            source={
                              instructor.photoPath
                                ? {
                                    uri: `http://localhost:8000/profile/${instructor.photoPath}`,
                                  }
                                : exampleInstructorImage
                            }
                          />
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
                            {instructor.favouriteDanceCategories.map(
                              (spec, index) => (
                                <Badge
                                  key={index}
                                  variant="solid"
                                  action="info"
                                  size="md"
                                  className="rounded-md"
                                >
                                  <BadgeText>{spec}</BadgeText>
                                </Badge>
                              )
                            )}
                          </View>
                          {/* <HStack>
                        <Text size="sm" className="text-typography-500">
                          Conducted classes:{' '}
                        </Text>
                        <Badge>
                          <BadgeText>{instructor.classesConducted}</BadgeText>
                        </Badge>
                      </HStack> */}
                        </VStack>
                      </HStack>
                    </HStack>
                  </Link>
                ))}
            </VStack>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
