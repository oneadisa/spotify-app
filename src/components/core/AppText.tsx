import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../../theme/index.ts';

type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

interface AppTextProps extends TextProps {
  weight?: 'regular' | 'medium' | 'bold';
}

const AppText: React.FC<AppTextProps> = ({
  weight = 'regular',
  style,
  children,
  ...rest
}) => {
  const theme = useTheme();

  const fontWeightMap: Record<'regular' | 'medium' | 'bold', FontWeight> = {
    regular: '400',
    medium: '500',
    bold: '700',
  };

  const textStyle: TextStyle = {
    color: theme.colors.text,
    fontFamily: 'DM Sans',
    fontWeight: fontWeightMap[weight],
  };

  return (
    <Text
      style={[textStyle, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default AppText;
