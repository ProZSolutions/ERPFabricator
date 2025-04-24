import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function CompanyIcon(props) {
  return (
    <Svg
      width={24}
      height={36}
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G
        clipPath="url(#clip0_653_45051)"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path
          d="M3 27h18M5 27V13l8-4v18M19 27V17l-6-4M9 15v.01M9 18v.01M9 21v.01"
          stroke="#285FE7"
        />
        <Path d="M9 24v.01" stroke="#000" />
      </G>
      <Defs>
        <ClipPath id="clip0_653_45051">
          <Path fill="#fff" transform="translate(0 6)" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default CompanyIcon
