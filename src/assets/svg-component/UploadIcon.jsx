import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function UploadIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G
        clipPath="url(#clip0_653_45075)"
        stroke="#285FE7"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M14 3v4a1 1 0 001 1h4" />
        <Path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2zM12 11v6" />
        <Path d="M9.5 13.5L12 11l2.5 2.5" />
      </G>
      <Defs>
        <ClipPath id="clip0_653_45075">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default UploadIcon
