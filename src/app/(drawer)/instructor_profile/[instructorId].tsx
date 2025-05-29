import { Text, ScrollView, Image, View, RefreshControl } from 'react-native';
import avatar from 'assets/img/example-instructor.png';
import banner from 'assets/img/banner.png';
import {
  Avatar,
  AvatarImage,
  Box,
  Center,
  VStack,
  Heading,
  Badge,
  BadgeText,
  HStack,
  Divider,
  Card,
  Spinner,
} from '@/components/ui';
import {
  Phone,
  Mail,
  GraduationCap,
  ChevronRight,
  ChevronDown,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
  AccordionContent,
} from '@/components/ui/accordion';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useInstructor } from '@/lib/hooks/useInstructor';
import { set } from 'zod';

const danceCategories = [
  { id: 1, name: 'Tango' },
  { id: 2, name: 'Waltz' },
  { id: 3, name: 'Samba' },
  { id: 4, name: 'Rumba' },
  { id: 5, name: 'Cha-Cha' },
  { id: 6, name: 'Foxtrot' },
  { id: 7, name: 'Jive' },
  { id: 8, name: 'Paso Doble' },
  { id: 9, name: 'Quickstep' },
  { id: 10, name: 'Viennese Waltz' },
];

const classesData = [
  {
    id: 1,
    name: 'Tango Beginners',
    startDate: new Date('2024-07-01T18:00:00'),
    endDate: new Date('2024-07-01T19:30:00'),
    classRoom: 'Room A',
    peopleLimit: 12,
    classStatus: 'PRIVATE_CLASS',
  },
  {
    id: 2,
    name: 'Waltz Intermediate',
    startDate: new Date('2024-07-03T17:00:00'),
    endDate: new Date('2024-07-03T18:30:00'),
    classRoom: 'Room B',
    peopleLimit: 10,
    classStatus: 'PRIVATE_CLASS',
  },
  {
    id: 3,
    name: 'Samba Advanced',
    startDate: new Date('2024-07-05T19:00:00'),
    endDate: new Date('2024-07-05T20:30:00'),
    classRoom: 'Room C',
    peopleLimit: 8,
    classStatus: 'PRIVATE_CLASS',
  },
];

const accountData = [
  {
    iconName: GraduationCap,
    subText: 'My classes',
    endIcon: ChevronRight,
    data: classesData,
  },
  // {
  //   iconName: Settings,
  //   subText: 'App preferences',
  //   endIcon: ChevronRight,
  //   data: classesData,
  // },
  // {
  //   iconName: LogOut,
  //   subText: 'Log out',
  //   endIcon: ChevronRight,
  //   data: classesData,
  // },
];

export default function InstructorProfile() {
  const [openIndexes, setOpenIndexes] = useState<boolean[]>(
    accountData.map(() => false)
  );
  const [refreshing, setRefreshing] = useState(false);

  function handlePress(index: number) {
    setOpenIndexes((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  }

  const { instructorId } = useLocalSearchParams();
  const {
    data: instructorData,
    error: instructorError,
    isLoading: instructorIsLoading,
    refetch: refetchInstructor,
  } = useInstructor(instructorId as string);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchInstructor();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView>
      <VStack className="h-full w-full mb-16 md:mb-0">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {instructorIsLoading && !refreshing ? (
            <Center className="flex-1 justify-center items-center h-[320px]">
              <Spinner size={'large'} />
            </Center>
          ) : (
            <>
              <Box className="relative w-full h-[320px]">
                <Image
                  source={banner}
                  className="w-[100%] h-[100%] object-cover"
                />
              </Box>
              <Center className="absolute md:mt-14 mt-6 w-full md:px-10 md:pt-6 pb-4">
                <VStack space="lg" className="items-center ">
                  <Avatar className="w-48 h-48  bg-primary-600">
                    <AvatarImage
                      className="w-[100%] h-[100%]"
                      alt="Profile Image"
                      source={{
                        uri: `http://localhost:8000/profile/${instructorData?.photoPath}`,
                      }}
                    />
                  </Avatar>
                </VStack>
                <VStack className="mt-2 gap-1 w-full items-center">
                  <Text className="text-4xl font-semibold text-dark">
                    {instructorData?.name + ' ' + instructorData?.surname ||
                      'No name provided'}
                  </Text>
                  <VStack className="gap-2 align-items-start">
                    <Box className="flex flex-row items-center gap-2">
                      <Phone size={20} color="black" />
                      <Text className="font-medium text-xl">
                        {instructorData?.phone || 'No number provided'}
                      </Text>
                    </Box>
                    <Box className="flex flex-row items-center gap-2">
                      <Mail size={20} color="black" />
                      <Text className="font-medium text-xl">
                        {instructorData?.email || 'No email provided'}
                      </Text>
                    </Box>
                  </VStack>
                </VStack>
              </Center>
              <VStack className="m-5 items-start w-full">
                <Heading className="text-2xl my-2">
                  My favourite styles:
                </Heading>
                <View className="flex flex-row flex-wrap w-5/6 gap-1">
                  {instructorData?.favouriteDanceCategories.map(
                    (entry, index) => (
                      <Badge
                        key={index}
                        variant="solid"
                        action="info"
                        className="rounded-full max-w-full"
                      >
                        <BadgeText className="font-monospace text-xl">
                          {entry}
                        </BadgeText>
                      </Badge>
                    )
                  )}
                </View>
                <Heading className="text-2xl mt-2">About me: </Heading>
                <Text className="text-xl leading-6 text-left mt-2 mb-4 mx-2 w-5/6">
                  {instructorData?.description || 'No description provided. '}
                </Text>
                <Accordion
                  size="md"
                  variant="filled"
                  type="single"
                  isCollapsible={true}
                  isDisabled={false}
                  className="w-[90%] border border-outline-200 "
                >
                  {accountData.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        <AccordionItem value={index.toString()}>
                          <AccordionHeader>
                            <AccordionTrigger>
                              {({ isExpanded }) => {
                                return (
                                  <>
                                    <AccordionTitleText>
                                      {item.subText}
                                    </AccordionTitleText>
                                    {isExpanded ? (
                                      <AccordionIcon
                                        as={ChevronRight}
                                        className="ml-3"
                                      />
                                    ) : (
                                      <AccordionIcon
                                        as={ChevronDown}
                                        className="ml-3"
                                      />
                                    )}
                                  </>
                                );
                              }}
                            </AccordionTrigger>
                          </AccordionHeader>
                          <AccordionContent>
                            {item.data.map((classItem, itemIndex) => {
                              return (
                                <Card
                                  className="p-5 rounded-lg max-w-[360px]"
                                  key={itemIndex}
                                >
                                  <Text className="text-sm font-normal mb-2 text-typography-700">
                                    {classItem.startDate.toLocaleString() +
                                      ' - ' +
                                      classItem.endDate.toLocaleString()}
                                  </Text>
                                  <VStack className="">
                                    <Heading size="md" className="">
                                      {classItem.name}
                                    </Heading>
                                    <Text className="text-sm font-normal mb-2 text-typography-700">
                                      {classItem.classRoom}
                                    </Text>
                                    <HStack className="items-center gap-2">
                                      <Badge
                                        variant="solid"
                                        action="warning"
                                        className="rounded-full max-w-full"
                                      >
                                        <BadgeText className="font-monospace text-sm">
                                          {classItem.peopleLimit} people limit
                                        </BadgeText>
                                      </Badge>
                                      <Badge
                                        variant="solid"
                                        action="info"
                                        className="rounded-full max-w-full"
                                      >
                                        <BadgeText className="font-monospace text-sm">
                                          {classItem.classStatus
                                            .replace('_', ' ')
                                            .toLowerCase()}
                                        </BadgeText>
                                      </Badge>
                                    </HStack>
                                  </VStack>
                                </Card>
                              );
                            })}
                          </AccordionContent>
                        </AccordionItem>
                        <Divider />
                      </React.Fragment>
                    );
                  })}
                </Accordion>
              </VStack>
            </>
          )}
        </ScrollView>
      </VStack>
    </SafeAreaView>
  );
}
