import * as React from "react"
import {Svg, SvgProps, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={48}
    fill="none"
    {...props}
  >
    <Path
      stroke="#BFBFBF"
      strokeWidth={2}
      d="M12 35.051c12.302 0 10.163-18.282 23-15.923m0 0C33.747 17.516 30.186 15 30.186 15M35 19.128c-1.253 1.843-4.814 4.718-4.814 4.718M35 33.872C33.747 35.484 30.186 38 30.186 38M35 33.872c-1.253-1.843-4.814-4.718-4.814-4.718M35 33.872c-5.206.956-7.949-1.481-10.19-4.718M12 17.949c4.731 0 6.953 2.359 9.628 5.897"
    />
  </Svg>
)
export default SvgComponent
