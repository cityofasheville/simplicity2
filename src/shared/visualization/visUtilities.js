import { colorSchemes } from './colorSchemes';


export const formatDataForStackedBar = (data, dataKeys, mainAxisDataKey, colorScheme) => {
  return dataKeys.map((k, kIndex) => data.map(function(d) {
    let rVal = {};
    rVal[mainAxisDataKey] = d[mainAxisDataKey]
    rVal.label = k ? k : '[error]'
    rVal.value = d[k] ? d[k] : 0
    const thisScheme = colorSchemes[colorScheme]
    rVal.color = thisScheme[kIndex % thisScheme.length]
    return rVal
  })).reduce((p, c) => p.concat(c))
}

export const formatDataForStackedArea = (data, dataKeys, mainAxisDataKey, colorScheme) => {
  const thisScheme = colorSchemes[colorScheme]
  return dataKeys.map((k, kIndex) =>
    ({
      label: k ? k : '[error]',
      color: thisScheme[kIndex % thisScheme.length],
      coordinates: data.map(function(d) {
        let rVal = {};
        rVal[mainAxisDataKey] = d[mainAxisDataKey]
        rVal.label = k
        rVal.value = d[k] ? d[k] : 0
		    return rVal
		  })
  	})
  )
}
