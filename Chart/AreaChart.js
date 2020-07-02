import * as d3 from 'd3';
import React, { memo } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { concat } from 'react-native-reanimated';
import Cursor from './Cursor';
import XAxis from './Axis';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const width = Dimensions.get('window').width - 20;
const height = 135;

export default memo((props) => {
  const dataXrange = d3.extent(props.data.map((d) => d.date));
  const dataYrange = d3.extent(props.data, (d) => d.value);

  const scaleX = d3.scaleTime().domain(dataXrange).range([0, width]).nice();

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
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      <Svg
        style={{
          height,
          width: width,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="1" stopColor="#8C04FF" stopOpacity="1" />
            <Stop offset="0" stopColor="#ED06FE" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <AnimatedPath
          d={concat(d, `L${width}, ${height} L0 ${height} Z`)}
          stroke={'none'}
          fill="url(#grad)"
        />
      </Svg>
      <XAxis {...{ scaleX, height, width }} />
      <Cursor
        {...{
          height,
          width,
          d,
          scaleX,
          scaleY,
          initial: props.initial,
          onValue,
        }}
      />
    </View>
  );
});
