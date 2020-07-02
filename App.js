import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Chart from './Chart';
import ScrollableChart from './ScrollableChart';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FaFaFa',
  },
});

const data = [
  { date: new Date('1/1/2020'), value: 6000 },
  { date: new Date('2/1/2020'), value: 4000 },
  { date: new Date('3/1/2020'), value: 5645 },
  { date: new Date('4/1/2020'), value: 4700 },
  { date: new Date('5/1/2020'), value: 6900 },
  { date: new Date('6/1/2020'), value: 4356 },
  { date: new Date('7/1/2020'), value: 3289 },
  { date: new Date('8/1/2020'), value: 6300 },
  { date: new Date('9/1/2020'), value: 3200 },
  { date: new Date('10/1/2020'), value: 6500 },
  { date: new Date('11/1/2020'), value: 4300 },
  { date: new Date('12/1/2020'), value: 6900 },
];

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollableChart {...{ data }} />
      </View>
    </SafeAreaView>
  );
};

export default App;
