import React from 'react';
import AccessibleReactTable from 'accessible-react-table';
import expandingRows from '../../../shared/react_table_hoc/ExpandingRows';

const mainDataColumns = [
  {
    Header: 'Division',
    accessor: 'name',
    width: 250,
  }, {
    Header: 'Has receipt',
    accessor: 'has_itemized_receipt',
    width: 100,
    headerStyle: {
      background: '#4575b4',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.has_itemized_receipt > 0 ? '#4575b4' : '#d1dded',
        textAlign: 'right',
      },
    }),
  }, {
    Header: 'Missing receipt',
    accessor: 'missing_itemized_receipt',
    width: 120,
    headerStyle: {
      background: '#d73027',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.missing_itemized_receipt > 0 ? '#d73027' : '#ce524b69',
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
    Header: 'Has receipt',
    accessor: 'has_itemized_receipt',
    width: 100,
    headerStyle: {
      background: '#4575b4',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.has_itemized_receipt > 0 ? '#4575b4' : '#d1dded',
        textAlign: 'right',
      },
    }),
  }, {
    Header: 'Missing receipt',
    accessor: 'missing_itemized_receipt',
    width: 120,
    headerStyle: {
      background: '#d73027',
      borderBottom: '1px solid white',
    },
    getProps: (state, rowInfo) => ({
      style: {
        backgroundColor: rowInfo.row.missing_itemized_receipt > 0 ? '#d73027' : '#ce524b69',
        textAlign: 'right',
      },
    }),
  },
];

const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

const PCardReceiptsTable = (props) => {
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
      <h2 id={'pcard-compliance-days-to-reconcile-label'}>{`Table of receipts and missing receipts`}</h2>
      <ExpandableAccessibleReactTable
        data={props.data}
        columns={mainDataColumns}
        pageSize={props.data.length}
        showPagination={false}
        getTdProps={tdProps}
        getTrProps={trProps}
        tableId={'table-1'}
        ariaLabelledBy={'pcard-compliance-receipts-and-missing-receipts-label'}
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
            />
          </div>
        )
        }
      />
    </div>
  );
};

export default PCardReceiptsTable;
