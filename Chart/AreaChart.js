import * as d3 from 'd3';
import React, { memo } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text,
  G,
} from 'react-native-svg';
import Animated, { concat } from 'react-native-reanimated';
import Cursor from './Cursor';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedGroup = Animated.createAnimatedComponent(G);

const { width } = Dimensions.get('window');
const height = 135;

const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

export default memo((props) => {
  const dataYrange = d3.extent(props.data, (d) => d.value);

  const scaleX = d3
    .scaleTime()
    .domain([new Date('1/1/2020'), new Date('12/1/2020')])
    .range([0, width - 20])
    .nice();

  const scaleY = d3
    .scaleLinear()
    .domain(dataYrange)
    .range([height - 24, 24]);

  const d = d3
    .line()
    .x((d) => scaleX(d.date))
    .y((d) => scaleY(d.value))
    .curve(d3.curveNatural)(props.data);

  function onValue(value) {
    props.onValue(scaleY.invert(value));
  }

  return (
    <View
      style={{
        height,
        width: width - 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Svg
        style={{
          height,
          width: width - 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#8C04FF" stopOpacity="1" />
            <Stop offset="1" stopColor="#ED06FE" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <AnimatedPath
          d={concat(d, `L${width - 20}, ${height} L0 ${height} Z`)}
          stroke={'none'}
          fill="url(#grad)"
        />
      </Svg>
      <Cursor {...{ height, width, d, scaleX, scaleY, onValue }} />
    </View>
  );
});
