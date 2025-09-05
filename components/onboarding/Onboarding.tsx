import React from 'react';
// --- (Keep all existing imports) ---
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';


const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#007AFF',
  textPrimary: '#1C1C1E',
  textSecondary: '#8A8A8E',
  background: '#F2F2F7',
  white: '#FFFFFF',
};

// --- MODIFICATION 1: Update the slides data to use images ---
const slides = [
  {
    key: '1',
    image: require('../../assets/images/onboarding1.png'), // Changed from iconName
    title: 'Intelligent Station Discovery',
    subtitle: "Find verified stations with our real-time 'Station Confidence Index'",
  },
  {
    key: '2',
    image: require('../../assets/images/onboarding2.png'), // Changed from iconName
    title: 'Personal Battery DNA',
    subtitle: 'Our AI learns your car and driving style for hyper-accurate range predictions',
  },
  {
    key: '3',
    image: require('../../assets/images/onboarding3.png'), // Changed from iconName
    title: 'Powering the EV Community',
    subtitle: 'Join fellow drivers to verify stations, report wait times, and find the perfect bay',
  },
];

const OnboardingItem = ({ item, scrollX, index }: any) => {
  const itemStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolate.CLAMP);
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.slide, { width }, itemStyle]}>
      {/* --- MODIFICATION 2: Replace the Icon with an Image component --- */}
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </Animated.View>
  );
};

// --- (Paginator component remains exactly the same) ---
const Paginator = ({ data, scrollX }: any) => {
  return (
    <View style={styles.paginatorContainer}>
      {data.map((_: any, i: number) => {
        const dotStyle = useAnimatedStyle(() => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = interpolate(scrollX.value, inputRange, [10, 25, 10], Extrapolate.CLAMP);
          const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolate.CLAMP);
          return {
            width: dotWidth,
            opacity,
          };
        });
        return <Animated.View style={[styles.dot, dotStyle]} key={i.toString()} />;
      })}
    </View>
  );
};


// --- (Main Onboarding component remains mostly the same) ---
export default function Onboarding() {
  const router = useRouter();
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('@hasOnboarded', 'true');
      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Failed to save onboarding status.', e);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={slides}
        renderItem={({ item, index }) => (
          <OnboardingItem item={item} scrollX={scrollX} index={index} />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.key}
      />
      <View style={styles.bottomContainer}>
        <Paginator data={slides} scrollX={scrollX} />
        <Pressable
          style={({ pressed }) => [styles.button, { opacity: pressed ? 0.8 : 1 }]}
          onPress={handleComplete}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  // --- (container, title, subtitle, bottomContainer, paginator, dot, button styles remain the same) ---
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  // --- MODIFICATION 3: Add a new style for the image ---
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain', // This ensures your image fits perfectly without distortion
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  paginatorContainer: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});