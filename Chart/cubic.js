import Animated from 'react-native-reanimated';

const {
  Value,
  and,
  cond,
  divide,
  add,
  multiply,
  block,
  greaterThan,
  greaterOrEq,
  eq,
  lessThan,
  lessOrEq,
  pow,
  proc,
  abs,
  sqrt,
  set,
  sub,
  cos,
  not,
  acos,
} = Animated;

export const find = (values, fn, notFound = new Value()) =>
  values.reduce((acc, v) => cond(fn(v), v, acc), notFound);

export const approximates = proc((a, b, precision) =>
  lessThan(abs(sub(a, b)), precision),
);
const isRootValidForCubicBezier = (root) =>
  and(greaterThan(root, 0), lessThan(root, 1));

// pomax.github.io/bezierinfo/#extremities
const cuberoot = (v) =>
  cond(
    lessThan(v, 0),
    multiply(pow(multiply(v, -1), 1 / 3), -1),
    pow(v, 1 / 3),
  );

const cubicBezierSolve = (pa, pb, pc, pd) => {
  const a = new Value();
  const b = new Value();
  const c = new Value();
  const d = new Value();
  const root1 = new Value();
  const root2 = new Value();
  const root3 = new Value();

  const q = new Value();
  const q2 = new Value();
  const p = new Value();
  const p3 = new Value();
  const discriminant = new Value();

  const mp3 = new Value();
  const mp33 = new Value();
  const r = new Value();
  const t = new Value();
  const cosphi = new Value();
  const phi = new Value();
  const crtr = new Value();
  const t1 = new Value();

  const u1 = new Value();

  const sd = new Value();
  const v1 = new Value();
  const sq = new Value();

  return block([
    set(a, add(multiply(3, pa), multiply(-6, pb), multiply(3, pc))),
    set(b, add(multiply(-3, pa), multiply(3, pb))),
    set(c, pa),
    set(d, add(multiply(-1, pa), multiply(3, pb), multiply(-3, pc), pd)),
    cond(
      approximates(d, 0, 0.001),
      cond(
        approximates(d, 0, 0.001),
        cond(
          not(approximates(b, 0, 0.001)),
          set(root1, divide(multiply(-1, c), b)),
          [
            set(q, sqrt(sub(pow(b, 2), multiply(4, a, c)))),
            set(root1, divide(sub(q, b), multiply(2, a))),
            set(root2, divide(sub(multiply(b, -1), q), multiply(2, a))),
          ],
        ),
      ),
      [
        set(a, divide(a, d)),
        set(b, divide(b, d)),
        set(c, divide(c, d)),
        set(p, divide(sub(multiply(3, b), multiply(a, a)), 3)),
        set(p3, divide(p, 3)),
        set(
          q,
          divide(
            add(multiply(2, a, a, a), multiply(-9, a, b), multiply(27, c)),
            27,
          ),
        ),
        set(q2, divide(q, 2)),
        set(discriminant, add(multiply(q2, q2), multiply(p3, p3, p3))),
        cond(
          lessThan(discriminant, 0),
          [
            set(mp3, divide(multiply(p, -1), 3)),
            set(mp33, multiply(mp3, mp3, mp3)),
            set(r, sqrt(mp33)),
            set(t, divide(multiply(q, -1), multiply(2, r))),
            set(
              cosphi,
              cond(lessThan(t, -1), -1, cond(greaterThan(t, 1), 1, t)),
            ),
            set(phi, acos(cosphi)),
            set(crtr, cuberoot(r)),
            set(t1, multiply(2, crtr)),
            set(root1, sub(multiply(t1, cos(divide(phi, 3))), divide(a, 3))),
            set(
              root2,
              sub(
                multiply(t1, cos(divide(add(phi, 2 * Math.PI), 3))),
                divide(a, 3),
              ),
            ),
            set(
              root3,
              sub(
                multiply(t1, cos(divide(add(phi, 4 * Math.PI), 3))),
                divide(a, 3),
              ),
            ),
          ],
          cond(
            eq(discriminant, 0),
            [
              set(
                u1,
                cond(
                  lessThan(q2, 0),
                  cuberoot(multiply(q2, -1)),
                  multiply(cuberoot(q2), -1),
                ),
              ),
              set(root1, sub(multiply(2, u1), divide(a, 3))),
              set(root2, sub(multiply(-1, u1), divide(a, 3))),
            ],
            [
              set(sd, sqrt(discriminant)),
              set(u1, cuberoot(sub(sq, q2))),
              set(v1, cuberoot(add(sq, q2))),
              set(root1, sub(u1, v1, divide(a, 3))),
            ],
          ),
        ),
      ],
    ),
    find([root1, root2, root3], isRootValidForCubicBezier),
  ]);
};

const isAdaptable = (value) =>
  typeof value === 'number' ||
  value instanceof Animated.Node ||
  value instanceof Animated.Value;

const get = (vectors, dimension) =>
  vectors.map((vector) => (isAdaptable(vector) ? vector : vector[dimension]));

export default getLengthAtX = (path, x) => {
  const index = path.segments.reduce(
    (acc, p, i) => cond(and(greaterOrEq(x, p.p0x), lessOrEq(x, p.p3x)), i, acc),
    -1,
  );
  const p0 = get(path.p0x, index);
  const p1 = get(path.p1x, index);
  const p2 = get(path.p2x, index);
  const p3 = get(path.p3x, index);
  const t = cubicBezierSolve(p0, p1, p2, p3);
  const length = get(path.length, index);
  const start = add(
    ...path.length.map((l, i) => cond(lessThan(i, index), l, 0)),
  );
  return add(start, multiply(t, length));
};
