import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from '../../common/theme';

import HomeScreen from '../home/Home';
import DetailScreen from '../detail/Detail';

import type { Destination } from '../detail/data/entity/Destination';

export type RootStackParamsList = {
  Home: undefined;
  Detail: { destination: Destination; sharedTransitionTag: string };
};

const Stack = createNativeStackNavigator<RootStackParamsList>();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            headerTransparent: true,
            headerTitle: '',
            headerBackTitleVisible: false,
            headerTintColor: COLORS.white,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
