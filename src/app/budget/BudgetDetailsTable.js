import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Collapsible from 'react-collapsible';

const last4Years = [
  2015,
  2016,
  2017,
  2018,
];

const tableNotes = [
  'The Internal Audit Division was moved from the Finance Department to the Administration Services Department mid-year, so the 2016-17 Adopted Budget numbers for those department do not match the Original Budget numbers in the budget document.',
];

const last4YrBudgetTypes = [
  'Actual',
  'Actual',
  'Adopted',
  'Proposed',
];

const getDollars = (value) => {
  const initialSymbols = value < 0 ? '-$' : '$';
  return [initialSymbols, Math.abs(value).toLocaleString()].join('');
};

const getYearHeader = year => (
  <div>
    { last4Years.indexOf(year) > -1 &&
      <div>{last4YrBudgetTypes[last4Years.indexOf(year)]}</div>
    }
    {[year - 1, year.toString().slice(2)].join('-')}
  </div>
);

const getDataColumns = (level, expenseOrRevenue) => {
  const theHeader = () => {
    switch (level) {
      case 0:
        if (expenseOrRevenue === 'expenditures') {
          return 'Budget Section';
        }
        return 'Budget Category';
      case 1:
        return 'Department';
      case 2:
        return 'Division';
      case 3:
        return 'Account';
      default:
        return 'Grouping';
    }
  };
  const dataColumns = [
    {
      header: theHeader,
      accessor: 'name',
      width: level === 3 ? 300 - (34 * 2) : 300 - (34 * level),
    },
    {
      header: getYearHeader(last4Years[0]),
      accessor: 'threeYearsAgo',
      render: props => getDollars(props.value),
      minWidth: 95,
      style: { textAlign: 'right' },
    }, {
      header: getYearHeader(last4Years[1]),
      accessor: 'twoYearsAgo',
      render: props => getDollars(props.value),
      minWidth: 95,
      style: { textAlign: 'right' },
    }, {
      header: getYearHeader(last4Years[2]),
      accessor: 'oneYearAgo',
      render: props => getDollars(props.value),
      minWidth: 95,
      style: { textAlign: 'right' },
    }, {
      header: getYearHeader(last4Years[3]),
      accessor: 'proposed',
      render: props => getDollars(props.value),
      minWidth: 95,
      style: { textAlign: 'right' },
    },
    {
      header: 'Change from past year',
      accessor: 'deltaPercent',
      minWidth: 70,
      style: { textAlign: 'right' },
    },
  ];
  return dataColumns;
};

const BudgetDetailsTable = (props) => {
  const dataForTable = props.location.query.mode === 'expenditures' || props.location.query.mode === undefined ? props.expenseTree.children : props.revenueTree.children;

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <h3>Table of {props.location.query.mode || 'expenditures'}</h3>
          <div style={{ marginBottom: '15px' }}>
            You may explore the full dataset in the table below, or <a className="inText" href="http://data.ashevillenc.gov/datasets?q=budget&sort_by=relevance" target="_blank">download here</a>. Click the triangles at left to expand rows for more detail.
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="btn-group pull-right" style={{ marginBottom: '3px' }}>
            <Link to={{ pathname: props.location.pathname, query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: 'expenditures', hideNavbar: props.location.query.hideNavbar } }}>
              <button className={props.location.query.mode !== 'revenue' ? 'btn btn-primary btn-xs active' : 'btn btn-primary btn-xs'} style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Expenditures</button>
            </Link>
            <Link to={{ pathname: props.location.pathname, query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: 'revenue', hideNavbar: props.location.query.hideNavbar } }}>
              <button className={props.location.query.mode === 'revenue' ? 'btn btn-primary btn-xs active' : 'btn btn-primary btn-xs'} style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>Revenue</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <Collapsible trigger="Notes">
            {props.notes.map((item, index) => (
              <p key={['notes', index].join('_')}>{item}</p>
            ))}
          </Collapsible>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div alt={['Table of', (props.location.query.mode || 'expenditures')].join(' ')}>
            <ReactTable
              data={dataForTable}
              columns={getDataColumns(0, props.location.query.mode)}
              defaultPageSize={dataForTable.length}
              showPagination={false}
              SubComponent={innerRow1 => (
                <div style={{ paddingLeft: '34px' }}>
                  <ReactTable
                    data={dataForTable[innerRow1.index].children}
                    columns={getDataColumns(1, props.location.query.mode)}
                    defaultPageSize={dataForTable[innerRow1.index].children.length}
                    showPagination={false}
                    SubComponent={innerRow2 => (
                      <div style={{ paddingLeft: '34px' }}>
                        <ReactTable
                          data={dataForTable[innerRow1.index].children[innerRow2.index].children}
                          columns={getDataColumns(2, props.location.query.mode)}
                          defaultPageSize={dataForTable[innerRow1.index].children[innerRow2.index].children.length}
                          showPagination={false}
                          SubComponent={innerRow3 => (
                            <div style={{ paddingLeft: '34px' }}>
                              <ReactTable
                                data={dataForTable[innerRow1.index].children[innerRow2.index].children[innerRow3.index].children}
                                columns={getDataColumns(3, props.location.query.mode)}
                                defaultPageSize={dataForTable[innerRow1.index].children[innerRow2.index].children[innerRow3.index].children.length}
                                showPagination={false}
                              />
                            </div>
                            )
                          }
                        />
                      </div>
                      )
                    }
                  />
                </div>
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

BudgetDetailsTable.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  expenseTree: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  revenueTree: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  notes: PropTypes.arrayOf(PropTypes.string),
};

BudgetDetailsTable.defaultProps = {
  data: [],
  notes: tableNotes,
};

const mapStateToProps = state => (
  {
    expenseTree: state.budget.expenseTree,
    revenueTree: state.budget.revenueTree,
  }
);

export default connect(mapStateToProps)(BudgetDetailsTable);

