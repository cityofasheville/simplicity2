import React from 'react';
import PropTypes from 'prop-types';
import AccessibleReactTable from 'accessible-react-table';
import createFilterRenderer from '../../../shared/FilterRenderer';
import { defaultTableHeaders } from '../utils';
import { filter } from 'd3-array';

function extractTextFromReactComponents(component) {
  if (component === null || component === undefined) {
    return '';
  }
  if (typeof component === 'string') {
    return component;
  } else if (!component.props || !component.props.children) {
    return '';
  }
  return '' + React.Children.toArray(component.props.children)
    .map(child => extractTextFromReactComponents(child)).join(' ');
}

class PermitsTable extends React.Component {
  constructor(props) {
    super(props);
    const initialFilterParams = [];

    let currentUrlParams = new URLSearchParams(window.location.search);

    for (let thisParam of currentUrlParams.entries()) {
      if (this.props.ignoredParams.indexOf(thisParam[0]) === -1) {
        initialFilterParams.push({
          id: thisParam[0],
          value: decodeURI(thisParam[1]),
        });
      }
    }

    this.state = {
      filterParams: initialFilterParams,
    };

    this.onFilterParamsChange = this.onFilterParamsChange.bind(this);
  }

  onFilterParamsChange(updatedFilterSet) {
    let currentUrlParams = new URLSearchParams(window.location.search);
    // using Array.from() and forEach because the keys() iterator alone was not hitting all params (weird)
    let currentParamKeys = Array.from(currentUrlParams.keys());

    currentParamKeys.forEach( (paramKey) => {
      if (this.props.ignoredParams.indexOf(paramKey) === -1) {
        // delete all old filter-related parameters before adding those from the updatedFilterSet (this makes sure previous but now empty filters are removed)
        currentUrlParams.delete(paramKey);
      }
    });

    if (updatedFilterSet.length > 0) {
      updatedFilterSet.forEach( filterObj => {
        currentUrlParams.set(filterObj.id, filterObj.value);
      });
    }

    if (history.pushState) {
      let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}${window.location.hash}`;
      window.history.pushState({path: newurl}, '', newurl);
    }

    this.setState({
      filterParams: updatedFilterSet,
    });
  }

  render() {
    return (
      <section title="Table of all permits, filtered by date">
        <AccessibleReactTable
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
                  headerObj.formatFunc(d) :
                  d[headerObj.field];
              },
              sortMethod: headerObj.sortMethod,
              Filter: createFilterRenderer(`Search ${headerObj.display}`),
              show: true,
            })),
          }]}
          filterable
          sortable
          defaultFilterMethod={(filter, row) => {
            const id = filter.pivotId || filter.id;
            // Allows comma separated values, makes it an OR
            const values = filter.value.split(',');
            let match = false;
            // Iterate until you get children that are text and then use those?
            const compareText = extractTextFromReactComponents(row[id]);
            values.forEach((val) => {
              match = match || (compareText !== undefined ?
                String(compareText).toLowerCase().indexOf(val.toLowerCase()) > -1
                :
                true);
            });
            return match;
          }}
          onFilteredChange={this.onFilterParamsChange}
          filtered={this.state.filterParams}
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
              style={{ marginTop: '10px' }}
            >
              {makeTable()}
            </div>
          )}
        </AccessibleReactTable>
      </section>

    );
  }
}

PermitsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  tableHeaders: PropTypes.arrayOf(PropTypes.object),
};

PermitsTable.defaultProps = {
  data: [],
  tableHeaders: defaultTableHeaders,
  ignoredParams: [],
};

export default PermitsTable;
