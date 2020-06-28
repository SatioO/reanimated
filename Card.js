// @flow
import * as React from 'react';
import { StyleSheet, Dimensions, Button, View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { concat, Value, Easing } from 'react-native-reanimated';
import { scaleTime } from 'd3';
import * as d3 from 'd3';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import * as array from 'd3-array';

export const cardWidth = Dimensions.get('window').width;
export const cardHeight = 250;
export const cardTitle = 45;
export const cardPadding = 10;

const AnimatedPath = Animated.createAnimatedComponent(Path);

const getDomain = (values) => {
  return [Math.min(...values), Math.max(...values)];
};

export default (props) => {
  return (
    <View style={{ marginTop: 50 }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ rotateY: 79 }],
        }}>
        <View
          style={{
            height: 200,
            width: cardWidth - 20,
            backgroundColor: '#FFF',
            zIndex: 999,
            shadowColor: '#333',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            backgroundColor: '#fff',
            shadowOpacity: 0.45,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <Text>hello</Text>
        </View>
      </View>
    </View>
  );
};
