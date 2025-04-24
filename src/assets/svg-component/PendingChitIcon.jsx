import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

function PendingChitIcon(props) {
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
      <Path
        d="M32.5 23.3v-4.26c0-4.03-.94-5.04-4.72-5.04h-7.56c-3.78 0-4.72 1.01-4.72 5.04V30.3c0 2.66 1.46 3.29 3.23 1.39l.01-.01c.82-.87 2.07-.8 2.78.15l1.01 1.35M20 19h8M21 23h6"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M30.211 26.77l-3.54 3.54c-.14.14-.27.4-.3.59l-.19 1.35c-.07.49.27.83.76.76l1.35-.19c.19-.03.46-.16.59-.3l3.54-3.54c.61-.61.9-1.32 0-2.22-.89-.89-1.6-.6-2.21.01zM29.7 27.281c.3 1.08 1.14 1.92 2.22 2.22"
        stroke="#285FE7"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default PendingChitIcon
