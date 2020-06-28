import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
  sub,
  color,
  spring,
  greaterThan,
  clockRunning,
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
  return (
    <Animated.View style={{ margin: 10 }}>
      {todos.map((todo) => {
        return <Bar key={todo.id} {...todo} />;
      })}
    </Animated.View>
  );
}

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const runOpacityTimer = (clock, gestureState) => {
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
    duration: 200,
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

function Bar(todo) {
  const state = new Value(State.UNDETERMINED);
  const onGestureEvent = event([{ nativeEvent: { state } }]);

  const opClock = new Clock();
  const pinClock = new Clock();
  const cardClock = new Clock();
  const opacity = runOpacityTimer(opClock, state);
  const pinch = runPinchTimer(pinClock, state);
  const card = runSpring(cardClock, state);

  return (
    <View
      style={{
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Animated.View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TapGestureHandler onHandlerStateChange={onGestureEvent}>
          <Animated.View
            style={{
              height: 64,
              width: width - 20,
              backgroundColor: '#FFF',
              zIndex: 999,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              backgroundColor: '#fff',
              shadowColor: '#333',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.45,
              shadowRadius: 3.84,
              elevation: 5,
              opacity: interpolate(pinch, {
                inputRange: [0, 1],
                outputRange: [1, 0.6],
              }),
            }}></Animated.View>
        </TapGestureHandler>
        <Animated.View
          style={{
            width: width - 75,
            height: interpolate(card, {
              inputRange: [0, 1],
              outputRange: [0, 200],
            }),
            shadowColor: '#333',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            backgroundColor: '#fff',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            shadowOpacity: 0.45,
            shadowRadius: 3.84,
            elevation: 5,
            backgroundColor: '#FFF',
          }}></Animated.View>
      </Animated.View>
    </View>
  );
}

export default Bars;
