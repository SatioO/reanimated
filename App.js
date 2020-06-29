import React from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import Graph from './BarChart';
import Chart from './Chart';
import Card from './Card';

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
});

// const data = [50, 10, 40, 95, -4, -24, 85, 0, 35, 53, -53, 24, 50, -20, -80];
const data = [
  { date: new Date('1/1/2020'), value: 60 },
  { date: new Date('2/1/2020'), value: 40 },
  { date: new Date('3/1/2020'), value: 65 },
  { date: new Date('4/1/2020'), value: 47 },
  { date: new Date('5/1/2020'), value: 69 },
  { date: new Date('6/1/2020'), value: 36 },
  { date: new Date('7/1/2020'), value: 100 },
  { date: new Date('8/1/2020'), value: 63 },
  { date: new Date('9/1/2020'), value: 32 },
  { date: new Date('10/1/2020'), value: 65 },
  { date: new Date('11/1/2020'), value: 43 },
  { date: new Date('12/1/2020'), value: 69 },
];
const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <Graph {...{ data }} /> */}
        <Chart {...{ data }} />
        {/* <Card color="red" data={data} /> */}
      </View>
    </SafeAreaView>
  );
};

export default App;
