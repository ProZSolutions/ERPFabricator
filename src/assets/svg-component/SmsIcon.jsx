import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function SmsIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G
        clipPath="url(#clip0_1352_61168)"
        stroke="#285FE7"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M14.667 4H28v10.667h-4l-5.333 2.666v-2.666h-4V4z" />
        <Path d="M20 21.333v5.333a1.333 1.333 0 01-1.333 1.333H8a1.333 1.333 0 01-1.333-1.333V7.999A1.333 1.333 0 018 6.666h2.667M13.333 24v.013" />
      </G>
      <Defs>
        <ClipPath id="clip0_1352_61168">
          <Path fill="#fff" d="M0 0H32V32H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default SmsIcon;
