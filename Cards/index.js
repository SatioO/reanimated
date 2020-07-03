import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useCode,
  call,
  cond,
  eq,
  set,
  add,
  block,
} from 'react-native-reanimated';
import {
  usePanGestureHandler,
  withDecay,
  clamp,
  withOffset,
  snapPoint,
  useValue,
  timing,
  useClock,
} from 'react-native-redash';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const width = Dimensions.get('window').width;
const colors = ['red', 'blue', 'green', 'purple', 'orange'];

const styles = StyleSheet.create({
  container: {
    width: width * colors.length,
    height: 300,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    width: width,
    height: 150,
  },
  shadow: {
    shadowColor: '#777',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.45,
    shadowRadius: 6.84,
    elevation: 5,
  },
});

const points = colors.map((_, i) => -width * i);

const Card = (props) => {
  // useCode(() =>
  //   call(
  //     [props.state],
  //     ([value]) => {
  //       console.log(value);
  //     },
  //     [props.state],
  //   ),
  // );

  return (
    <View
      style={[
        styles.card,
        styles.shadow,
        {
          backgroundColor: props.color,
        },
      ]}></View>
  );
};

function Cards(props) {
  const translateX = useValue(0);
  const offsetX = useValue(0);
  const clock = useClock();
  const {
    translation,
    state,
    gestureHandler,
    velocity,
  } = usePanGestureHandler();

  const to = snapPoint(translateX, velocity.x, points);

  // useCode(() =>
  //   call(
  //     [translateX],
  //     ([value]) => {
  //       console.log(value);
  //     },
  //     [translateX],
  //   ),
  // );

  useCode(
    () =>
      block([
        cond(eq(state, State.ACTIVE), [
          set(translateX, add(offsetX, translation.x)),
        ]),
        cond(eq(state, State.END), [
          set(translateX, timing({ clock, from: translateX, to })),
          set(offsetX, translateX),
        ]),
      ]),
    [],
  );

  return (
    <PanGestureHandler minDist={0} {...gestureHandler}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[styles.container, { transform: [{ translateX }] }]}>
          {colors.map((color, index) => {
            return <Card key={index} color={color} />;
          })}
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
}

export default Cards;
