import '@/components/sheets/SheetsManager.tsx';

import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SheetProvider } from 'react-native-actions-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';

import { CourierWSProvider } from '@/components/contexts/CourierWSProvider';
import { StoreProvider } from '@/components/contexts/ReduxProvider';
import { ConnectionGuard } from '@/components/guards/ConnectionGuard';
import { ToastBanner } from '@/components/ui/ToastBanner/ToastBanner';
import { fonts } from '@/constants/fonts';
import { useLocation } from '@/hooks/location.hook';
import { usePushNotificationToken } from '@/hooks/usePushNotificationToken';
import { useTheme } from '@/hooks/useTheme';
import { persistor } from '@/store/store';

SplashScreen.preventAutoHideAsync();

const AppContent = () => {
  useLocation();
  usePushNotificationToken();

  return (
    <ConnectionGuard>
      <ToastBanner />
      <StatusBar style='auto' />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      />
      <CourierWSProvider />
    </ConnectionGuard>
  );
};

const Layout = () => {
  const { colors } = useTheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync(fonts);
      } catch (error) {
        console.error('Error loading fonts:', error);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: colors.background }}
          edges={['top', 'left']}
        >
          <StoreProvider>
            <PersistGate loading={null} persistor={persistor}>
              <SheetProvider>
                <AppContent />
              </SheetProvider>
            </PersistGate>
          </StoreProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;
