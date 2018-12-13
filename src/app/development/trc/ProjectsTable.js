import React from 'react';
import AccessibleReactTable from 'accessible-react-table';
import Measure from 'react-measure';
import expandingRows from '../../../shared/react_table_hoc/ExpandingRows';

const dateFormatter = d => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric'});

// TODO: ADD APPROPRIATE COLOR BASED ON PROJECT TYPE
const tableHeaders = [
  {
    field: 'applied_date',
    display: 'Date Applied',
    formatFunc: dateFormatter,
  },
  {
    field: 'address',
    display: 'Project Address',
  },
  {
    field: 'permit_subtype',
    display: 'Project Type',
  },
  {
    field: 'status_current',
    display: 'Current Status',
  },
  {
    field: 'status_date',
    display: 'Date Last Updated',
    formatFunc: dateFormatter,
  },
  {
    field: 'applicant_name',
    display: 'Applicant',
  },
];

const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

class ProjectsTable extends React.Component {
  constructor() {
    super();
  }

  render() {
    const maxColWidth = document.documentElement.clientWidth / (tableHeaders.length + 2);
    return (<div>
      <div className="row">
        <div className="col-sm-12">
          <Measure
            client

          >
            {({ measureRef }) => (
              <ExpandableAccessibleReactTable
                tableId="projects"
                ariaLabel={"Table of major development projects"}
                data={this.props.data}
                columns={[{
                  Header: 'Projects',
                  columns: tableHeaders.map(headerObj => {
                    return {
                      Header: headerObj.display,
                      id: headerObj.field,
                      accessor: d =>
                        headerObj.formatFunc ? headerObj.formatFunc(d[headerObj.field]) : d[headerObj.field],
                      maxWidth: maxColWidth,
                    }
                  }),
                }]}
                showPagination
                defaultPageSize={20}
                getTdProps={() => ({
                  style: {
                    whiteSpace: 'normal',
                  },
                })}
                getTrProps={(state, rowInfo) => ({
                  style: {
                    cursor: 'pointer',
                    background: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#4077a5' : 'none',
                    color: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '#fff' : '',
                    fontWeight: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? 'bold' : 'normal',
                    fontSize: rowInfo !== undefined && Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) && state.expanded[rowInfo.viewIndex] ? '1.2em' : '1em',
                  },
                })}
                SubComponent={row => (
                  <div style={{
                    paddingLeft: '34px',
                    paddingRight: '34px',
                    paddingBottom: '15px',
                    backgroundColor: '#f6fcff',
                    borderRadius: '0px',
                    border: '2px solid #4077a5',
                  }}
                  >
                    Project details go here!
                  </div>
                )}
              >
                {(state, makeTable) => (
                  <div
                    ref={measureRef}
                    alt={'???'}
                    style={{ marginTop: '10px' }}
                  >
                    {makeTable()}
                  </div>
                )}
              </ExpandableAccessibleReactTable>
            )}
          </Measure>
        </div>
      </div>
    </div>);
  }
}

export default ProjectsTable;
