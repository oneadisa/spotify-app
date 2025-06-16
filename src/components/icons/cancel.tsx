import * as React from "react"
import {Svg, SvgProps, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    {...props}
  >
    <Path
      fill="#BFBFBF"
      d="M11.607.293a1 1 0 1 1 1.414 1.414L1.707 13.021a1 1 0 0 1-1.414-1.414L11.607.293Z"
    />
    <Path
      fill="#BFBFBF"
      d="M.293 1.707A1 1 0 1 1 1.707.293l11.314 11.314a1 1 0 1 1-1.414 1.414L.293 1.707Z"
    />
  </Svg>
)
export default SvgComponent
