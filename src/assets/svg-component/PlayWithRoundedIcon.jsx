import * as React from "react"
import Svg, { Path } from "react-native-svg"

function PlayWithRoundedIcon(props) {
  return (
    <Svg
      width={46}
      height={46}
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M22.942 42.167c10.586 0 19.167-8.58 19.167-19.166S33.528 3.834 22.942 3.834c-10.585 0-19.167 8.581-19.167 19.167 0 10.585 8.582 19.166 19.167 19.166z"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.752 23.44v-3.2c0-3.987 2.818-5.617 6.268-3.623l2.779 1.61 2.779 1.61c3.45 1.993 3.45 5.251 0 7.245l-2.78 1.61-2.778 1.61c-3.45 1.993-6.268.364-6.268-3.623V23.44z"
        fill="#285FE7"
      />
    </Svg>
  )
}

export default PlayWithRoundedIcon
