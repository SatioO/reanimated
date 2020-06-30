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
} from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import {
  parsePath,
  getPointAtLength,
  onGestureEvent,
  clamp,
  withDecay,
  useValue,
} from 'react-native-redash';

export default function Cursor(props) {
  const offsetX = useValue(0);
  const dragX = useValue(0);
  const velocityX = useValue(0);
  const state = useValue(State.UNDETERMINED);

  const gestureHandler = onGestureEvent({
    translationX: dragX,
    state,
    velocityX: velocityX,
  });

  const transX = cond(
    eq(state, State.ACTIVE),
    add(offsetX, dragX),
    set(offsetX, add(offsetX, dragX)),
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

  const parsedPath = parsePath(props.path);

  const lineLength = interpolate(dx, {
    inputRange: [0, props.width - 20],
    outputRange: [0, parsedPath.totalLength],
    extrapolate: Extrapolate.CLAMP,
  });

  const { x: tx, y: ty } = getPointAtLength(parsedPath, lineLength);

  useCode(() =>
    call(
      [tx, ty],
      ([_, yc]) => {
        props.onValue(yc);
      },
      [tx, ty],
    ),
  );

  return (
    <PanGestureHandler {...gestureHandler} minPointers={1} maxPointers={1}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFill,
          height: props.height,
          width: props.width - 20,
        }}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            width: 24,
            height: 24,
            borderRadius: 24,
            backgroundColor: '#FFF',
            transform: [
              { translateX: sub(tx, 12) },
              { translateY: sub(ty, 12) },
            ],
          }}
        />
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            width: 12,
            height: 12,
            borderRadius: 12,
            backgroundColor: '#ED06FE',
            transform: [{ translateX: sub(tx, 6) }, { translateY: sub(ty, 6) }],
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
