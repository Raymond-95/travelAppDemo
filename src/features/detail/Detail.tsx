import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/Navigator';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { COLORS } from '../../common/theme';
import { IMAGES } from '../../common/assets/images';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  createCalendarEvent,
  deleteCalendarEvent,
} from 'react-native-calendar-module';

import { FONTS } from '../../common/theme';

interface Props {
  route: RouteProp<RootStackParamsList, 'Detail'>;
  navigation: StackNavigationProp<RootStackParamsList, 'Detail'>;
}

const Detail = ({ route }: Props) => {
  const { destination, sharedTransitionTag } = route.params;
  const [isAddedToCalendar, setIsAddedToCalendar] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string>('');

  // Shared values for text animation
  const textOpacity = useSharedValue(0);
  const translateX = useSharedValue(300);

  // Shared values for tick animation
  const tickOpacity = useSharedValue(0);

  // Trigger the animation when the component mounts
  useEffect(() => {
    // Animate both opacity and translation
    textOpacity.value = withDelay(
      300,
      withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      }),
    );
    translateX.value = withDelay(
      300,
      withTiming(0, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      }),
    );
  }, []);

  // Animated style for the text
  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value, // Fade-in effect
    transform: [{ translateX: translateX.value }], // Slide in from right
  }));

  // Animated style for the tick icon
  const animatedTickStyle = useAnimatedStyle(() => ({
    opacity: tickOpacity.value, // Fade-in effect for the tick icon
  }));

  const showErrorAlert = (message: string) => {
    Alert.alert('Error', message);
  };

  const addToCalendar = () => {
    if (!isAddedToCalendar) {
      // Create event
      createCalendarEvent(
        destination.name,
        destination.location.latitude,
        destination.location.longitude,
        destination.suggestedTravelDates[0],
        destination.suggestedTravelDates[1],
      )
        .then(calendarEventId => {
          setIsAddedToCalendar(!isAddedToCalendar);
          setEventId(calendarEventId);
          tickOpacity.value = withTiming(1, {
            duration: 800,
            easing: Easing.linear,
          });
        })
        .catch(error => {
          showErrorAlert(error.message);
        });
    } else {
      // Cancel event
      deleteCalendarEvent(eventId)
        .then(() => {
          setIsAddedToCalendar(!isAddedToCalendar);
          tickOpacity.value = withTiming(0, {
            duration: 800,
            easing: Easing.linear,
          });
        })
        .catch(error => {
          showErrorAlert(error.message);
        });
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.Image
          sharedTransitionTag={sharedTransitionTag}
          source={{ uri: destination.image }}
          style={styles.image}
          resizeMode="cover"
        />

        <Animated.View style={[styles.textContainer, animatedTextStyle]}>
          <Text style={[FONTS.heading1Bold, styles.title]}>
            {destination.name}
          </Text>
          <Text style={[FONTS.heading2, styles.description]}>
            {destination.description}
          </Text>
        </Animated.View>

        <TouchableOpacity
          style={[
            styles.button,
            isAddedToCalendar && { backgroundColor: COLORS.green },
          ]}
          activeOpacity={0.9}
          onPress={addToCalendar}>
          <Text style={[FONTS.regular, styles.buttonText]}>
            add to calendar
          </Text>
          {isAddedToCalendar && (
            <Animated.Image
              source={IMAGES.tick}
              style={[styles.tickIcon, animatedTickStyle]}
              resizeMode={'contain'}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  textContainer: {
    position: 'absolute',
    top: 130,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: COLORS.transparentLightGrey,
    borderRadius: 5,
  },
  title: {
    textTransform: 'uppercase',
  },
  description: {
    textTransform: 'capitalize',
    marginTop: 20,
  },
  button: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    right: 10,
    backgroundColor: COLORS.lightgrey,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 10,
  },
  buttonText: {
    textTransform: 'uppercase',
    marginVertical: 20,
  },
  tickIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
});

export default Detail;
