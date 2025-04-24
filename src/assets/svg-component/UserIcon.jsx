import * as React from "react"
import Svg, { Path } from "react-native-svg"

function UserIcon(props) {
  return (
    <Svg
      width={24}
      height={36}
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M20 27v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m12-14a4 4 0 11-8 0 4 4 0 018 0z"
        stroke="#285FE7"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default UserIcon
