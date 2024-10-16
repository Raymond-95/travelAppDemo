import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const FONTS = StyleSheet.create({
  heading1Bold: {
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: COLORS.white,
  },
  heading2: {
    fontSize: 20,
    fontStyle: 'normal',
    color: COLORS.white,
  },
  regular: {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: COLORS.white,
  },
  regularBold: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: COLORS.white,
  },
});
