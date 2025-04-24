import * as React from "react"
import Svg, { Path } from "react-native-svg"

function PlayIcon(props) {
  return (
    <Svg
      width={19}
      height={18}
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.055 9.173V7.92c0-1.56 1.102-2.197 2.452-1.417l1.088.63 1.087.63c1.35.78 1.35 2.055 0 2.835l-1.087.63-1.088.63c-1.35.78-2.452.143-2.452-1.418V9.174z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default PlayIcon
