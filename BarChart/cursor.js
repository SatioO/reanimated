import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { decay, clamp, parsePath, getPointAtLength } from 'react-native-redash';

const { Value, event, sub, interpolate } = Animated;
const TOUCH_SIZE = 200;
const { width } = Dimensions.get('window');
const white = 'white';

// export default ({ d, r, borderWidth, borderColor }) => {
  
//   return (
    
//   );
// };
