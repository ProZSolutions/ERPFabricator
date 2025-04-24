import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

function ProfitLossIcon(props) {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={48} height={48} rx={24} fill="#F5F7FE" />
      <Path
        d="M23 18c0 .796.527 1.559 1.465 2.121.937.563 2.209.879 3.535.879s2.598-.316 3.535-.879C32.474 19.56 33 18.796 33 18s-.527-1.559-1.465-2.121C30.598 15.316 29.326 15 28 15s-2.598.316-3.535.879C23.527 16.44 23 17.204 23 18z"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23 18v4c0 1.657 2.239 3 5 3s5-1.343 5-3v-4"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23 22v4c0 1.657 2.239 3 5 3s5-1.343 5-3v-4"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23 26v4c0 1.657 2.239 3 5 3s5-1.343 5-3v-4M19 21h-2.5a1.5 1.5 0 100 3h1a1.5 1.5 0 110 3H15M17 27v1m0-8v1"
        stroke="#285FE7"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default ProfitLossIcon
