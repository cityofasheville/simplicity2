import React from 'react';
import DetailsFormGroup from './DetailsFormGroup';
import styles from './detailsGrouping.css';

const renderData = (dataLabels, dataValues, dataIcons, colWidth) => {
  const numArrays = Math.floor(12 / colWidth); // step one, determine number of subArrays needed
  const subArraySize = Math.floor(dataValues.length / numArrays);
  const subValuesArrays = [];
  const subLabelsArrays = [];
  const subIconsArrays = [];
  const hasLabels = dataLabels.length === dataValues.length;
  const hasIcons = dataIcons.length === dataValues.length;

  for (let i = 0, j = dataValues.length; i < j; i += subArraySize) { // step 2, split into subarrays
    subValuesArrays.push(dataValues.slice(i, i + subArraySize));
    if (hasLabels) {
      subLabelsArrays.push(dataLabels.slice(i, i + subArraySize));
    }
    if (hasIcons) {
      subIconsArrays.push(dataIcons.slice(i, i + subArraySize));
    }
  }
  return (
    <div>
      {subValuesArrays.map((values, i) => (
        <div key={i} className={['col-xs-', colWidth.toString()].join('')}>
          {values.map((value, j) => (
            <DetailsFormGroup key={j} hasLabel={hasLabels} hasIcon={hasIcons} label={hasLabels ? subLabelsArrays[i][j] : ''} icon={hasIcons ? subIconsArrays[i][j] : ''} value={value} />
          ))}
        </div>
      ))}
    </div>
  );
};

const DetailsGrouping = props => (
  <div>
    {props.dataValues.length > 0 && <fieldset className={styles.detailsFieldset}>
      {props.hasTitle &&
        <div className={styles.titleDiv}>
          {props.hasTitleIcon &&
            <i className={['fa fa-', props.titleIcon].join('')}></i>
          } {props.title}
        </div>
      }
      {renderData(props.dataLabels, props.dataValues, props.dataIcons, props.colWidth)}
    </fieldset>
    }
  </div>
);

DetailsGrouping.propTypes = {
  hasTitle: React.PropTypes.bool,
  hasTitleIcon: React.PropTypes.bool,
  titleIcon: React.PropTypes.string,
  title: React.PropTypes.string,
  colWidth: React.PropTypes.number,
  dataLabels: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dataValues: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dataIcons: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

DetailsGrouping.defaultProps = {
  hasTitle: false,
  hasTitleIcon: false,
  titleIcon: '',
  title: '',
  colWidth: 12,
  dataLabels: [],
  dataValues: [],
  dataIcons: [],
};

export default DetailsGrouping;
