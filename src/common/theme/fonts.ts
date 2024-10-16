import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const fonts = StyleSheet.create({
	heading1: {
		fontSize: 30,
		fontWeight: 'bold',
		fontStyle: 'normal',
		color: COLORS.black,
	},
	heading2: {
		fontSize: 25,
		fontWeight: 'bold',
		fontStyle: 'normal',
		color: COLORS.black,
	},
	regular: {
		fontSize: 18,
		fontWeight: 'normal',
		fontStyle: 'normal',
		color: COLORS.black,
	},
	regularBoldTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		fontStyle: 'normal',
		color: COLORS.black,
	},
	whiteFont: {
		color: COLORS.white,
	},
});
