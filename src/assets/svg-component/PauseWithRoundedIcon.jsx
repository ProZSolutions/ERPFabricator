import * as React from "react"
import Svg, { Path } from "react-native-svg"

function PauseWithRoundedIcon(props) {
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
        d="M20.546 27.85V18.15c0-.92-.383-1.284-1.36-1.284h-2.492c-.978 0-1.361.364-1.361 1.284v9.699c0 .92.383 1.284 1.36 1.284h2.473c.997 0 1.38-.364 1.38-1.284zM30.667 27.85V18.15c0-.92-.384-1.284-1.361-1.284h-2.473c-.977 0-1.36.364-1.36 1.284v9.699c0 .92.383 1.284 1.36 1.284h2.473c.977 0 1.36-.364 1.36-1.284z"
        fill="#285FE7"
      />
    </Svg>
  )
}

export default PauseWithRoundedIcon
