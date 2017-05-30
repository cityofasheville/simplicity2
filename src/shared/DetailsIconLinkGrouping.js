import React from 'react';
import PropTypes from 'prop-types';
import DetailsIconLinkFormGroup from './DetailsIconLinkFormGroup';

const DetailsIconLinkGrouping = (props) => {
  const numArrays = Math.floor(12 / props.colWidth); // step one, determine number of subArrays needed
  const subArraySize = Math.floor(props.dataLabels.length / numArrays);
  const subLabelsArrays = [];
  const subIconsArrays = [];
  const subTitlesArrays = [];
  const subHrefsArrays = [];

  for (let i = 0, j = props.dataLabels.length; i < j; i += subArraySize) { // step 2, split into subarrays
    subLabelsArrays.push(props.dataLabels.slice(i, i + subArraySize));
    subIconsArrays.push(props.dataIcons.slice(i, i + subArraySize));
    subTitlesArrays.push(props.dataTitles.slice(i, i + subArraySize));
    subHrefsArrays.push(props.dataHrefs.slice(i, i + subArraySize));
  }
  return (
    <div>
      {subLabelsArrays.map((values, i) => (
        <div key={i} className={['col-xs-', props.colWidth].join('')}>
          {values.map((value, j) => (
            <DetailsIconLinkFormGroup key={[i, j].join('_')} label={subLabelsArrays[i][j]} icon={subIconsArrays[i][j]} title={subTitlesArrays[i][j]} href={subHrefsArrays[i][j]} />
          ))}
        </div>
      ))}
    </div>
  );
};

DetailsIconLinkGrouping.propTypes = {
  colWidth: PropTypes.number,
  dataLabels: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dataIcons: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dataHrefs: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dataTitles: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

DetailsIconLinkGrouping.defaultProps = {
  colWidth: 12,
  dataLabels: [],
  dataIcons: [],
  dataHrefs: [],
  dataTitles: [],
};

export default DetailsIconLinkGrouping;
