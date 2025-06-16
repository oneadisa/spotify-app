import * as React from "react"
import {Svg, SvgProps, Rect, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Rect width={2} height={14} x={11} y={5} fill="#D9D9D9" rx={1} />
    <Rect
      width={2}
      height={14}
      x={5}
      y={13}
      fill="#D9D9D9"
      rx={1}
      transform="rotate(-90 5 13)"
    />
    <Path
      stroke="#BFBFBF"
      strokeWidth={2}
      d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1Z"
    />
  </Svg>
)
export default SvgComponent
