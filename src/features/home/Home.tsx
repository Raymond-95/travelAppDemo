import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/Navigator';
import Animated from 'react-native-reanimated';

import { COLORS } from '../../common/theme';
import DATA from '../../common/assets/data.json';

import { Destination } from '../detail/data/entity/Destination';

interface Props {
  navigation: StackNavigationProp<RootStackParamsList, 'Home'>;
}

const destinations = DATA.destinations;
const { width } = Dimensions.get('window');

const Home = ({ navigation }: Props) => {
  const numColumns = 2;
  const itemWidth = (width - 40) / numColumns;

  const handlePress = (item: Destination, sharedTransitionTag: string) => {
    navigation.navigate('Detail', { destination: item, sharedTransitionTag });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.FlatList
        data={destinations}
        keyExtractor={item => item.name}
        numColumns={numColumns}
        renderItem={({ item, index }) => {
          const itemTag = item.name.replaceAll(' ', '');
          const imageSharedTransitionTag = `item.${itemTag.concat(
            index.toString(),
          )}.image`;

          return (
            <TouchableOpacity
              onPress={() => handlePress(item, imageSharedTransitionTag)}
              style={[styles.itemContainer, { width: itemWidth }]}>
              <Animated.Image
                sharedTransitionTag={imageSharedTransitionTag}
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.lightgrey,
  },
  image: {
    height: 200,
  },
  text: {
    position: 'absolute',
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    top: 10,
    left: 10,
    right: 10,
  },
});

export default Home;
