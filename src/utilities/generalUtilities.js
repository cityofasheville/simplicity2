import { browserHistory } from 'react-router';

export const timeOptions = [
  { display: 'the last 30 days', value: '30' },
  { display: 'the last 6 months', value: '183' },
  { display: 'the last year', value: '365' },
  { display: 'the last 5 years', value: '1825' },
  { display: 'the last 10 years', value: '3650' },
  { display: 'all time', value: 'all' },
];

export const extentOptions = [
  { display: 'a quarter block (27.5 yards)', value: '83' },
  { display: 'half a block (55 yards)', value: '165' },
  { display: 'a city block (110 yards)', value: '330' },
  { display: 'a couple city blocks (1/8 mile)', value: '660' },
  { display: 'a quarter mile', value: '1320' },
];

export const refreshLocation = (updateKeyValues, location) => {
  let urlStr = location.pathname;
  const urlParams = Array.from(new Set(Object.keys(updateKeyValues).concat(Object.keys(location.query))));
  const paramsToUpdate = Object.keys(updateKeyValues);
  if (urlParams.length > 0) {
    urlStr = `${urlStr}?`;
    for (let i = 0; i < urlParams.length; i += 1) {
      if (paramsToUpdate.indexOf(urlParams[i]) > -1) {
        urlStr = `${urlStr}${i === 0 ? '' : '&'}${urlParams[i]}=${updateKeyValues[urlParams[i]]}`;
      } else {
        urlStr = `${urlStr}&${urlParams[i]}=${location.query[urlParams[i]]}`;
      }
    }
  }
  browserHistory.replace(urlStr);
};
