import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import ReactTable from 'react-table';
import { RadioGroup, Radio } from 'react-radio-group';
import accessibility from '../../shared/react_table_hoc/Accessibility';
import expandingRows from '../../shared/react_table_hoc/ExpandingRows';
import Collapsible from '../../shared/Collapsible';
import { getBudgetTrees } from './graphql/budgetQueries';
import { refreshLocation } from '../../utilities/generalUtilities';

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
  'Adopted',
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

const getChangeHeader = () => (
  <div>Change from <br /> past year</div>
);

const getDataColumnHeader = (level, expenseOrRevenue) => () => {
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

const getDataColumns = (level, expenseOrRevenue) => {
  const theHeader = getDataColumnHeader(level, expenseOrRevenue);
  const dataColumns = [
    {
      Header: theHeader,
      accessor: 'name',
      width: level === 3 ? 300 - (34 * 2) : 300 - (34 * level),
      getProps: () => ({
        role: 'rowheader',
      }),
    },
    {
      Header: getYearHeader(last4Years[0]),
      accessor: 'threeYearsAgo',
      Cell: props => getDollars(props.value),
      minWidth: 95,
      style: { textAlign: 'right' },
    }, {
      Header: getYearHeader(last4Years[1]),
      accessor: 'twoYearsAgo',
      Cell: props => getDollars(props.value),
      minWidth: 95,
      style: { textAlign: 'right' },
    }, {
      Header: getYearHeader(last4Years[2]),
      accessor: 'oneYearAgo',
      Cell: props => getDollars(props.value),
      minWidth: 95,
      style: { textAlign: 'right' },
    }, {
      Header: getYearHeader(last4Years[3]),
      accessor: 'proposed',
      Cell: props => getDollars(props.value),
      minWidth: 95,
      style: { textAlign: 'right' },
    },
    {
      Header: getChangeHeader(),
      accessor: 'deltaPercent',
      minWidth: 95,
      style: { textAlign: 'right' },
    },
  ];
  return dataColumns;
};

const tdProps = () => ({
  style: {
    whiteSpace: 'normal',
  },
});

const trProps = () => ({
  style: {
    cursor: 'pointer',
  },
});

const BudgetDetailsTable = (props) => {
  const dataForTable = props.location.query.mode === 'expenditures' || props.location.query.mode === undefined ? props.expenseTree.children : props.revenueTree.children;

  const getNewUrlParams = mode => (
    {
      mode,
      nodePath: 'root',
    }
  );

  const AccessibleReactTable = accessibility(ReactTable);
  const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <h3 id={'budget-details-table-label'}>{`Table of ${props.location.query.mode || 'expenditures'}`}</h3>
          <div style={{ marginBottom: '15px' }}>
            You may explore the full dataset in the table below, or <a className="inText" href="http://data.ashevillenc.gov/datasets?q=budget&sort_by=relevance" target="_blank">download here</a>. Click the triangles at left to expand rows for more detail.
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="radioGroup pull-right" style={{ marginBottom: '3px' }}>
            <RadioGroup name="tableRadios" id="tableRadios" selectedValue={props.location.query.mode || 'expenditures'} onChange={value => refreshLocation(getNewUrlParams(value), props.location)}>
              <label>
                <Radio value="expenditures" />Expenditures
              </label>
              <label>
                <Radio value="revenue" />Revenue
              </label>
            </RadioGroup>
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
            <ExpandableAccessibleReactTable
              data={dataForTable}
              columns={getDataColumns(0, props.location.query.mode)}
              pageSize={dataForTable.length}
              showPagination={false}
              getTdProps={tdProps}
              getTrProps={trProps}
              tableId={'table-1'}
              ariaLabelledBy={'budget-details-table-label'}
              SubComponent={innerRow1 => (
                <div style={{ paddingLeft: '34px' }}>
                  <ExpandableAccessibleReactTable
                    data={dataForTable[innerRow1.index].children}
                    columns={getDataColumns(1, props.location.query.mode)}
                    defaultPageSize={dataForTable[innerRow1.index].children.length}
                    showPagination={false}
                    getTdProps={tdProps}
                    getTrProps={trProps}
                    tableId={'table-2'}
                    ariaLabel={`${getDataColumnHeader(1, props.location.query.mode)()} subtable`}
                    SubComponent={innerRow2 => (
                      <div style={{ paddingLeft: '34px' }}>
                        <ExpandableAccessibleReactTable
                          data={dataForTable[innerRow1.index].children[innerRow2.index].children}
                          columns={getDataColumns(2, props.location.query.mode)}
                          defaultPageSize={dataForTable[innerRow1.index].children[innerRow2.index].children.length}
                          showPagination={false}
                          getTdProps={tdProps}
                          getTrProps={trProps}
                          tableId={'table-3'}
                          ariaLabel={`${getDataColumnHeader(2, props.location.query.mode)()} subtable`}
                          SubComponent={innerRow3 => (
                            <div style={{ paddingLeft: '34px' }}>
                              <AccessibleReactTable
                                data={dataForTable[innerRow1.index].children[innerRow2.index].children[innerRow3.index].children}
                                columns={getDataColumns(3, props.location.query.mode)}
                                defaultPageSize={dataForTable[innerRow1.index].children[innerRow2.index].children[innerRow3.index].children.length}
                                showPagination={false}
                                ariaLabel={`${getDataColumnHeader(3, props.location.query.mode)()} subtable`}
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

export default graphql(getBudgetTrees, {
  props: ({ data: { budgetTrees } }) => ({
    expenseTree: budgetTrees.expenseTree,
    revenueTree: budgetTrees.revenueTree,
  }),
})(BudgetDetailsTable);
