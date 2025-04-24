import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CommisionReceivedIcon(props) {
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
        d="M4 6c0 1.657 3.582 3 8 3s8-1.343 8-3-3.582-3-8-3-8 1.343-8 3z"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 6v6c0 1.657 3.582 3 8 3 .415 0 .822-.012 1.22-.035M20 10V6"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 12v6c0 1.657 3.582 3 8 3 .352 0 .698-.009 1.037-.025M21 15h-2.5a1.5 1.5 0 100 3h1a1.5 1.5 0 110 3H17M19 21v1m0-8v1"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default CommisionReceivedIcon
