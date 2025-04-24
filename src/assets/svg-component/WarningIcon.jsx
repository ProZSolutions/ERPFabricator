import * as React from "react"
import Svg, { Path } from "react-native-svg"

function WarningIcon(props) {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M9 5.813V9.75"
        stroke="#292D32"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.81 6.435v5.13c0 .84-.45 1.62-1.177 2.048l-4.455 2.572c-.728.42-1.628.42-2.363 0L3.36 13.613a2.362 2.362 0 01-1.177-2.048v-5.13c0-.84.45-1.62 1.177-2.048l4.455-2.572a2.372 2.372 0 012.363 0l4.455 2.572a2.371 2.371 0 011.177 2.048z"
        stroke="#FF4E4E"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12.15v.075"
        stroke="#292D32"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default WarningIcon;
