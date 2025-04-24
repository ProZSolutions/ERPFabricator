import * as React from "react"
import Svg, { Path } from "react-native-svg"

function FooterChitCalcIcon(props) {
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
        d="M10.75 22h4c5 0 7-2 7-7V9c0-5-2-7-7-7h-4c-5 0-7 2-7 7v6c0 5 2 7 7 7z"
        stroke="#142650"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.25 7.58v1c0 .82-.67 1.5-1.5 1.5h-6c-.82 0-1.5-.67-1.5-1.5v-1c0-.82.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5z"
        stroke="#142650"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.886 14h.012M12.745 14h.012M16.604 14h.012M8.886 17.5h.012M12.745 17.5h.012M16.604 17.5h.012"
        stroke="#A1A8B9"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default FooterChitCalcIcon
