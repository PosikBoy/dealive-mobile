import '@/components/sheets/SheetsManager.tsx';

import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SheetProvider } from 'react-native-actions-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';

import ConnectionCheck from '@/components/contexts/ConnectionCheck';
import LocationProvider from '@/components/contexts/LocationProvider';
import { StoreProvider } from '@/components/contexts/ReduxProvider';
import { fonts } from '@/constants/fonts';
import { useTheme } from '@/hooks/useTheme';
import { persistor } from '@/store/store';

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const { theme, colors } = useTheme();
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
      <SafeAreaView style={{ flex: 1 }}>
        <StoreProvider>
          <PersistGate loading={null} persistor={persistor}>
            <SheetProvider>
              <ConnectionCheck>
                <StatusBar backgroundColor={theme === 'dark' ? colors.statusBar : colors.surface} />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'fade_from_bottom',
                  }}
                />
                <LocationProvider />
              </ConnectionCheck>
            </SheetProvider>
          </PersistGate>
        </StoreProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Layout;
