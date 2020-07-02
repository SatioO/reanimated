import React from 'react';
import styles from './styles';
import { View } from 'react-native';
import { intervals, spacing, width } from './utils';
import Intervals from './Intervals';
import IntervalOptions from './IntervalOptions';

function ScrollableChart(props) {
  return (
    <View>
      <View style={styles.header}>
        <Intervals data={props.data} />
        <IntervalOptions data={intervals} />
      </View>
      <View style={{ width, height: 400, margin: spacing }}>
        {/* <Text>Render</Text> */}
      </View>
    </View>
  );
}

export default ScrollableChart;
