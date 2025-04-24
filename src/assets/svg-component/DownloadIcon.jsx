import * as React from "react"
import Svg, { Circle, G, Path, Defs, ClipPath } from "react-native-svg"

function DownloadIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={12} cy={12} r={12} fill="#142650" />
      <G
        clipPath="url(#clip0_728_18062)"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M6.667 14.332v1.333A1.333 1.333 0 008 17h8a1.333 1.333 0 001.334-1.334v-1.333M8.667 10.332L12 13.665l3.334-3.333M12 5.668v8" />
      </G>
      <Defs>
        <ClipPath id="clip0_728_18062">
          <Path fill="#fff" transform="translate(4 3)" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default DownloadIcon
