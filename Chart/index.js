import React, { useState, useCallback } from 'react';
import { Dimensions, View, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
          <View style={{ flex: 1, flexDirection: 'row', padding: 14 }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#333' }}>
                Balance
              </Text>
              <Text
                style={{ fontSize: 36, fontWeight: '700', color: '#cc0066' }}>
                $ {balance.toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                left: width - 80,
                top: 14,
              }}>
              <Svg viewBox="0 0 1024 1024" width={48} height={48}>
                <Path
                  d="M512 166.4c-70.4 0-134.4 19.2-192 57.6L294.4 185.6C281.6 166.4 256 172.8 249.6 192L204.8 332.8C204.8 345.6 217.6 364.8 230.4 364.8l147.2-6.4c19.2 0 32-25.6 19.2-38.4L364.8 281.6l0 0 0-6.4C403.2 243.2 460.8 230.4 512 230.4c153.6 0 281.6 128 281.6 281.6s-128 281.6-281.6 281.6-281.6-128-281.6-281.6c0-19.2-12.8-32-32-32S166.4 492.8 166.4 512c0 192 153.6 345.6 345.6 345.6S857.6 704 857.6 512 704 166.4 512 166.4z"
                  fill="#ddd"
                />
              </Svg>
            </View>
          </View>
          <AreaChart {...props} onValue={onValue} />
        </View>
      </View>
    </View>
  );
}

export default Chart;
