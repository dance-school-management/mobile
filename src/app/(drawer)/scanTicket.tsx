import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from '@/components/ui';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center pb-4">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView style={{ flex: 1 }} facing="back" onBarcodeScanned={({data}) => {
        console.log("data", data);
      }}>
        <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
          <View className="absolute inset-0 border border-transparent">
            <View className="absolute left-0 top-0 w-6 h-6 border-l-4 border-t-4 border-white" />

            <View className="absolute right-0 top-0 w-6 h-6 border-r-4 border-t-4 border-white" />

            <View className="absolute left-0 bottom-0 w-6 h-6 border-l-4 border-b-4 border-white" />

            <View className="absolute right-0 bottom-0 w-6 h-6 border-r-4 border-b-4 border-white" />
          </View>
        </View>
      </CameraView>
    </View>
  );
}