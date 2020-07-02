import React, { useState } from 'react';
import styles from './styles';
import { View, Text } from 'react-native';

export default function IntervalOptions(props) {
  const [interval] = useState(props.data[0]);
  return (
    <View style={[styles.shadow, styles.dropdown]}>
      <Text style={styles.text}>{interval}</Text>
    </View>
  );
}
