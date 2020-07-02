import React, { Fragment } from 'react';
import styles from './styles';
import { View } from 'react-native';
import { intervals, spacing, width, height } from './utils';
import Intervals from './Intervals';
import IntervalOptions from './IntervalOptions';
import Chart from './Chart';

function ScrollableChart(props) {
  return (
    <Fragment>
      <View style={styles.header}>
        <IntervalOptions data={intervals} />
        <Intervals data={props.data} />
      </View>
      <View style={{ width, height }}>
        <Chart data={props.data} />
      </View>
    </Fragment>
  );
}

export default ScrollableChart;
