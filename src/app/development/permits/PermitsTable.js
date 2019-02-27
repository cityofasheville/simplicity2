import React from 'react';
import PropTypes from 'prop-types';
import AccessibleReactTable from 'accessible-react-table';
import Measure from 'react-measure';
import moment from 'moment';
import expandingRows from '../../../shared/react_table_hoc/ExpandingRows';
import createFilterRenderer from '../../../shared/FilterRenderer';


const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

class PermitsTable extends React.Component {
  constructor(props) {
    super(props);
    // TODO: USE WINDOW.LOCATION INSTEAD OF REACT ROUTER LOCATION?
    // https://medium.com/@ivantsov/using-react-router-and-history-38c021270829

    const filtered = [];
    if (window.location.search) {
      const queryParams = window.location.search.slice(1).split('&');
      queryParams.forEach((param) => {
        const keyVal = param.split('=');
        filtered.push({
          id: keyVal[0],
          value: keyVal[1],
        });
      });
    }

    this.state = {
      filtered,
    };

    this.onFilteredChange = this.onFilteredChange.bind(this);
  }

  onFilteredChange(filter) {
    let newParams = '';
    if (filter.length > 0) {
      newParams = `${filter
        .map(filterObj => `${filterObj.id}=${filterObj.value}`)
        .join('&')}`;
    }
    window
      .history
      .pushState(
        {},
        '',
        `${location.pathname}${newParams.length > 0 ? '?' : ''}${newParams}${location.hash}`
      );
    this.setState({
      filtered: filter,
    });
  }

  render() {
    const maxColWidth = document.documentElement.clientWidth / (this.props.tableHeaders.length + 2);
    return (<div>
      <div className="row">
        <div className="col-sm-12">
          <Measure
            client
          >
            {({ measureRef }) => (
              <ExpandableAccessibleReactTable
                className="-striped"
                tableId="projects"
                ariaLabel="Table of development permit applications"
                data={this.props.data}
                columns={[{
                  Header: 'Permits',
                  columns: this.props.tableHeaders.map(headerObj => ({
                    Header: headerObj.display,
                    id: headerObj.field,
                    accessor: (d) => {
                      return headerObj.formatFunc ?
                        headerObj.formatFunc(d[headerObj.field]) :
                        d[headerObj.field];
                    },
                    Filter: createFilterRenderer(`Search ${headerObj.display}`),
                    show: headerObj.show ? headerObj.show(maxColWidth) : true,
                  })),
                }]}
                filterable
                sortable
                defaultFilterMethod={(filter, row) => {
                  const id = filter.pivotId || filter.id;
                  // Allows comma separated values, makes it an OR
                  const values = filter.value.split(',');
                  let match = false;
                  values.forEach((val) => {
                    match = match || (row[id] !== undefined ?
                      String(row[id]).toLowerCase().indexOf(val.toLowerCase()) > -1
                      :
                      true);
                  });
                  return match;
                }}
                onFilteredChange={this.onFilteredChange}
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

PermitsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  tableHeaders: PropTypes.arrayOf(PropTypes.object),
};

PermitsTable.defaultProps = {
  data: [],
  tableHeaders: [
    {
      field: 'applied_date',
      display: 'Date Applied',
      formatFunc: d => moment.utc(new Date(d)).format('MMM DD, YYYY'),
    },
    {
      field: 'address',
      display: 'Address',
    },
    {
      field: 'permit_subtype',
      display: 'Type',
      show: colWidth => colWidth > 70,
    },
    {
      field: 'status_current',
      display: 'Status',
      show: colWidth => colWidth > 90,
    },
    {
      field: 'applicant_name',
      display: 'Applicant',
      show: colWidth => colWidth > 90,
    },
    {
      field: 'permit_number',
      display: 'Record Link',
      formatFunc: d => <a href={`/permits/${d}`}>{d}</a>,
    },
  ],
};

export default PermitsTable;
