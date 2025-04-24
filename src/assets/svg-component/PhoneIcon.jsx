import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PhoneIcon = (props) => (
    <Svg
        width={18}
        height={36}
        viewBox="0 0 18 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M17 13v10c0 4-1 5-5 5H6c-4 0-5-1-5-5V13c0-4 1-5 5-5h6c4 0 5 1 5 5zM11 11.5H7"
            stroke="#285FE7"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M9 25.1A1.55 1.55 0 109 22a1.55 1.55 0 000 3.1z"
            stroke="#285FE7"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default PhoneIcon;
