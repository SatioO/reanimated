import React from 'react';
import { Dimensions, View, StyleSheet, Text as RNText } from 'react-native';
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
  sub,
  set,
  interpolate,
  concat,
  spring,
  Extrapolate,
  Easing,
  neq,
  timing,
  add,
} from 'react-native-reanimated';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text,
  Rect,
  Circle,
} from 'react-native-svg';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import * as d3 from 'd3';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import * as array from 'd3-array';
import {
  interpolatePath,
  parsePath,
  getPointAtLength,
  onGestureEvent,
  clamp,
  withDecay,
} from 'react-native-redash';

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

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const width = Dimensions.get('window').width;
const height = 140;

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
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
  },
});

function Chart(props) {
  const state = new Value(State.UNDETERMINED);
  // const onGestureEvent = event([{ nativeEvent: { state } }]);
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

  // const clock = new Clock();
  // const chartClock = new Clock();
  // const animation = runSpring(clock, state);
  // const chart = runTimer(chartClock, state);

  // const rotateYAsDeg = interpolate(animation, {
  //   inputRange: [0, 1],
  //   outputRange: [0, -180],
  // });
  // const rotateY = concat(rotateYAsDeg, 'deg');

  const x = d3
    .scaleTime()
    .domain([new Date('1/1/2020'), new Date('12/1/2020')])
    .range([0, width - 20])
    .nice();

  const y = d3
    .scaleLinear()
    .domain(array.extent(props.data.map((d) => d.value)))
    .range([height, 0])
    .clamp(true);

  const line = d3
    .line()
    .curve(d3.curveBundle)
    .x((d) => x(d.date))
    .y((d) => y(d.value));

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
    10,
    width - 20,
  );

  const parsedPath = parsePath(line(props.data));

  const lineLength = interpolate(dx, {
    inputRange: [0, width - 20],
    outputRange: [0, parsedPath.totalLength],
    extrapolate: Extrapolate.CLAMP,
  });

  const { x: cx, y: cy } = getPointAtLength(parsedPath, lineLength);
  const translateX = sub(cx, 14 / 2);
  const translateY = sub(cy, 0);

  return (
    <View style={{ margin: 10 }}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View>
          <Animated.View
            style={[
              {
                ...StyleSheet.absoluteFillObject,
                backfaceVisibility: 'hidden',
                // transform: [
                //   { perspective: 800 },
                //   { rotateY: '180deg' },
                //   { rotateY },
                // ],
              },
              styles.card,
              styles.shadow,
            ]}></Animated.View>
          <Animated.View
            style={[
              // {
              //   transform: [{ perspective: 800 }, { rotateY }],
              // },
              styles.card,
              styles.shadow,
            ]}>
            <View style={{ flex: 2 }}>
              <View style={{ flex: 1, padding: 14 }}>
                <RNText
                  style={{ fontSize: 14, fontWeight: '500', color: '#333' }}>
                  Balance
                </RNText>
                <RNText
                  style={{ fontSize: 36, fontWeight: '700', color: '#cc0066' }}>
                  $ 2,300.00
                </RNText>
              </View>
              <View
                style={{
                  flex: 2,
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}>
                <Svg
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
                  <AnimatedCircle
                    cx={translateX}
                    cy={translateY}
                    r="14"
                    fill="#FFF"
                  />
                  <AnimatedCircle
                    cx={translateX}
                    cy={translateY}
                    r="8"
                    fill="#ED06FE"
                    style={styles.shadow}
                  />
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
                </Svg>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
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

const runTimer = (clock, gestureState) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 500,
    toValue: new Value(-1),
    easing: Easing.ease,
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

export default Chart;
