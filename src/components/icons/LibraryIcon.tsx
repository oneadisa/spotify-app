import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from '../../theme/index.ts';

interface LibraryFilledIconProps {
  size?: number;
  color?: string;
}

export const LibraryFilledIcon: React.FC<LibraryFilledIconProps> = ({
  size = 22,
  color,
}) => {
  const theme = useTheme();
  const iconColor = color || theme.colors.primary;

  return (
    <Svg
      width={size}
      height={(size / 22) * 24}
      viewBox="0 0 22 24"
      fill="none"
    >
      {/* Left Book */}
      <Path
        d="M1 0C1.55 0 2 .45 2 1V23C2 23.55 1.55 24 1 24C0.45 24 0 23.55 0 23V1C0 .45.45 0 1 0Z"
        fill={iconColor}
      />
      {/* Middle Book */}
      <Path
        d="M7 0C7.55 0 8 .45 8 1V23C8 23.55 7.55 24 7 24C6.45 24 6 23.55 6 23V1C6 .45 6.45 0 7 0Z"
        fill={iconColor}
      />
      {/* Right Stack (slanted books) */}
      <Path
        d="M13.5 0C13.88 0 14.29.1 14.71.31L21.24 4.19C21.74 4.47 22 4.97 22 5.5V23C22 23.55 21.55 24 21 24H13C12.45 24 12 23.55 12 23V1C12 .45 12.45 0 13 0H13.5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default LibraryFilledIcon;
