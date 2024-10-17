# Travel App Demo

| Android | iOS    |
| :---:   | :---: |
| <video src="https://github.com/user-attachments/assets/977f1bb6-9a82-4c45-8719-7cba4c2554f0" width="200" /> | <video src="https://github.com/user-attachments/assets/c2140a58-e547-4a6c-8215-60eb6fdec255" width="200" />   |

# Getting Started

## Step 1

Manually set your Gmail account in `nativeModules/react-native-calendar-module/android/src/main/java/com/calendarmodule/CalendarModuleModule.kt` at line 117

Since you may have multiple Gmail calendars, the ideal approach would be to allow users to select their preferred email. However, due to time constraints, please update it manually for now.

# Step 2 - Install the dependencies

```bash
npm install

# install pods
cd ios && pod install

cd ..
```

## Step 3 - Run the app

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.
