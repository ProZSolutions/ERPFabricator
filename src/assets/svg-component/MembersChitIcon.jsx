import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

function MembersChitIcon(props) {
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
        d="M22 25a2 2 0 104 0 2 2 0 00-4 0z"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 33v-1a2 2 0 012-2h4a2 2 0 012 2v1M27 17a2 2 0 104 0 2 2 0 00-4 0zM29 22h2a2 2 0 012 2v1M17 17a2 2 0 104 0 2 2 0 00-4 0zM15 25v-1a2 2 0 012-2h2"
        stroke="#285FE7"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default MembersChitIcon
