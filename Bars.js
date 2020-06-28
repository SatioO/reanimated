import React from 'react';
import { Dimensions, Text, View, Image, StyleSheet } from 'react-native';
import Animated, {
  Value,
  cond,
  event,
  Easing,
  block,
  timing,
  stopClock,
  startClock,
  Clock,
  eq,
  and,
  neq,
  set,
  interpolate,
  spring,
  concat,
} from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

const todos = [
  { id: 0, task: 'IKEA' },
  { id: 1, task: 'Transfer to Anna' },
  { id: 2, task: 'Loan to Sanchez' },
  { id: 3, task: 'Florent Restraunt' },
];

const width = Dimensions.get('window').width;

function Bars() {
  const state = new Value(State.UNDETERMINED);
  const onGestureEvent = event([{ nativeEvent: { state } }]);

  const opClock = new Clock();
  const opacity = runOpacityTimer(opClock, state);
  const backOpacity = Platform.OS === 'android' ? cond(opacity, 0, 1) : 1;
  const rotateYAsDeg = interpolate(opacity, {
    inputRange: [0, 1],
    outputRange: [0, -180],
  });
  const rotateY = concat(rotateYAsDeg, 'deg');

  return (
    <View style={{ margin: 10 }}>
      <TapGestureHandler onHandlerStateChange={onGestureEvent}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            height: 200,
            width: width - 20,
            backgroundColor: '#FFF',
            opacity: backOpacity,
            backfaceVisibility: 'hidden',
            transform: [
              { perspective: 800 },
              { rotateY: '180deg' },
              { rotateY },
            ],
          }}>
          <Text style={{ color: '#333', fontSize: 72 }}>Hello</Text>
        </Animated.View>
      </TapGestureHandler>
      <TapGestureHandler onHandlerStateChange={onGestureEvent}>
        <Animated.View
          style={{
            height: 200,
            width: width - 20,
            backgroundColor: '#FFF',
            backfaceVisibility: 'hidden',
            transform: [{ perspective: 800 }, { rotateY }],
          }}></Animated.View>
      </TapGestureHandler>
    </View>
  );
}

const runOpacityTimer = (clock, gestureState) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(-1),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(and(eq(gestureState, State.BEGAN), neq(config.toValue, 1)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 1),
      startClock(clock),
    ]),
    cond(and(eq(gestureState, State.BEGAN), eq(state.position, 1)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 0),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
};

function runPinchTimer(clock, gestureState) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 500,
    toValue: new Value(-1),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(and(eq(gestureState, State.BEGAN), neq(config.toValue, 1)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 1),
      startClock(clock),
    ]),
    cond(and(eq(gestureState, State.END), neq(config.toValue, 0)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 0),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
}

const runSpring = (clock, gestureState) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    velocity: new Value(0),
  };

  const config = {
    stiffness: new Value(100),
    mass: new Value(1),
    damping: new Value(10),
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
    bounciness: 10,
    friction: new Value(4),
  };

  return block([
    cond(and(eq(gestureState, State.BEGAN), eq(config.toValue, 0)), [
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
