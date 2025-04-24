import * as React from "react"
import Svg, { Path } from "react-native-svg"

function GenderIcon(props) {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.5 11.5a4 4 0 108 0 4 4 0 00-8 0zM19.5 3.5l-5 5M15.5 3.5h4v4M11.5 16.5v6M8.5 19.5h6"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default GenderIcon
