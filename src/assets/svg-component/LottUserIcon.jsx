import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function LottUserIcon(props) {
  return (
    <Svg
      width={24}
      height={42}
      viewBox="0 0 24 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G
        clipPath="url(#clip0_2417_44762)"
        stroke="#285FE7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M12 22a3 3 0 100-6 3 3 0 000 6z" strokeWidth={1.5} />
        <Path
          d="M12 12c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z"
          strokeWidth={1.4}
        />
        <Path d="M6 29.05V29a4 4 0 014-4h4a4 4 0 014 4v.05" strokeWidth={1.4} />
      </G>
      <Defs>
        <ClipPath id="clip0_2417_44762">
          <Path fill="#fff" transform="translate(0 9)" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default LottUserIcon
