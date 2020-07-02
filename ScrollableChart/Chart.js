import * as d3 from 'd3';
import React, { useRef } from 'react';
import styles from './styles';
import { View, StyleSheet, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useCode, call } from 'react-native-reanimated';
import { useValue } from 'react-native-redash';
import * as path from 'svg-path-properties';
import { height, width } from './utils';

function Chart(props) {
  const cursor = useRef(null);
  const label = useRef(null);
  const x = useValue(0);

  const onScrollEvent = Animated.event([
    {
      nativeEvent: {
        contentOffset: { x },
      },
    },
  ]);

  const { left, right, top, bottom } = props.contentInset;

  const dataXrange = d3.extent(props.data.map((d) => d.x));
  const dataYrange = d3.extent(props.data, (d) => d.y);

  const scaleX = d3
    .scaleTime()
    .domain(dataXrange)
    .range([left, width - right]);

  const scaleY = d3
    .scaleLinear()
    .domain(dataYrange)
    .range([height - top, bottom]);

  const scaleLabel = d3
    .scaleQuantile()
    .domain(props.data.map((d) => d.x))
    .range(props.data.map((d) => d.y));

  const line = d3
    .line()
    .x((d) => scaleX(d.x))
    .y((d) => scaleY(d.y))
    .curve(d3.curveBasis)(props.data);

  const properties = path.svgPathProperties(line);
  const totalLength = properties.getTotalLength();

  const translateX = x.interpolate({
    inputRange: [0, totalLength],
    outputRange: [width - 100, 0],
    extrapolate: 'clamp',
  });

  useCode(() => {
    return call(
      [x],
      ([value]) => {
        const { x: left, y: top } = properties.getPointAtLength(
          totalLength - value,
        );

        cursor.current.setNativeProps({ top: top - 10, left: left - 10 });
        const text = scaleLabel(scaleX.invert(left));
        label.current.setNativeProps({ top: top - 10, text: `${text} CHF` });
      },
      [x],
    );
  });

  return (
    <View style={{ width, height }}>
      <Svg {...{ width, height }}>
        <Path d={line} fill="none" stroke="rgb(125,240,50)" strokeWidth={3} />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[
            { backgroundColor: 'lightgray', width: 100 },
            { transform: [{ translateX }, { translateY: -20 }] },
          ]}>
          <TextInput underlineColorAndroid="transparent" ref={label} />
        </Animated.View>
      </View>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.cursor} ref={cursor} />
      </View>
      <Animated.ScrollView
        style={StyleSheet.absoluteFill}
        contentContainerStyle={{ width: totalLength * 2 }}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScrollEvent}
        horizontal
      />
    </View>
  );
}

Chart.defaultProps = {
  data: [],
  contentInset: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  },
};

export default Chart;
