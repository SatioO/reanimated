import React from 'react';
import Svg, { Path } from 'react-native-svg';

function Caret() {
  return (
    <Svg height="16" viewBox="0 0 24 24" width="16">
      <Path
        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
        fill="#888"
      />
    </Svg>
  );
}

export default Caret;
