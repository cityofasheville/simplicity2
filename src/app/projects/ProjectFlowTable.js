import React from 'react';
import ReactTable from 'react-table';
import moment from 'moment';

//const parseNotes = (notes) => {
  // this function could be improved for matching with the 'Eastern Standard Time' string - 
  // now if anyone writes a date in their comment itself it will separate it to a new line
  // also other parsing
//   const re = /(\d+)(\/)(\d+)(?:\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/g;
//   const indices = [];
//   let result;
//   while (result = re.exec(notes)) {
//     indices.push(re.lastIndex - result[0].length);
//   }
//   let start = 0;
//   let end = 0;
//   const parsedNotes = [];
//   for (let i = 0; i < indices.length; i += 1) {
//     if (i === indices.length - 1) {
//       end = notes.length;
//     } else {
//       end = indices[i + 1];
//     }
//     parsedNotes.push({ note: notes.substring(start, end) });
//     start = end;
//   }
//   return parsedNotes;
// };

const dataColumns = [
  {
    Header: 'ID',
    accessor: 'ID',
    width: 100,
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },
  {
    Header: 'Summary',
    accessor: 'Summary',
    minWidth: 250,
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },
  {
    Header: 'Requested Date',
    id: 'RequestedDate',
    accessor: item => (<span>{moment.utc(item.RequestedDate).format('M/DD/YYYY')}</span>),
    width: 115,
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },
  {
    Header: 'Requestor',
    accessor: 'Requestor',
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },  
  {
    Header: 'Priority',
    accessor: 'Priority',
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },
  {
    Header: 'Status',
    accessor: 'CurrentStatus',
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },
];

const ProjectFlowTable = props => (
  <div>
    <div className="col-sm-12">
      {props.data.length < 1 ?
        <div className="alert alert-info">No results found</div>
      :
        <div alt={['Table of development'].join(' ')} style={{ marginTop: '10px' }} id={props.id}>
          <ReactTable
            data={props.data}
            columns={dataColumns}
            showPagination={props.data.length > 8}
            defaultPageSize={props.data.length <= 8 ? props.data.length : 8}
            filterable
            defaultFilterMethod={(filter, row) => {
              const id = filter.pivotId || filter.id;
              return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
            }}
            getTdProps={(state, rowInfo) => {
              return {
                style: {
                  whiteSpace: 'normal',
                },
              };
            }}
          />
        </div>
      }
    </div>
  </div>
);

export default ProjectFlowTable;
