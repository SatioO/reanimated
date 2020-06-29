import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text,
  Rect,
  Circle,
} from 'react-native-svg';
import Animated, {
  cond,
  eq,
  sub,
  set,
  interpolate,
  concat,
  Extrapolate,
  add,
  useCode,
  call,
} from 'react-native-reanimated';
import {
  interpolatePath,
  parsePath,
  getPointAtLength,
  onGestureEvent,
  clamp,
  withDecay,
} from 'react-native-redash';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import * as d3 from 'd3';
import * as array from 'd3-array';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const width = Dimensions.get('window').width;
const height = 140;

const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

export default memo((props) => {
  const animation = React.useRef(new Animated.Value(0));
  const dragX = React.useRef(new Animated.Value(0));
  const offsetX = React.useRef(new Animated.Value(0));
  const velocityX = React.useRef(new Animated.Value(0));
  const gestureState = React.useRef(new Animated.Value(State.UNDETERMINED));
  const gestureHandler = onGestureEvent({
    translationX: dragX.current,
    state: gestureState.current,
    velocityX: velocityX.current,
  });

  const x = d3
    .scaleTime()
    .domain([new Date('1/1/2020'), new Date('12/1/2020')])
    .range([0, width - 20])
    .nice();

  const y = d3
    .scaleLinear()
    .domain([
      Math.min(...props.data.map((d) => d.value)),
      Math.max(...props.data.map((d) => d.value)),
    ])
    .range([height - 24, 24])
    .clamp(true);

  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value))
    .curve(d3.curveNatural);

  const ticks = d3
    .scaleTime()
    .domain(array.extent(props.data.map((d) => d.date)))
    .range([16, width - 36]);

  const d = interpolatePath(animation.current, {
    inputRange: [0, width - 20],
    outputRange: [
      line(
        props.data.map((item) => ({
          date: item.date,
          value: item.value,
        })),
      ),
      line(props.data),
    ],
    extrapolate: Extrapolate.CLAMP,
  });

  const transX = cond(
    eq(gestureState.current, State.ACTIVE),
    add(offsetX.current, dragX.current),
    set(offsetX.current, add(offsetX.current, dragX.current)),
  );

  const dx = clamp(
    withDecay({
      state: gestureState.current,
      velocity: velocityX.current,
      value: transX,
    }),
    0,
    width - 20,
  );

  const parsedPath = parsePath(line(props.data));

  const lineLength = interpolate(dx, {
    inputRange: [0, width - 20],
    outputRange: [0, parsedPath.totalLength],
    extrapolate: Extrapolate.CLAMP,
  });

  const { x: cx, y: cy } = getPointAtLength(parsedPath, lineLength);
  const translateX = sub(cx, 0);
  const translateY = sub(cy, 0);

  useCode(() =>
    call(
      [translateY],
      ([value]) => {
        props.onValue(y.invert(value));
      },
      [translateY],
    ),
  );

  return (
    <PanGestureHandler {...gestureHandler} minPointers={1} maxPointers={1}>
      <AnimatedSvg
        style={{
          height,
          width: width - 20,
        }}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#8C04FF" stopOpacity="1" />
            <Stop offset="1" stopColor="#ED06FE" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <AnimatedPath
          d={concat(d, `L${width - 20}, ${height} L0 ${height} Z`)}
          stroke={'none'}
          fill="url(#grad)"
        />
        <AnimatedRect
          x={sub(translateX, 36)}
          y={20}
          width="72"
          height={140}
          fill="rgb(221, 221, 221, 0.3)"
        />
        <AnimatedCircle cx={translateX} cy={translateY} r="14" fill="#FFF" />
        <AnimatedCircle cx={translateX} cy={translateY} r="8" fill="#ED06FE" />
        {ticks.ticks(d3.timeMonth.every(2)).map((tick, index) => {
          return (
            <Text
              textAnchor={'middle'}
              originX={x(tick)}
              alignmentBaseline={'hanging'}
              x={ticks(tick)}
              y={120}
              fontSize={12}
              fill="#FFF"
              key={index}>
              {months[tick.getMonth()]}
            </Text>
          );
        })}
      </AnimatedSvg>
    </PanGestureHandler>
  );
});
