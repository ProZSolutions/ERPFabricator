import * as React from "react"
import Svg, { Rect, G, Path, Defs, ClipPath } from "react-native-svg"

function UpcomingChitIcon(props) {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={48} height={48} rx={24} fill="#F5F7FE" />
      <G clipPath="url(#clip0_662_27950)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.686 22.462a2.5 2.5 0 000 3.535l2.829 2.829a2.5 2.5 0 004.242-2.122l.973-.972 6.078 7.014a2.793 2.793 0 103.94-3.94l-7.013-6.08.972-.971a2.5 2.5 0 002.121-4.243L26 14.683a2.5 2.5 0 00-4.243 2.122l-4.95 4.95a2.496 2.496 0 00-2.12.707zm10.253-1.768l-4.242 4.242-2.121-2.12 4.242-4.243 2.121 2.12zm-8.838 3.889a.5.5 0 01.707-.707l2.828 2.828a.5.5 0 01-.707.707l-2.828-2.828zm7.778-7.778a.5.5 0 11.707-.707l2.828 2.828a.5.5 0 11-.707.707l-2.828-2.828zm6.44 14.63l-6.007-6.932.194-.194 6.933 6.008a.793.793 0 11-1.12 1.119z"
          fill="#285FE7"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_662_27950">
          <Path fill="#fff" transform="translate(12 12)" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default UpcomingChitIcon
