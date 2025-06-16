import * as React from "react"
import {Svg, SvgProps, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={3}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M2.973 1.5c0 .828-.666 1.5-1.487 1.5A1.493 1.493 0 0 1 0 1.5C0 .672.666 0 1.486 0c.821 0 1.487.672 1.487 1.5ZM11.486 1.5c0 .828-.665 1.5-1.486 1.5a1.493 1.493 0 0 1-1.486-1.5C8.514.672 9.179 0 10 0s1.486.672 1.486 1.5ZM20 1.5c0 .828-.666 1.5-1.486 1.5a1.493 1.493 0 0 1-1.487-1.5c0-.828.665-1.5 1.486-1.5S20 .672 20 1.5Z"
    />
  </Svg>
)
export default SvgComponent
