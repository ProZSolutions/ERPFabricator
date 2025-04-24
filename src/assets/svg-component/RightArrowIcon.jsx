import * as React from "react"
import Svg, { Path } from "react-native-svg"

function RightArrowIcon(props) {
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
        d="M19.794 11.646l.353.353-.353.354-5.54 5.54a.255.255 0 000 .353l.006.006.006.006c.03.032.089.061.164.061a.242.242 0 00.177-.073l6.07-6.07a.255.255 0 000-.353l-6.07-6.07a.255.255 0 00-.353 0 .255.255 0 000 .353l5.54 5.54z"
        stroke="#fff"
      />
      <Path
        d="M3.5 12.25h16.83c.134 0 .25-.116.25-.25a.256.256 0 00-.25-.25H3.5a.256.256 0 00-.25.25c0 .134.116.25.25.25z"
        stroke="#fff"
      />
    </Svg>
  )
}

export default RightArrowIcon
