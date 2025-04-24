import * as React from "react"
import Svg, { Path } from "react-native-svg"

function DisolveIcon(props) {
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
        d="M20.5 6a1 1 0 01.117 1.993L20.5 8h-.081l-.92 11a3 3 0 01-2.823 2.995L16.5 22h-8c-1.598 0-2.904-1.249-2.992-2.75l-.005-.167L4.58 8H4.5a1 1 0 01-.117-1.993L4.5 6h16zm-9.49 5.14a1 1 0 00-1.217 1.567L11.085 14l-1.292 1.293-.083.094a1 1 0 001.497 1.32l1.293-1.292 1.293 1.292.094.083a1 1 0 001.32-1.497L13.915 14l1.292-1.293.083-.094a1 1 0 00-1.497-1.32L12.5 12.585l-1.293-1.292-.094-.083-.102-.07zM14.5 2a2 2 0 012 2 1 1 0 01-1.993.117L14.5 4h-4l-.007.117A1 1 0 018.5 4a2 2 0 011.85-1.995L10.5 2h4z"
        fill="#fff"
      />
    </Svg>
  )
}

export default DisolveIcon
