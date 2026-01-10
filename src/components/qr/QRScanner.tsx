import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import api from '@/server/axios';
import { API_PATHS, getApiUrl } from '@/util/endpoints';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

export default function QRScanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showScanMessage, setShowScanMessage] = useState<boolean>(false);
  const showToast = useAppToast();

  const [scanningEnabled, setScanningEnabled] = useState<boolean>(true);
  const [canRescan, setCanRescan] = useState<boolean>(true);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  const lastScanRef = useRef<number | null>(null);
  const cooldownTimerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  const COOLDOWN_MS = 3000;
  const DEBOUNCE_MS = 800;

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

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

  const startCooldown = () => {
    setCanRescan(false);
    setCooldownRemaining(Math.ceil(COOLDOWN_MS / 1000));

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setCooldownRemaining((s) => {
        if (s <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000) as unknown as number;

    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(() => {
      setCanRescan(true);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setCooldownRemaining(0);
    }, COOLDOWN_MS) as unknown as number;
  };

  const handleScan = async (event: BarcodeScanningResult) => {
    if (!scanningEnabled) return;
    const now = Date.now();
    if (lastScanRef.current && now - lastScanRef.current < DEBOUNCE_MS) return;
    lastScanRef.current = now;

    setScanningEnabled(false);
    startCooldown();

    try {
      const response = await api.get(getApiUrl(API_PATHS.getTicketValidation, { qrCodeUUID: event.data }));
      const attendanceStatus = response.data.attendanceStatus;
      if (attendanceStatus === 'PRESENT') {
        showToast({
          title: 'This ticket is used',
          description: `Ticket for ${response.data.name} has already been used.`,
          type: 'warning',
        });
        setIsValid(false);
      } else {
        showToast({
          title: response.data.message,
          description: `Ticket for ${response.data.name} is valid.`,
          type: 'success',
        })
        setIsValid(true);
      }
      setShowScanMessage(true);
    } catch (err: unknown) {
      showToastErrorAxiosMessage(showToast, err, 'Error validating ticket');
      setIsValid(false);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      const response = await api.put(getApiUrl(API_PATHS.getTicketValidation), {
        qrCodeUUID: lastScanRef.current,
      });
      showToast({
        title: response.data.message,
        description: `Attendance marked successfully.`,
        type: 'success',
      });
      setIsValid(true);
    } catch (err: unknown) {
      showToastErrorAxiosMessage(showToast, err, 'Error marking attendance');
      setIsValid(false);
    } finally {
      handleScanAgain()
    }
  }

  const handleScanAgain = () => {
    if (!canRescan) return;
    setShowScanMessage(false);
    setIsValid(false);
    lastScanRef.current = null;
    setScanningEnabled(true);
    setCanRescan(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top','left','right','bottom']}>
      <View className="flex-1">
        <CameraView
          key={facing}
          style={StyleSheet.absoluteFill}
          facing={facing}
          onMountError={(e) => showToast({ title: 'Camera Error', description: e.message, type: 'error' })}
          onBarcodeScanned={handleScan}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />

        {showScanMessage && (
          <View className="absolute bottom-6 left-4 right-4 items-center flex-row justify-between gap-2">
            {isValid && (
              <Button action="positive" className="flex-1" onPress={handleMarkAttendance}>
                <ButtonText>Mark Attendance</ButtonText>
              </Button>
            )}
            <Button onPress={handleScanAgain} className="flex-1" disabled={!canRescan}>
              <ButtonText>
                {canRescan ? 'Scan again' : `Wait ${cooldownRemaining}s`}
              </ButtonText>
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
