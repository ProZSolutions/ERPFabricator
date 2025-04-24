import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function DownloadWhiteIcon(props) {
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
        clipPath="url(#clip0_3217_125120)"
        stroke="#285FE7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path
          d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 11l5 5 5-5"
          strokeWidth={1.5}
        />
        <Path d="M12 4v12" strokeWidth={1.4} />
      </G>
      <Defs>
        <ClipPath id="clip0_3217_125120">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default DownloadWhiteIcon
