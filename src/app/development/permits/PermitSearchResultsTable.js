import React from 'react';

import AccessibleReactTable from 'accessible-react-table';
import createFilterRenderer from '../../../shared/FilterRenderer';

function PermitSearchResultsTable({ data }) {

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

  const tableHeaders = [
    {
        "field": "applied_date",
        "display": "Date Applied"
    },
    {
        "field": "address",
        "display": "Address"
    },
    {
        "field": "permit_type",
        "display": "Type"
    },
    {
        "field": "status_current",
        "display": "Status"
    },
    {
        "field": "application_name",
        "display": "Project"
    },
    {
        "field": "permit_number",
        "display": "Record Link"
    }
  ];

  return (
    <section title="Table of all permits, filtered by date">
      <AccessibleReactTable
        className="-striped"
        tableId="projects"
        ariaLabel="Table of development permit applications"
        data={data}
        columns={[{
          Header: 'Permits',
          columns: tableHeaders.map(headerObj => ({
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
        // onFilteredChange={this.onFilterParamsChange}
        // filtered={this.state.filterParams}
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

export default PermitSearchResultsTable;