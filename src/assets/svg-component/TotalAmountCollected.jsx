import * as React from "react"
import Svg, { Path } from "react-native-svg"

function TotalAmountCollected(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16l-3-2-2 2-2-2-2 2-2-2-3 2z"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 7H9h1a3 3 0 010 6H9l3 3"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 10h6z" fill="#285FE7" />
      <Path
        d="M9 10h6"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default TotalAmountCollected
