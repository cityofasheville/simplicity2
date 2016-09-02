export default function sagaSelector(state, path) {
  return path.reduce((prev, cur) => prev[cur], state);
}
