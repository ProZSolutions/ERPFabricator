import * as React from "react"
import Svg, { Path } from "react-native-svg"

function DownArrowWhiteIcon(props) {
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
        d="M10.656 15.484c.38.35.862.526 1.345.526-.512 0-.986-.186-1.345-.526z"
        fill="#fff"
        stroke="#fff"
        strokeWidth={1.5}
      />
    </Svg>
  )
}

export default DownArrowWhiteIcon
