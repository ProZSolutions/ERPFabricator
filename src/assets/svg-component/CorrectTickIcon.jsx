import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function CorrectTickIcon(props) {
  return (
    <Svg
      width={19}
      height={18}
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_1637_37434)">
        <Path
          d="M4.25 9L8 12.75l7.5-7.5"
          stroke="#285FE7"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1637_37434">
          <Path fill="#fff" transform="translate(.5)" d="M0 0H18V18H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default CorrectTickIcon;
