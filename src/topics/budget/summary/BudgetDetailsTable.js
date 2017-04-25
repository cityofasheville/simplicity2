import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ReactTable from 'react-table';

const last4Years = [
  2015,
  2016,
  2017,
  2018,
];

const getDollars = (value) => {
  const initialSymbols = value < 0 ? '-$' : '$';
  return [initialSymbols, Math.abs(value).toLocaleString()].join('');
  // if (value > 1000000) {
  //   return [initialSymbols, (Math.abs(value) / 1000000).toLocaleString(), ' M'].join('');
  // } else if (value > 1000) {
  //   return [initialSymbols, (Math.abs(value) / 1000).toLocaleString(), ' k'].join('');
  // }
  // return [initialSymbols, (Math.abs(value)).toLocaleString()].join('');
};

const getDataColumns = (level) => {
  const theHeader = () => {
    switch (level) {
      case 0:
        return 'Function';
      case 1:
        return 'Department';
      case 2:
        return 'Division';
      case 3:
        return 'Account';
      default:
        return 'Category';
    }
  };
  const dataColumns = [
    {
      header: theHeader,
      accessor: 'name',
      width: level === 3 ? 300 - (34 * 2) : 300 - (34 * level),
    },
    {
      header: last4Years[0],
      accessor: 'threeYearsAgo',
      render: props => getDollars(props.value),
      minWidth: 60,
      style: { textAlign: 'right' },
    }, {
      header: last4Years[1],
      accessor: 'twoYearsAgo',
      render: props => getDollars(props.value),
      minWidth: 60,
      style: { textAlign: 'right' },
    }, {
      header: last4Years[2],
      accessor: 'oneYearAgo',
      render: props => getDollars(props.value),
      minWidth: 60,
      style: { textAlign: 'right' },
    }, {
      header: last4Years[3],
      accessor: 'proposed',
      render: props => getDollars(props.value),
      minWidth: 60,
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
            Some explanatory text here describing something important to the users that is relevant to know, that we want to communicate to them about this particular chart.<br />
            Click the triangles at left to expand rows for more detail.
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="btn-group pull-left" style={{ marginBottom: '3px' }}>
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
          <ReactTable
            data={dataForTable}
            columns={getDataColumns(0)}
            defaultPageSize={dataForTable.length}
            showPagination={false}
            SubComponent={innerRow1 => (
              <div style={{ paddingLeft: '34px' }}>
                <ReactTable
                  data={dataForTable[innerRow1.index].children}
                  columns={getDataColumns(1)}
                  defaultPageSize={dataForTable[innerRow1.index].children.length}
                  showPagination={false}
                  SubComponent={innerRow2 => (
                    <div style={{ paddingLeft: '34px' }}>
                      <ReactTable
                        data={dataForTable[innerRow1.index].children[innerRow2.index].children}
                        columns={getDataColumns(2)}
                        defaultPageSize={dataForTable[innerRow1.index].children[innerRow2.index].children.length}
                        showPagination={false}
                        SubComponent={innerRow3 => (
                          <div style={{ paddingLeft: '34px' }}>
                            <ReactTable
                              data={dataForTable[innerRow1.index].children[innerRow2.index].children[innerRow3.index].children}
                              columns={getDataColumns(3)}
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
  );
};

BudgetDetailsTable.propTypes = {
  location: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  expenseTree: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  revenueTree: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

BudgetDetailsTable.defaultProps = {
  data: [],
};

const mapStateToProps = state => (
  {
    expenseTree: state.budget.expenseTree,
    revenueTree: state.budget.revenueTree,
  }
);

export default connect(mapStateToProps)(BudgetDetailsTable);

