import * as React from "react"
import Svg, { Path } from "react-native-svg"

function AddressIcon(props) {
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
        d="M2 28h20M15.01 27.99l-12 .02L3 13.07c0-.67.34-1.29.89-1.66l4-2.67c.67-.45 1.55-.45 2.22 0l4 2.67c.56.37.89.99.89 1.66l.01 14.92zM19.98 28.01V24M20 18c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2s2-.9 2-2v-2c0-1.1-.9-2-2-2zM3 20h12M9 28v-3.75"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default AddressIcon
