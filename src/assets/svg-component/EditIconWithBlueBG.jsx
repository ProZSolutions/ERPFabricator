import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

function EditIconWithBlueBG(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={12} cy={12} r={12} fill="#285FE7" />
      <Path
        d="M12.42 8.615a2.1 2.1 0 112.97 2.97L12 15.005H9v-3l3.42-3.39z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default EditIconWithBlueBG
