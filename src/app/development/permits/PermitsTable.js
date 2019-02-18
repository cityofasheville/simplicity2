import React from 'react';
import AccessibleReactTable from 'accessible-react-table';
import Measure from 'react-measure';
import expandingRows from '../../../shared/react_table_hoc/ExpandingRows';
import createFilterRenderer from '../../../shared/FilterRenderer';

const dateFormatter = d => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric'});

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
    show: (colWidth) => colWidth > 70,
  },
  {
    field: 'status_current',
    display: 'Status',
    show: (colWidth) => colWidth > 90,
  },
  {
    field: 'applicant_name',
    display: 'Applicant',
    show: (colWidth) => colWidth > 90,
  },
  {
    field: 'permit_number',
    display: 'Record Link',
    formatFunc: d => <a href={`/permits/${d}`}>{d}</a>
  }
]

const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

class ProjectsTable extends React.Component {
  constructor(props) {
    super(props);

    const { location } = props
    const filtered = []
    if (location && location.query) {
      Object.keys(location.query).forEach(key => filtered.push({ id: key, value: location.query[key] }))
    }
    this.state = {
      filtered,
    }
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
                      Filter: createFilterRenderer(`Search ${headerObj.display}`),
                      show: headerObj.show ? headerObj.show(maxColWidth) : true,
                    }
                  }),
                }]}
                filterable
                sortable
                defaultFilterMethod={(filter, row) => {
                  const id = filter.pivotId || filter.id;
                  // Allows comma separated values, makes it an OR
                  const values = filter.value.split(',');
                  let match = false;
                  values.forEach(val => {
                    match = match || (row[id] !== undefined ?
                      String(row[id]).toLowerCase().indexOf(val.toLowerCase()) > -1
                      :
                      true);
                  })
                  return match;
                }}
                onFilteredChange={filter => {
                  let newParams = '';
                  if (filter.length > 0) {
                    newParams = `?${filter
                      .map(filterObj => `${filterObj.id}=${filterObj.value}`)
                      .join('&')}`
                  }
                  history.replaceState({}, '', `${location.pathname}${newParams}${location.hash}`)
                  this.setState({
                    filtered: filter,
                  })
                }}
                filtered={this.state.filtered}
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
