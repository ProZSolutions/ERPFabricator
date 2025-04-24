import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function EditIcon(props) {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G
        clipPath="url(#clip0_1663_18148)"
        stroke="#0DB984"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M7.5 12.75l6.289-6.311A1.575 1.575 0 0011.56 4.21l-6.311 6.29v2.25H7.5zM10.5 5.25l2.25 2.25" />
      </G>
      <Defs>
        <ClipPath id="clip0_1663_18148">
          <Path fill="#fff" d="M0 0H18V18H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default EditIcon
