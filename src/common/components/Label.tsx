import * as React from 'react';
import { Text } from 'react-native';

import { fonts } from '../theme';

interface Props {
	title: string;
}

export const Label = ({ title }: Props) => {
	return <Text style={fonts.regularBoldTitle}>{title}</Text>;
};
