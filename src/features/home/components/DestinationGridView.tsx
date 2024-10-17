import React from 'react';
import Animated from 'react-native-reanimated';

import { StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';

import { COLORS, FONTS } from '../../../common/theme';
import { Destination } from '../../detail/data/entity/Destination';
import { NavigationService } from '../../../services/navigation/NavigationService';

const { width } = Dimensions.get('window');

interface Props {
  data: Destination[];
}

export const DestinationGridView = ({ data }: Props) => {
  const numColumns = 2;
  const itemWidth = (width - 40) / numColumns;

  const handlePress = (item: Destination, sharedTransitionTag: string) => {
    NavigationService.navigate('Detail', {
      destination: item,
      sharedTransitionTag,
    });
  };

  const renderItem = React.useCallback(
    ({ item, index }: { item: Destination; index: number }) => {
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
          <Text style={[FONTS.regularBold, styles.text]}>{item.name}</Text>
        </TouchableOpacity>
      );
    },
    [itemWidth],
  );

  return (
    <Animated.FlatList
      data={data}
      keyExtractor={item => item.name}
      numColumns={numColumns}
      renderItem={renderItem}
    />
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
    borderRadius: 10,
  },
  text: {
    position: 'absolute',
    textTransform: 'uppercase',
    top: 10,
    left: 10,
    right: 10,
  },
});
