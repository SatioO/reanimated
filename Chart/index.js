import React, { useState, useCallback } from 'react';
import { Dimensions, View, StyleSheet, Text } from 'react-native';
import AreaChart from './AreaChart';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    height: 200,
    width: width - 20,
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
});

function Chart(props) {
  const [balance, setBalance] = useState(0);

  const onValue = useCallback((value) => {
    setBalance(value);
  }, []);

  return (
    <View style={{ margin: 10 }}>
      <View style={[styles.card, styles.shadow]}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 14 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#333' }}>
              Balance
            </Text>
            <Text style={{ fontSize: 36, fontWeight: '700', color: '#cc0066' }}>
              $ {balance.toFixed(2)}
            </Text>
          </View>
          <AreaChart {...props} onValue={onValue} />
        </View>
      </View>
    </View>
  );
}

export default Chart;
