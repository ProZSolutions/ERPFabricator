import * as React from "react"
import Svg, { Circle } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: animate */

function LiveChitProgressIcon(props) {
  return (
    <Svg
      width={50}
      height={50}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={50} cy={50} r={10} fill="red" />
      <Circle
        cx={50}
        cy={50}
        r={15}
        fill="none"
        stroke="red"
        strokeWidth={2}
        opacity={0.5}
      ></Circle>
      <Circle
        cx={50}
        cy={50}
        r={15}
        fill="none"
        stroke="red"
        strokeWidth={2}
        opacity={0.5}
      ></Circle>
    </Svg>
  )
}

export default LiveChitProgressIcon
