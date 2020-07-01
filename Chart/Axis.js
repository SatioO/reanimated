import * as d3 from 'd3';
import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useValue } from 'react-native-redash';
import Animated, { Easing } from 'react-native-reanimated';

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
export default function XAxis(props) {
  const translateY = useValue(0);

  const ticks = props.scaleX
    .range([8, props.width - 8])
    .ticks(d3.timeMonth.every(2));

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          flexDirection: 'row',
          transform: [
            {
              translateY: translateY.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}>
      {ticks.map((tick) => {
        return (
          <Text
            style={{
              ...StyleSheet.absoluteFill,
              top: props.height - 20,
              left: props.scaleX(tick),
              color: '#FFF',
              fontSize: 12,
            }}
            key={tick}>
            {months[tick.getMonth()]}
          </Text>
        );
      })}
    </Animated.View>
  );
}
