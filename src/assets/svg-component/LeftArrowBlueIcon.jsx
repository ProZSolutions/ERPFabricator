import * as React from "react"
import Svg, { Path } from "react-native-svg"

function LeftArrowBlueIcon(props) {
  return (
    <Svg
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M4.707 11.646l-.354.353.354.354 5.54 5.54a.255.255 0 010 .353l-.006.006-.006.006a.228.228 0 01-.165.061.242.242 0 01-.176-.073l-6.07-6.07a.255.255 0 010-.353l6.07-6.07a.255.255 0 01.353 0 .255.255 0 010 .353l-5.54 5.54z"
        stroke="#285FE7"
      />
      <Path
        d="M21 12.25H4.17a.256.256 0 01-.25-.25c0-.134.116-.25.25-.25H21c.134 0 .25.116.25.25s-.116.25-.25.25z"
        stroke="#285FE7"
      />
    </Svg>
  )
}

export default LeftArrowBlueIcon
