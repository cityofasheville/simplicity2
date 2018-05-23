import React from 'react';
import AccessibleReactTable from 'accessible-react-table';
import expandingRows from '../../../shared/react_table_hoc/ExpandingRows';

const mainDataColumns = [
  {
    Header: 'Division',
    accessor: 'name',
    width: 250,
  }, {
    Header: '0-30',
    accessor: 'under_30',
    width: 80,
    headerStyle: {
      background: '#4575b4',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.under_30 > 0 ? '#4575b4' : '#d1dded',
        textAlign: 'right',
      },
    }),
  }, {
    Header: '31-60',
    accessor: 'under_60',
    width: 80,
    headerStyle: {
      background: '#fdae61',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.under_60 > 0 ? '#fdae61' : '#ffdebf',
        textAlign: 'right',
      },
    }),
  }, {
    Header: '61-90',
    accessor: 'under_90',
    width: 80,
    headerStyle: {
      background: '#f46d43',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.under_90 > 0 ? '#f46d43' : '#ffa98f69',
        textAlign: 'right',
      },
    }),
  }, {
    Header: '> 90',
    accessor: 'over_90',
    width: 80,
    headerStyle: {
      background: '#d73027',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.over_90 > 0 ? '#d73027' : '#ce524b69',
        textAlign: 'right',
      },
    }),
  },
];

const innerDataColumns = [
  {
    Header: 'Cardholder',
    accessor: 'cardholder',
    width: 250,
  }, {
    Header: '0-30 days',
    accessor: 'under_30',
    width: 80,
    headerStyle: {
      background: '#4575b4',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.under_30 > 0 ? '#4575b4' : '#d1dded',
        textAlign: 'right',
      },
    }),
  }, {
    Header: '31-60 days',
    accessor: 'under_60',
    width: 80,
    headerStyle: {
      background: '#fdae61',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.under_60 > 0 ? '#fdae61' : '#ffdebf',
        textAlign: 'right',
      },
    }),
  }, {
    Header: '61-90 days',
    accessor: 'under_90',
    width: 80,
    headerStyle: {
      background: '#f46d43',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.under_90 > 0 ? '#f46d43' : '#ffa98f69',
        textAlign: 'right',
      },
    }),
  }, {
    Header: '> 90 days',
    accessor: 'over_90',
    width: 80,
    headerStyle: {
      background: '#d73027',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.over_90 > 0 ? '#d73027' : '#ce524b69',
        textAlign: 'right',
      },
    }),
  },
];

// const innerDataColumns2 = [
//   {
//     Header: 'Invoiced date',
//     accessor: 'invoice_date',
//     getProps: () => ({
//       role: 'rowheader',
//     }),
//   },
//   {
//     Header: 'Reconciled date',
//     accessor: 'reconciled_date',
//   }, {
//     Header: 'Statement status',
//     accessor: 'statement_status',
//   }, {
//     Header: 'Statement id',
//     accessor: 'statement_id',
//   }, {
//     Header: 'Statement code',
//     accessor: 'statement_code',
//   },
// ];

const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

const PCardDaysTable = (props) => {
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

  return (
    <div
      alt="Table of days to reconcile"
    >
      <h3 id={'pcard-compliance-days-to-reconcile-label'}>{`Table of days to reconcile`}</h3>
      <ExpandableAccessibleReactTable
        data={props.data}
        columns={mainDataColumns}
        pageSize={props.data.length}
        showPagination={false}
        getTdProps={tdProps}
        getTrProps={trProps}
        tableId={'table-1'}
        ariaLabelledBy={'pcard-compliance-days-to-reconcile-label'}
        SubComponent={innerRow1 => (
          <div style={{ paddingLeft: '34px', marginTop: '15px' }}>
            <AccessibleReactTable
              data={props.data[innerRow1.index].children}
              columns={innerDataColumns}
              defaultPageSize={props.data[innerRow1.index].children.length <= 5 ? props.data[innerRow1.index].children.length : 5}
              showPagination={props.data[innerRow1.index].children.length > 5}
              getTdProps={tdProps}
              getTrProps={trProps}
              tableId="table-2"
              ariaLabel="Cardholders subtable"
              // SubComponent={innerRow2 => (
              //   <div style={{ paddingLeft: '34px', marginTop: '15px' }}>
              //     <ExpandableAccessibleReactTable
              //       data={props.data[innerRow1.index].children[innerRow2.index].statements}
              //       columns={innerDataColumns2}
              //       defaultPageSize={props.data[innerRow1.index].children[innerRow2.index].statements.length <= 5 ? props.data[innerRow1.index].children[innerRow2.index].statements.length : 5}
              //       showPagination={props.data[innerRow1.index].children[innerRow2.index].statements.length > 5}
              //       getTdProps={tdProps}
              //       getTrProps={trProps}
              //       tableId="table-2"
              //       ariaLabel="Statements subtable"
              //     />
              //   </div>
              // )}
            />
          </div>
        )
        }
      />
    </div>
  );
};

export default PCardDaysTable;
