import * as React from "react";
import { Svg, SvgProps, Rect, Path } from "react-native-svg";

interface LikedProps extends SvgProps {
  width?: number | string;
  height?: number | string;
}

export const Liked: React.FC<LikedProps> = (props) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <Rect
      width={21}
      height={21}
      x={2}
      y={2}
      fill="#0ED451"
      stroke="#111"
      strokeWidth={3}
      rx={11.4}
    />
    <Path
      fill="#fff"
      stroke="#fff"
      d="M13.278 12.371S12.05 7.756 9.92 7.917c-2.022.153-3.884 2.64-2.879 4.454 1.92 3.465 6.237 6.929 6.237 6.929s4.317-3.96 5.757-6.929c.862-1.78-.493-4.149-2.4-4.454-2.11-.338-3.357 4.454-3.357 4.454Z"
    />
  </Svg>
);
