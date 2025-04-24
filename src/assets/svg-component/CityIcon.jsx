import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CityIcon(props) {
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
        d="M12 22v-2M12 18v-2M12 14v-3c0-3.87 3.13-7 7-7h3M2 4h3c3.87 0 7 3.13 7 7v3"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 2L2 4l2 2M20 2l2 2-2 2"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default CityIcon
