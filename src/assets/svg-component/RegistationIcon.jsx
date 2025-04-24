import * as React from "react"
import Svg, { Path } from "react-native-svg"

function RegistrationIcon(props) {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M14.5 3.5v4a1 1 0 001 1h4"
        stroke="#285FE7"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.5 8.5v-3a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2h-5"
        stroke="#285FE7"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.5 14.5a3 3 0 106 0 3 3 0 00-6 0z"
        stroke="#285FE7"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 17.5l-1.5 5 3-1.5 3 1.5-1.5-5"
        stroke="#285FE7"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default RegistrationIcon
