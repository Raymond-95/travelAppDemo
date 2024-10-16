import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-calendar-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const CalendarModule = NativeModules.CalendarModule
  ? NativeModules.CalendarModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

const createCalendarEvent = (
  name: string,
  latitude: string,
  longitude: string,
  startDate: string,
  endDate: string,
): Promise<string> => {
  return CalendarModule.createCalendarEvent(
    name,
    latitude,
    longitude,
    startDate,
    endDate,
  );
};

const deleteCalendarEvent = (eventId: string): Promise<string> => {
  return CalendarModule.deleteCalendarEvent(eventId);
};

export { createCalendarEvent, deleteCalendarEvent };
