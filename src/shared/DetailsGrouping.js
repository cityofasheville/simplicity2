import React from 'react';
import PropTypes from 'prop-types';
import DetailsFormGroup from './DetailsFormGroup';
import styles from './detailsGrouping.css';

const DetailsGrouping = (props) => {
  const numArrays = Math.floor(12 / props.colWidth); // step one, determine number of subArrays needed
  const subArraySize = Math.floor(props.dataValues.length / numArrays);
  const subValuesArrays = [];
  const subLabelsArrays = [];
  const subIconsArrays = [];
  const hasLabels = props.dataLabels.length === props.dataValues.length;
  const hasIcons = props.dataIcons.length === props.dataValues.length;

  for (let i = 0, j = props.dataValues.length; i < j; i += subArraySize) { // step 2, split into subarrays
    subValuesArrays.push(props.dataValues.slice(i, i + subArraySize));
    if (hasLabels) {
      subLabelsArrays.push(props.dataLabels.slice(i, i + subArraySize));
    }
    if (hasIcons) {
      subIconsArrays.push(props.dataIcons.slice(i, i + subArraySize));
    }
  }
  return (
    <div>
      {props.dataValues.length > 0 && <div>
        {props.hasTitle &&
          <div className={styles.titleDiv}>
            {props.hasTitleIcon &&
              <i className={['fa fa-', props.titleIcon].join('')}></i>
            } {props.title}
          </div>
        }
        </div>
      }
      {subValuesArrays.map((values, i) => (
        <div key={i} className={['col-xs-', props.colWidth].join('')}>
          {values.map((value, j) => (
            <DetailsFormGroup key={[i, j].join('_')} hasLabel={hasLabels} hasIcon={hasIcons} label={hasLabels ? subLabelsArrays[i][j] : ''} icon={hasIcons ? subIconsArrays[i][j] : ''} value={value} />
          ))}
        </div>
      ))}
    </div>
  );
};

DetailsGrouping.propTypes = {
  hasTitle: PropTypes.bool,
  hasTitleIcon: PropTypes.bool,
  titleIcon: PropTypes.string,
  title: PropTypes.string,
  colWidth: PropTypes.number,
  dataLabels: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dataValues: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dataIcons: PropTypes.array, // eslint-disable-line react/forbid-prop-types
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
