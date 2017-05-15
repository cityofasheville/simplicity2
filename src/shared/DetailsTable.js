import React from 'react';
import styles from './detailsTable.css';

const DetailsTable = (props) => {
  const numColumns = props.columns.length;
  const colWidth = Math.floor(12 / numColumns);

  return (
    <div>
      {props.hasTitle &&
        <div className={styles.titleDiv}>
          {props.hasTitleIcon &&
            <i className={['fa fa-', props.titleIcon].join('')}></i>
          } {props.title}
        </div>
      }
      <div className={['row'].join(' ')}>
        <div className="col-xs-12">
          <div className={['row', styles.headerRow].join(' ')}>
            {props.columns.map((columnData, i) => (
              <div key={['header', i].join('_')} className={[['col-xs-', colWidth].join(''), styles.columnHeader].join(' ')}>
                {columnData.title}
              </div>
            ))}
          </div>
        </div>
      </div>
      {props.columns.map((columnData, i) => (
        <div key={i} className={['col-xs-', colWidth].join('')}>
          {props.data.map((dataValue, j) => (
            <div key={[i, j].join('_')} className={['form-group', styles.columnData].join(' ')}>
              <div style={props.lastRowBold && j === props.data.length - 1 ? { fontWeight: 'bold' } : {}}>
                {dataValue[columnData.name]}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

DetailsTable.propTypes = {
  hasTitle: React.PropTypes.bool,
  hasTitleIcon: React.PropTypes.bool,
  titleIcon: React.PropTypes.string,
  title: React.PropTypes.string,
  columns: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  data: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  lastRowBold: React.PropTypes.bool,
};

DetailsTable.defaultProps = {
  hasTitle: false,
  hasTitleIcon: false,
  titleIcon: '',
  title: '',
  columns: [
    { title: 'Value Type', name: 'value_type' },
    { title: 'Amount', name: 'amount' },
  ],
  data: [
    { value_type: 'Building value', amount: '$682,100' },
    { value_type: 'Land value', amount: '$145,400' },
    { value_type: 'Appraised value', amount: '$827,500' },
    { value_type: 'Tax value', amount: '$0' },
    { value_type: 'Total market value', amount: '$827,500' },
  ],
  lastRowBold: false,
};

export default DetailsTable;
