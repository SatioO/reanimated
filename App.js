import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Chart from './Chart';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
});

// const data = [50, 10, 40, 95, -4, -24, 85, 0, 35, 53, -53, 24, 50, -20, -80];
const data = [
  { date: new Date(2020, 0, 1), value: 69 },
  { date: new Date(2020, 1, 1), value: 60 },
  { date: new Date(2020, 2, 1), value: 40 },
  { date: new Date(2020, 3, 1), value: 65 },
  { date: new Date(2020, 4, 1), value: 47 },
  { date: new Date(2020, 5, 1), value: 69 },
  { date: new Date(2020, 6, 1), value: 36 },
  { date: new Date(2020, 7, 1), value: 100 },
  { date: new Date(2020, 8, 1), value: 63 },
  { date: new Date(2020, 9, 1), value: 32 },
  { date: new Date(2020, 10, 1), value: 65 },
  { date: new Date(2020, 11, 1), value: 43 },
];

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Chart {...{ data }} />
      </View>
    </SafeAreaView>
  );
};

export default App;
