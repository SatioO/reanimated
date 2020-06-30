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
import { useValue } from 'react-native-redash';
import * as d3 from 'd3';
import Cursor from './Cursor';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedGroup = Animated.createAnimatedComponent(G);

const width = Dimensions.get('window').width;
const height = 130;

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
  const scale = useValue(0);
  const dataXrange = d3.extent(props.data, (d) => d.date);
  const dataYrange = d3.extent(props.data, (d) => d.value);

  const x = d3
    .scaleTime()
    .domain(dataXrange)
    .range([0, width - 20]);

  const y = d3
    .scaleLinear()
    .domain(dataYrange)
    .range([height - 24, 24])
    .clamp(true);

  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value))
    .curve(d3.curveNatural);

  const ticks = d3
    .scaleTime()
    .domain(dataXrange)
    .range([16, width - 36]);

  function onValue(value) {
    props.onValue(y.invert(value));
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
          d={concat(
            line(props.data),
            `L${width - 20}, ${height} L0 ${height} Z`,
          )}
          stroke={'none'}
          fill="url(#grad)"
        />
        <AnimatedGroup
          y={scale.interpolate({
            inputRange: [0, 1],
            outputRange: [height, height - 20],
          })}>
          {ticks.ticks(d3.timeMonth.every(2)).map((tick, index) => (
            <Text
              textAnchor={'middle'}
              originX={x(tick)}
              alignmentBaseline={'hanging'}
              x={ticks(tick)}
              fontSize={12}
              fill="#FFF"
              key={index}>
              {months[tick.getMonth()]}
            </Text>
          ))}
        </AnimatedGroup>
      </Svg>
      <Cursor {...{ height, width, path: line(props.data), onValue }} />
    </View>
  );
});
