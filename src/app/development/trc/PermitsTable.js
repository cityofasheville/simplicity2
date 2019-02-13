import React from 'react';
import AccessibleReactTable from 'accessible-react-table';
import Measure from 'react-measure';
import expandingRows from '../../../shared/react_table_hoc/ExpandingRows';
import createFilterRenderer from '../../../shared/FilterRenderer';

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
    display: 'Address',
  },
  {
    field: 'permit_subtype',
    display: 'Type',
  },
  {
    field: 'status_current',
    display: 'Status',
  },
  {
    field: 'applicant_name',
    display: 'Applicant',
  },
  {
    field: 'permit_number',
    display: 'Record Link',
    formatFunc: d => <a href={`/permits/${d}`}>{d}</a>
  }
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
                ariaLabel={"Table of development permits"}
                data={this.props.data}
                columns={[{
                  Header: 'Permits',
                  columns: tableHeaders.map(headerObj => {
                    return {
                      Header: headerObj.display,
                      id: headerObj.field,
                      accessor: d =>
                        headerObj.formatFunc ? headerObj.formatFunc(d[headerObj.field]) : d[headerObj.field],
                      maxWidth: maxColWidth,
                      Filter: createFilterRenderer(`Search ${headerObj.display}`),
                    }
                  }),
                }]}
                filterable
                defaultFilterMethod={(filter, row) => {
                  const id = filter.pivotId || filter.id;
                  return row[id] !== undefined ?
                    String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1
                    :
                    true;
                }}
                showPagination
                defaultPageSize={20}
                getTdProps={() => ({
                  style: {
                    whiteSpace: 'normal',
                  },
                })}
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
