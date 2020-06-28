import * as React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import * as d3 from 'd3';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import * as array from 'd3-array';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const height = 300;
const padding = 10;

const AnimatedPath = Animated.createAnimatedComponent(Path);

function calcIndexes(data) {
  return data.map((_, index) => index);
}

function calcXScale(domain) {
  return scale
    .scaleBand()
    .domain(domain)
    .range([padding, width - padding])
    .padding([0.2]);
}

function calcYScale(domain) {
  return scale
    .scaleLinear()
    .domain(domain)
    .range([height - padding, padding])
    .clamp(true);
}

function calcExtent(values) {
  return array.extent(values);
}

function calcAreas(data, x, y) {
  return data.map((bar, index) => ({
    bar,
    path: shape
      .area()
      .y0(y(0))
      .y1((value) => y(value))
      .x((_, _i) => (_i === 0 ? x(index) : x(index) + x.bandwidth()))
      .defined((value) => typeof value === 'number')([
      data[index],
      data[index],
    ]),
  }));
}

function invertBand(value, x) {
  const domain = x.domain();
  const range = x.range();
  const scale = d3.scaleQuantize().domain(range).range(domain);
  return scale(value);
}

export default ({ data }) => {
  const xDomain = calcIndexes(data);
  const yDomain = calcExtent(data);

  const x = calcXScale(xDomain);
  const y = calcYScale(yDomain);

  const areas = calcAreas(data, x, y).filter((item) => !!item.path);

  function onBarPress(index) {
    console.log(invertBand(30 * index, x));
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Svg
          style={{
            height,
            width,
            borderWidth: 1,
            borderColor: '#333',
            backgroundColor: '#fafafa',
          }}>
          {areas.map((area, index) => {
            return (
              <AnimatedPath
                key={index}
                d={area.path}
                fill={'rgb(134, 65, 244)'}
                onPress={() => onBarPress(index)}
              />
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
});
