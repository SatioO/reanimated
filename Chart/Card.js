import React from 'react';
import { Dimensions, Text, View, StyleSheet } from 'react-native';
import Animated, {
  Value,
  cond,
  event,
  block,
  stopClock,
  startClock,
  Clock,
  eq,
  and,
  set,
  interpolate,
  concat,
  spring,
} from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

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
    padding: 10,
    backgroundColor: '#8C04FF',
    backfaceVisibility: 'hidden',
  },
});

function Bars() {
  const state = new Value(State.UNDETERMINED);
  const onGestureEvent = event([{ nativeEvent: { state } }]);

  const clock = new Clock();
  const animation = runSpring(clock, state);
  const rotateYAsDeg = interpolate(animation, {
    inputRange: [0, 1],
    outputRange: [0, -180],
  });

  const rotateY = concat(rotateYAsDeg, 'deg');

  return (
    <View style={{ margin: 10 }}>
      <TapGestureHandler onHandlerStateChange={onGestureEvent}>
        <Animated.View>
          <Animated.View
            style={[
              {
                ...StyleSheet.absoluteFillObject,
                backfaceVisibility: 'hidden',
                transform: [
                  { perspective: 800 },
                  { rotateY: '180deg' },
                  { rotateY },
                ],
              },
              styles.card,
              styles.shadow,
            ]}>
            <Text style={{ color: '#FFF', fontSize: 16 }}>Back</Text>
          </Animated.View>
          <Animated.View
            style={[
              {
                transform: [{ perspective: 800 }, { rotateY }],
              },
              styles.card,
              styles.shadow,
            ]}></Animated.View>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
}

const runSpring = (clock, gestureState) => {
  const state = {
    finished: new Value(1),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    stiffness: new Value(60.06),
    mass: new Value(1),
    damping: new Value(10),
    overshootClamping: false,
    restSpeedThreshold: 0.01,
    restDisplacementThreshold: 0.1,
    toValue: new Value(0),
  };

  return block([
    cond(and(eq(gestureState, State.BEGAN), eq(state.position, 0)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.velocity, 0),
      set(config.toValue, 1),
      startClock(clock),
    ]),
    cond(and(eq(gestureState, State.BEGAN), eq(state.position, 1)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(config.toValue, 0),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
};

export default Bars;
