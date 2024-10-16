#import "CalendarModule.h"
#import <React/RCTLog.h>
#import <EventKit/EventKit.h>

@implementation CalendarModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name
                  latitude:(NSString *)latitude
                  longitude:(NSString *)longitude
                  startDate:(NSString *)startDate
                  endDate:(NSString *)endDate
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  // Create an instance of the event store
  EKEventStore *eventStore = [[EKEventStore alloc] init];
  
  // Request access to the Calendar
  [eventStore requestAccessToEntityType:EKEntityTypeEvent completion:^(BOOL granted, NSError *error) {
    if (granted && !error) {
      
      // Create a new calendar event
      EKEvent *event = [EKEvent eventWithEventStore:eventStore];
      event.title = name; // Use travel destination as the title
      
      // Convert start and end date strings to NSDate
      NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
      [dateFormatter setDateFormat:@"yyyy-MM-dd"]; // Adjust the format as needed

      NSDate *start = [dateFormatter dateFromString:startDate];
      NSDate *end = [dateFormatter dateFromString:endDate];
      
      if (start && end) {
        event.startDate = start;
        event.endDate = end;
      } else {
        reject(@"date_error", @"Invalid date format", nil);
        return;
      }

      // Set the structured location for the event
      EKStructuredLocation *location = [EKStructuredLocation locationWithTitle:name]; // Use destination name as location title

      // Set latitude and longitude
      location.geoLocation = [[CLLocation alloc] initWithLatitude:[latitude doubleValue] longitude:[longitude doubleValue]];

      // Assign the structured location to the event's location property
      event.structuredLocation = location;
      
      // Add an alarm (reminder) 1 day before the event
      EKAlarm *alarm = [EKAlarm alarmWithRelativeOffset:-60*60*24]; // 1 day before
      [event addAlarm:alarm];
      
      // Set the calendar for the event
      event.calendar = [eventStore defaultCalendarForNewEvents];

      // Save the event
      NSError *saveError = nil;
      [eventStore saveEvent:event span:EKSpanThisEvent commit:YES error:&saveError];
      
      if (saveError) {
        reject(@"save_error", @"Failed to save event", saveError);
      } else {
        resolve(event.eventIdentifier);
      }
      
    } else {
      reject(@"access_denied", @"Access to calendar was denied", error);
    }
  }];
}

RCT_EXPORT_METHOD(deleteCalendarEvent:(NSString *)eventId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  // Create an instance of the event store
  EKEventStore *eventStore = [[EKEventStore alloc] init];
  
  // Request access to the Calendar
  [eventStore requestAccessToEntityType:EKEntityTypeEvent completion:^(BOOL granted, NSError *error) {
    if (granted && !error) {
      
      // Fetch the event by its identifier
      EKEvent *event = [eventStore eventWithIdentifier:eventId];
      
      if (event) {
        NSError *deleteError = nil;
        
        // Delete the event
        [eventStore removeEvent:event span:EKSpanThisEvent commit:YES error:&deleteError];
        
        if (deleteError) {
          reject(@"delete_error", @"Failed to delete event", deleteError);
        } else {
          resolve(@"Event successfully deleted from the calendar");
        }
        
      } else {
        reject(@"not_found", @"Event not found", nil);
      }
      
    } else {
      reject(@"access_denied", @"Access to calendar was denied", error);
    }
  }];
}

@end
