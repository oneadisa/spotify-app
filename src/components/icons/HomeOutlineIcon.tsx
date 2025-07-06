import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from '../../theme/index.ts';

interface HomeOutlineIconProps {
  size?: number;
  color?: string;
}

export const HomeOutlineIcon: React.FC<HomeOutlineIconProps> = (props: HomeOutlineIconProps) => {
  const theme = useTheme();
  const iconColor = props.color || theme.colors.textSecondary;

  return (
    <Svg
    width={22}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke={iconColor}
      strokeWidth={1.5}
      d="M.75 9.23a.39.39 0 0 1 .006-.066l.015-.06c-.003.007 0-.008.04-.052.023-.025.049-.05.082-.08l.122-.105 9.2-7.778c.062-.052.119-.105.163-.147l.116-.108A.6.6 0 0 1 10.6.752a.646.646 0 0 1 .118.089l.296.256 9.986 7.8c.097.075.155.125.196.168l.035.04a.36.36 0 0 1 .014.06l.006.064v13.787a.326.326 0 0 1-.066.207.103.103 0 0 1-.032.026c-.004.002-.002.001.002.001h-6.77c.005 0 .006 0 .003-.001a.101.101 0 0 1-.032-.026.324.324 0 0 1-.067-.207v-6.893c0-.453-.189-.868-.445-1.166-.25-.29-.652-.568-1.15-.568H9.307c-.498 0-.9.277-1.149.565a1.801 1.801 0 0 0-.447 1.16v6.902a.325.325 0 0 1-.067.207.102.102 0 0 1-.032.026c-.003.002-.002.001.002.001H.845c.005 0 .006 0 .003-.001l-.032-.026a.326.326 0 0 1-.066-.207V9.229Z"
    />
  </Svg>
  );
};

export default HomeOutlineIcon;


