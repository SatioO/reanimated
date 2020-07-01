import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  sub,
  cond,
  eq,
  add,
  set,
  call,
  interpolate,
  Extrapolate,
  useCode,
  and,
  debug,
  block,
} from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import {
  clamp,
  parsePath,
  getPointAtLength,
  useValue,
  onGestureEvent,
  withDecay,
} from 'react-native-redash';
import getLengthAtX from './cubic';

const CIRCLE_RADIUS = 12;

export default function Cursor(props) {
  const offsetX = useValue(0);
  const translationX = useValue(0);
  const velocityX = useValue(0);
  const f = useValue(0);
  const state = useValue(State.UNDETERMINED);

  const gestureHandler = onGestureEvent({
    translationX,
    state,
    velocityX,
  });

  const transX = cond(
    eq(state, State.ACTIVE),
    add(offsetX, translationX),
    set(offsetX, add(offsetX, translationX)),
  );

  const dx = clamp(
    withDecay({
      state,
      velocity: velocityX,
      value: transX,
    }),
    0,
    props.width - 20,
  );

  const path = parsePath(props.d);
  const length = interpolate(dx, {
    inputRange: [0, props.width - 20],
    outputRange: [0, path.totalLength],
    extrapolate: Extrapolate.CLAMP,
  });

  const { y: ty, x: tx } = getPointAtLength(path, length);
  const ls = getLengthAtX(path, props.scaleX(new Date('3/1/2020')));

  const lsI = interpolate(ls, {
    inputRange: [0, path.totalLength],
    outputRange: [0, props.width - 20],
    extrapolate: Extrapolate.CLAMP,
  });

  useCode(
    () =>
      block([
        cond(eq(state, State.UNDETERMINED), set(offsetX, lsI)),
        cond(and(eq(state, State.END), eq(f, 0)), [
          set(offsetX, 0),
          set(eq(1)),
        ]),
      ]),
    [state],
  );

  useCode(() => call([ty], ([y]) => props.onValue(y), [ty]));

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFill,
          height: props.height,
          width: props.width - 20,
        }}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            width: CIRCLE_RADIUS * 2,
            height: CIRCLE_RADIUS * 2,
            borderRadius: CIRCLE_RADIUS * 2,
            backgroundColor: '#FFF',
            transform: [
              { translateX: sub(tx, CIRCLE_RADIUS) },
              { translateY: sub(ty, CIRCLE_RADIUS) },
            ],
          }}
        />
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            width: CIRCLE_RADIUS,
            height: CIRCLE_RADIUS,
            borderRadius: CIRCLE_RADIUS,
            backgroundColor: '#ED06FE',
            transform: [
              { translateX: sub(tx, CIRCLE_RADIUS / 2) },
              { translateY: sub(ty, CIRCLE_RADIUS / 2) },
            ],
          }}
        />
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            width: 68,
            height: props.height - 20,
            backgroundColor: 'rgba(221, 221, 221, 0.3)',
            transform: [{ translateX: sub(tx, 34) }, { translateY: 20 }],
          }}
        />
      </Animated.View>
    </PanGestureHandler>
  );
}
