import React, { useState } from 'react';
import styles from './styles';
import { View, ScrollView, Text } from 'react-native';
import { months, spacing } from './utils';

export default function Intervals(props) {
  const [selected] = useState(0);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {props.data.map((month, index) => {
        return (
          <View
            key={month.x}
            style={{
              width: spacing * 3,
              height: spacing * 2,
              padding: 4,
              borderRadius: spacing / 2,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: selected === index && 'rgba(1,87,155, 0.5)',
            }}>
            <Text
              style={[
                styles.text,
                { color: selected === index ? '#FFF' : '#888' },
              ]}>
              {months[month.x.getMonth()]}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
