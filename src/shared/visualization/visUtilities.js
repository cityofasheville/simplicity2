import React from 'react';
import { Mark } from 'semiotic-mark';
import { colorSchemes } from './colorSchemes';


export const labelOrder = (formattedData, valueAccessor = 'value') => JSON.parse(JSON.stringify(formattedData))
  .filter((item, pos, thisArray) =>
    // Limit it to just the first occurrence
    pos === thisArray.findIndex(d => d.label === item.label && d.color === item.color)
  ).map((item) => {
    item.sum = formattedData
      .filter(d => d.label === item.label)
      .reduce((total, num) => {
        const returnObj = {};
        returnObj[valueAccessor] = total[valueAccessor] + num.value;
        return returnObj;
      });
    return item;
  }).sort((a, b) => b.sum[valueAccessor] - a.sum[valueAccessor]);

export const formatDataForStackedBar = (data, dataKeys, mainAxisDataKey, colorScheme) => {
  const keySums = {};
  for (let key of dataKeys) {
    keySums[key] = 0;
  }
  const formatted = data.map(item => {
    keySums[item.label] += item.value;
    return Object.assign({}, item, { color: '#dedede' });
  });
  console.log(formatted);
  return formatted;

  // const formattedData = dataKeys.map((k, kIndex) => {
  //   const thisData = data.map((d) => {
  //     const rVal = {};
  //     // rVal[mainAxisDataKey] = d[mainAxisDataKey];
  //     // rVal.label = k || '[error]';
  //     // rVal.value = d[k] ? d[k] : 0;
  //     const thisScheme = colorSchemes[colorScheme];
  //     if (d.label === k) {
  //       return Object.assign({}, d, { color: thisScheme[kIndex % thisScheme.length] });
  //     }
  //     //d.color = thisScheme[kIndex % thisScheme.length];
  //     //return d;
  //     // rVal.color = thisScheme[kIndex % thisScheme.length];
  //     // return rVal;
  //   });
  //   console.log(thisData);
  //   const sum = thisData.reduce((total, num) => {
  //     const innerReturnObj = {};
  //     innerReturnObj.value = total.value + num.value;
  //     return innerReturnObj;
  //   }).value
  //   return {data: thisData, sum}
  // }).sort((a, b) => b.sum - a.sum)
  // .map(d => d.data)
  // .reduce((p, c) => p.concat(c))
  // return formattedData;
};

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

export const budgetBarAnnotationRule = (d, layout = 'vertical') => {
  // For svgAnnotationRules of bar budget
  let returnMarkX = d.screenCoordinates[0] + (layout === 'horizontal' ? 10 : 0);
  const allAnnotations = d.annotationLayer.annotations;
  const indexOfFirstLabelOccurrence = allAnnotations.findIndex(annotation => annotation.label === d.d.label);
  const labelMatches = allAnnotations.filter(annotation => annotation.label === d.d.label);

  if (indexOfFirstLabelOccurrence === d.i && labelMatches.length > 1) {
    // If it's the first occurence of that label and there's another one, return nothing
    return;
  } else if ((d.i - indexOfFirstLabelOccurrence) + 1 === labelMatches.length) {
    // If two contiguous annotations are the same, average their x value and display one
    // Offset to left is equal to (distance between two labels / 2) * (labelMatches.length - 1)
    const categoryVals = Object.values(d.categories);
    returnMarkX -= ((categoryVals[1].x - categoryVals[0].x) / 2) * (labelMatches.length - 1);
  }

  return <Mark
    markType="text"
    key={`${d.d.label || 'Unknown'}-annotationtext${d.i}`}
    forceUpdate
    x={returnMarkX}
    y={5}
    className={`annotation annotation-or-label ${d.d.className || ''}`}
    textAnchor="middle"
  >
    {d.d.label}
  </Mark>;
};
