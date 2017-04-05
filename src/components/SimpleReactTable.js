import React from 'react';
import ReactTable from 'react-table';

const dummyData = [
  { serviceArea: 'Public Safety', Actual_2013_14: '$42,668,751', Actual_2014_15: '$45,564,007', Budget_2015_16: '$45,569,606', Proposed_2016_17: '$47,944,730', id: 0 },
  { serviceArea: 'Environment & Transportation', Actual_2013_14: '$13,994,542', Actual_2014_15: '$15,077,898', Budget_2015_16: '$14,974,276', Proposed_2016_17: '$16,062,353', id: 1 },
  { serviceArea: 'General Government', Actual_2013_14: '$12,847,324 ', Actual_2014_15: '$18,107,163', Budget_2015_16: '$16,156,931', Proposed_2016_17: '$19,406,449', id: 2 },
  { serviceArea: 'Culture & Recreation', Actual_2013_14: '$9,596,690', Actual_2014_15: '$10,184,678', Budget_2015_16: '$10,955,585', Proposed_2016_17: '$11,334,452', id: 3 },
  { serviceArea: 'Capital Pay-Go/Debt', Actual_2013_14: '$8,057,714', Actual_2014_15: '$9,138,02', Budget_2015_16: '$9,086,878', Proposed_2016_17: '$10,132,171', id: 4 },
  { serviceArea: 'Community Development', Actual_2013_14: '$4,930,139', Actual_2014_15: '$4,682,745', Budget_2015_16: '$5,405,351', Proposed_2016_17: '5,822,511', id: 5 },
  { serviceArea: 'Total General Fund', Actual_2013_14: '$92,095,160', Actual_2014_15: '$102,754,511', Budget_2015_16: '$103,148,627', Proposed_2016_17: '110,702,666', id: 6 },
];

const dummyData2 = [
  [{ area: 'Salaries & Wages', Actual_2013_14: '$12,771,150', Actual_2014_15: '$13,237,618', Original_Budget_2015_16: '$14,025,009', Amended_Budget_2015_16: '$14,025,009', Estimate_2015_16: '$13,517,893', Proposed_2016_17: '$14,581,789' },
  { area: 'Fringe Benefits', Actual_2013_14: '$4,624,183', Actual_2014_15: '$5,510,330', Original_Budget_2015_16: '$5,769,331', Amended_Budget_2015_16: '$5,769,331', Estimate_2015_16: '$5,560,724', Proposed_2016_17: '$6,162,165' },
  { area: 'Operating Costs', Actual_2013_14: '$4,240,058', Actual_2014_15: '$4,200,840', Original_Budget_2015_16: '$4,924,991', Amended_Budget_2015_16: '$4,924,991', Estimate_2015_16: '$4,746,913', Proposed_2016_17: '$4,802,025' },
  { area: 'Capital Outlay', Actual_2013_14: '$71,675', Actual_2014_15: '$265,709', Original_Budget_2015_16: '$0', Amended_Budget_2015_16: '$0', Estimate_2015_16: '$0', Proposed_2016_17: '$9,000' },
  { area: 'Total', Actual_2013_14: '$21,707,066', Actual_2014_15: '$23,214,497', Original_Budget_2015_16: '$24,719,331', Amended_Budget_2015_16: '$24,719,331', Estimate_2015_16: '$23,825,530', Proposed_2016_17: '$25,554,979' }],
  [
    { area: 'Administration', Actual_2013_14: '$800,467', Actual_2014_15: '$1,247,975', Original_Budget_2015_16: '$950,708', Amended_Budget_2015_16: '$950,708', Estimate_2015_16: '$961,405', Adopted_2016_17: '$881,785' },
    { area: 'Streets & Sidewalks', Actual_2013_14: '$4,266,904', Actual_2014_15: '$5,086,269', Original_Budget_2015_16: '$3,618,061', Amended_Budget_2015_16: '$4,214,075', Estimate_2015_16: '$3,658,777', Adopted_2016_17: '$3,768,927' },
    { area: 'Sanitation', Actual_2013_14: '$4,524,506', Actual_2014_15: '$4,423,890', Original_Budget_2015_16: '$5,008,481', Amended_Budget_2015_16: '$5,008,481', Estimate_2015_16: '$5,064,834', Adopted_2016_17: '$5,022,619' },
    { area: 'Engineering Services', Actual_2013_14: '$837,176', Actual_2014_15: '**', Original_Budget_2015_16: '**', Amended_Budget_2015_16: '**', Estimate_2015_16: '**', Adopted_2016_17: '**' },
    { area: 'Street Lighting', Actual_2013_14: '$1,224,020', Actual_2014_15: '**', Original_Budget_2015_16: '**', Amended_Budget_2015_16: '**', Estimate_2015_16: '**', Adopted_2016_17: '**' },
    { area: 'Fleet Management', Actual_2013_14: '$316,657', Actual_2014_15: '*', Original_Budget_2015_16: '*', Amended_Budget_2015_16: '*', Estimate_2015_16: '*', Adopted_2016_17: '*' },
  ],
];

const dummyColumns = [{
  header: 'Service Area',
  columns: [{
    header: 'Service Area',
    accessor: 'serviceArea',
  }, {
    header: 'id',
    accessor: 'id',
    show: false,
  }],
}, {
  header: 'Years',
  columns: [{
    header: '2013-14 Actual',
    accessor: 'Actual_2013_14',
  }, {
    header: '2014-15 Actual',
    accessor: 'Actual_2014_15',
  }, {
    header: '2015-16 Budget',
    accessor: 'Budget_2015_16',
  }, {
    header: '2016-17 Proposed',
    accessor: 'Proposed_2016_17',
  }],
}];

const dummyColumns2 = [
  [{
    header: 'Expense category',
    accessor: 'area',
  }, {
    header: '2014-15 Actual',
    accessor: 'Actual_2014_15',
  }, {
    header: 'Original 2015-16 Budget',
    accessor: 'Original_Budget_2015_16',
  }, {
    header: 'Amended 2015-16 Budget',
    accessor: 'Amended_Budget_2015_16',
  }, {
    header: 'Estimated 2015-16',
    accessor: 'Estimate_2015_16',
  }, {
    header: '2016-17 Proposed',
    accessor: 'Proposed_2016_17',
  }],
  [{
    header: 'Expense category',
    accessor: 'area',
  }, {
    header: '2014-15 Actual',
    accessor: 'Actual_2014_15',
  }, {
    header: 'Original 2015-16 Budget',
    accessor: 'Original_Budget_2015_16',
  }, {
    header: 'Amended 2015-16 Budget',
    accessor: 'Amended_Budget_2015_16',
  }, {
    header: 'Estimated 2015-16',
    accessor: 'Estimate_2015_16',
  }, {
    header: '2016-17 Proposed',
    accessor: 'Proposed_2016_17',
  }],
];

const SimpleReactTable = props => (
  <ReactTable
    data={props.data}
    columns={props.columns}
    defaultPageSize={10}
    SubComponent={(row) => {
      return (
        <div style={{ padding: '20px' }}>
          <ReactTable
            data={dummyData2[row.index]}
            columns={dummyColumns2[row.index]}
            defaultPageSize={3}
            showPagination={false}
            SubComponent={(row) => {
              return (
                <div style={{ padding: '20px' }}>
                  <em>And so on going deeper </em>
                </div>
              );
            }}
          />
        </div>
      );
    }}
  />
);

SimpleReactTable.propTypes = {
  data: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  columns: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

SimpleReactTable.defaultProps = {
  data: dummyData,
  columns: dummyColumns,
};

export default SimpleReactTable;
