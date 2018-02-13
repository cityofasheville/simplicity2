/**
 * Merges two functions whose purposes are to create props objects. Any props of a function type will be merged into
 * a new function that calls both original functions.
 *
 * @param getBaseProps the base props function to merge onto.
 * @param getAdditionalProps the props function to merge from.
 * @returns {function(...[*])} a new function that create a merged set of props.
 */
export default function mergeProps(getBaseProps, getAdditionalProps) {
  if (getBaseProps && !getAdditionalProps) {
    return getBaseProps;
  } else if (!getBaseProps && getAdditionalProps) {
    return getAdditionalProps;
  }
  return (...args) => mergeObjects(getBaseProps(...args), getAdditionalProps(...args));
}

function mergeObjects(obj1, obj2) {
  const obj3 = Object.assign({}, obj1, obj2);
  // Merge functions that are present in both objects
  Object.keys(obj3).forEach((key) => {
    if (isFunction(obj3[key]) && obj1[key] && obj2[key]) {
      obj3[key] = mergeFunctions(obj1[key], obj2[key]);
    }
  });
  return obj3;
}

function isFunction(functionToCheck) {
  const getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function mergeFunctions(func1, func2) {
  return (...args) => {
    func1(...args);
    func2(...args);
  };
}
