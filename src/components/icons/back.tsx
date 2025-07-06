import * as React from "react"
import { Svg, SvgProps, Path } from "react-native-svg"
import { useTheme } from "../../theme/ThemeProvider"

const BackButton = (props: SvgProps) => {
  const theme = useTheme();
  
  return (
    <Svg
      width={32}
      height={32}
      fill="none"
      {...props}
    >
      <Path
        fill={theme.colors.background}
        d="M.002 15.754C.138 7.258 6.781.208 15.616.004c9.045-.208 16.243 7.053 16.382 15.75.141 8.834-7.195 16.453-16.382 16.242C6.635 31.789-.136 24.39.002 15.754Z"
        opacity={0.3}
      />
      <Path
        fill={theme.colors.text}
        d="M10.219 16.267a.689.689 0 0 1 0-1.008l7.399-7.05a.774.774 0 0 1 1.057 0 .689.689 0 0 1 0 1.007l-7.4 7.05a.774.774 0 0 1-1.056 0Z"
      />
      <Path
        fill={theme.colors.text}
        d="M10.325 15.733a.689.689 0 0 0 0 1.008l7.4 7.05a.774.774 0 0 0 1.056 0 .689.689 0 0 0 0-1.007l-7.399-7.05a.774.774 0 0 0-1.057 0Z"
      />
    </Svg>
  )
}

export default BackButton
