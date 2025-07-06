import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from '../../theme/index.ts';

interface HomeIconProps {
  size?: number;
  color?: string;
}

export const HomeIcon: React.FC<HomeIconProps> = (props: HomeIconProps) => {
  const theme = useTheme();
  const iconColor = props.color || theme.colors.primary;

  return (
<Svg
    width={22}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill={iconColor}
      d="M8.462 16.113v6.902c0 .261-.09.512-.248.697a.79.79 0 0 1-.599.288H.846a.79.79 0 0 1-.598-.288A1.072 1.072 0 0 1 0 23.015V9.231c0-.13.022-.258.064-.377.082-.233.278-.4.466-.56L9.732.517c.178-.151.333-.34.543-.44a.744.744 0 0 1 .648 0c.21.1.368.286.552.43l9.986 7.8c.194.151.393.315.475.548.043.12.064.248.064.377v13.784c0 .261-.09.512-.248.697a.79.79 0 0 1-.598.288h-6.77a.79.79 0 0 1-.598-.288 1.072 1.072 0 0 1-.247-.697v-6.892c0-.492-.424-.984-.847-.984H9.308c-.423 0-.846.492-.846.974Z"
    />
  </Svg>
  );
};

export default HomeIcon;
