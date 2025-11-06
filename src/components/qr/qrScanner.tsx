import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { Alert } from '@/components/ui/alert';
import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';

export default function QRScanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  if (!cameraPermission) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-black" edges={['top','left','right']}>
        <Text>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-black" edges={['top','left','right']}>
        <Text className="mb-4">Camera permission is required to scan QR codes.</Text>
        <Button onPress={requestCameraPermission}>
          <ButtonText>Grant Permission</ButtonText>
        </Button>
      </SafeAreaView>
    );
  }

  // const toggleCameraFacing = () => {
  //   setFacing((current: CameraType) => (current === 'back' ? 'front' : 'back'));
  //   // setReady(false);
  // };

  const handleScan = (event: BarcodeScanningResult) => {
    setScannedData(event.data);
    console.log(event.data);
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top','left','right','bottom']}>
      <View className="flex-1">
        <CameraView
          key={facing}
          style={StyleSheet.absoluteFill}
          facing={facing}
          onCameraReady={() => { setReady(true); console.log('Camera ready'); }}
          onMountError={(e) => console.warn('Camera mount error', e)}
          onBarcodeScanned={handleScan}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />

        {scannedData && (
          <View pointerEvents="none" className="absolute top-4 left-4 right-4">
            <Alert variant="outline">
              <Text className="text-typography-950">Scanned Data: {scannedData}</Text>
            </Alert>
          </View>
        )}

        <View className="absolute bottom-4 left-4 right-4">
          <Button onPress={() => router.push('/tickets')}>
            <ButtonText>Back</ButtonText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}