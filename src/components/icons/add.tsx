import * as React from "react"
import {Svg, SvgProps, Rect, Path } from "react-native-svg"
import { useTheme } from "../../theme/ThemeProvider"

const AddIcon = (props: SvgProps) => {
  const theme = useTheme();
  
  return (
    <Svg
      // xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <Rect width={2} height={14} x={11} y={5} fill={theme.colors.text} rx={1} />
      <Rect
        width={2}
        height={14}
        x={5}
        y={13}
        fill={theme.colors.text}
        rx={1}
        transform="rotate(-90 5 13)"
      />
      <Path
        stroke={theme.colors.border}
        strokeWidth={2}
        d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1Z"
      />
    </Svg>
  )
}

export default AddIcon
