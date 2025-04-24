import * as React from "react"
import Svg, { Path } from "react-native-svg"

function DOBIcon(props) {
  return (
    <Svg
      width={24}
      height={36}
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M2 28h20M3.11 28v-9c0-1.66 1.49-3 3.33-3h11.11c1.84 0 3.33 1.34 3.33 3v9M5.56 16v-2.83c0-1.2 1.08-2.17 2.42-2.17h8.05c1.33 0 2.41.97 2.41 2.17V16"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.53 19.98l.37.01c.74.01 1.33.61 1.33 1.35v.33a1.35 1.35 0 002.7 0v-.31a1.35 1.35 0 012.7 0v.31a1.35 1.35 0 002.7 0v-.31a1.35 1.35 0 012.7 0v.31a1.35 1.35 0 002.7 0v-.31c0-.74.6-1.35 1.35-1.35h.45M8 11V9M16 11V9M12 11V8"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default DOBIcon
