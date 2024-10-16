
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNCalendarModuleSpec.h"

@interface CalendarModule : NSObject <NativeCalendarModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface CalendarModule : NSObject <RCTBridgeModule>
#endif

@end
