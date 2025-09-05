import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, SplashScreen, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

// Keep the splash screen visible while we check the app's state
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // This function checks the device's storage for our flag
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('@hasOnboarded');
        if (value === 'true') {
          setHasOnboarded(true);
        } else {
          setHasOnboarded(false);
        }
      } catch (e) {
        // If there's an error, default to showing the onboarding
        setHasOnboarded(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    // This effect runs once we know the onboarding status
    if (hasOnboarded === null) {
      // If we don't know the status yet, do nothing. The splash screen is visible.
      return;
    }

    // Now that we have the status, we can hide the splash screen
    SplashScreen.hideAsync();

    if (hasOnboarded) {
      // If the user has onboarded, send them to the login screen
      router.replace('/(auth)/login');
    } else {
      // If they have NOT onboarded, send them to the onboarding screen
      router.replace('/(onboarding)');
    }
  }, [hasOnboarded]);

  // The <Slot /> component will render the correct screen based on the routing logic above
  return <Slot />;
}