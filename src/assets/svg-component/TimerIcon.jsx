import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function TimerIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_2423_69733)">
        <Path
          d="M12.5 16c-2 1.2-4.5 1.5-5.5 1.5H6V21h11.5l.5-1-.5-2c-1.2-4-3.833-3-5-2z"
          fill="#5682FF"
        />
        <Path
          d="M6 20v-2a6 6 0 1112 0v2a1 1 0 01-1 1H7a1 1 0 01-1-1z"
          stroke="#285FE7"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M6 4v2a6 6 0 1012 0V4a1 1 0 00-1-1H7a1 1 0 00-1 1z"
          stroke="#285FE7"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2423_69733">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default TimerIcon
