import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
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
          <ReactTable
            data={props.data}
            columns={props.columns}
            defaultPageSize={props.data.length}
            showPagination={false}
            style={{ marginRight: '10px', marginLeft: '10px' }}
          />
        </div>
      </div>
    </div>
  );
};

DetailsTable.propTypes = {
  hasTitle: PropTypes.bool,
  hasTitleIcon: PropTypes.bool,
  titleIcon: PropTypes.string,
  title: PropTypes.string,
  columns: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  data: PropTypes.array, // eslint-disable-line react/forbid-prop-types
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
