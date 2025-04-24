import * as React from "react"
import Svg, { Path } from "react-native-svg"

function LossIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10 3.2A9 9 0 1020.8 14a1 1 0 00-1-1H13a2 2 0 01-2-2V4a.899.899 0 00-1-.8z"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 3.5A9 9 0 0120.5 9H16a1 1 0 01-1-1V3.5z"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default LossIcon
