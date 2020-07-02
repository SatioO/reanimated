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
  { x: new Date('1/1/2020'), y: 6000 },
  { x: new Date('2/1/2020'), y: 4000 },
  { x: new Date('3/1/2020'), y: 5645 },
  { x: new Date('4/1/2020'), y: 4700 },
  { x: new Date('5/1/2020'), y: 6900 },
  { x: new Date('6/1/2020'), y: 4356 },
  { x: new Date('7/1/2020'), y: 3289 },
  { x: new Date('8/1/2020'), y: 6300 },
  { x: new Date('9/1/2020'), y: 3200 },
  { x: new Date('10/1/2020'), y: 6500 },
  { x: new Date('11/1/2020'), y: 4300 },
  { x: new Date('12/1/2020'), y: 6900 },
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
