import React from 'react';
import { Path, Svg } from 'react-native-svg';

interface GoogleIconProps {
  size?: number;
  color?: string;
  style?: any;
}

export const GoogleIcon: React.FC<GoogleIconProps> = (props: GoogleIconProps) => {
  const iconColor = props.color || '#000000'; // Default to black if no color provided

  return (
    <Svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 9.6735 21.8055 10.0415Z"
        fill="#FFC107"
      />
      <Path
        d="M3.15302 7.3455L6.43852 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z"
        fill="#FF3D00"
      />
      <Path
        d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.6058 17.5455 13.3575 18.001 12 18C9.39902 18 7.19052 16.3415 6.35852 14.027L3.09753 16.5395C4.75253 19.778 8.11352 22 12 22Z"
        fill="#4CAF50"
      />
      <Path
        d="M21.8055 10.0415H21V10H12V14H17.6515C17.3255 15.0465 16.757 15.9925 16.008 16.7855C16.0085 16.785 16.009 16.785 16.0095 16.7845L19.1045 19.4035C18.906 19.5825 22 17 22 12C22 11.3295 21.931 9.6735 21.8055 10.0415Z"
        fill="#1976D2"
      />
    </Svg>
  );
};

export default GoogleIcon;
