import React from 'react';
import { SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/Navigator';

import DATA from '../../common/assets/data.json';

import { DestinationGridView } from './components/DestinationGridView';

interface Props {
  navigation: StackNavigationProp<RootStackParamsList, 'Home'>;
}

const destinations = DATA.destinations;

const Home = ({ navigation }: Props) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DestinationGridView data={destinations} />
    </SafeAreaView>
  );
};

export default Home;
