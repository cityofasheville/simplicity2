import { colorSchemes } from './colorSchemes';


export const formatDataForStackedBar = (data, dataKeys, mainAxisDataKey, colorScheme) =>
  dataKeys.map((k, kIndex) => data.map((d) => {
    const rVal = {};
    rVal[mainAxisDataKey] = d[mainAxisDataKey];
    rVal.label = k || '[error]';
    rVal.value = d[k] ? d[k] : 0;
    const thisScheme = colorSchemes[colorScheme];
    rVal.color = thisScheme[kIndex % thisScheme.length];
    return rVal;
  })).reduce((p, c) => p.concat(c));

export const formatDataForStackedArea = (data, dataKeys, mainAxisDataKey, colorScheme) => {
  const thisScheme = colorSchemes[colorScheme];
  return dataKeys.map((k, kIndex) =>
    ({
      label: k || '[error]',
      color: thisScheme[kIndex % thisScheme.length],
      coordinates: data.map((d) => {
        const rVal = {};
        rVal[mainAxisDataKey] = d[mainAxisDataKey];
        rVal.label = k;
        rVal.value = d[k] ? d[k] : 0;
        return rVal;
      }),
    })
  );
};
