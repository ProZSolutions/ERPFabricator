import * as React from "react"
import Svg, { Circle, G, Path, Defs, ClipPath } from "react-native-svg"

function ShareIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={12} cy={12} r={12} fill="#285FE7" />
      <G
        clipPath="url(#clip0_600_110166)"
        stroke="#fff"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M6 12a2 2 0 104 0 2 2 0 00-4 0zM14 8a2 2 0 104 0 2 2 0 00-4 0zM14 16a2 2 0 104 0 2 2 0 00-4 0zM9.8 11.134l4.4-2.267M9.8 12.867l4.4 2.267" />
      </G>
      <Defs>
        <ClipPath id="clip0_600_110166">
          <Path fill="#fff" transform="translate(4 4)" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default ShareIcon
