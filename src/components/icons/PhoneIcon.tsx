import React from 'react';
import { Path, Svg } from 'react-native-svg';

interface PhoneIconProps {
  size?: number;
  color?: string;
  style?: any;
}

export const PhoneIcon: React.FC<PhoneIconProps> = (props: PhoneIconProps) => {
  const iconColor = props.color || '#FFFFFF'; // Default to white if no color provided

  return (
    <Svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        fill={iconColor}
        stroke={iconColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PhoneIcon;
