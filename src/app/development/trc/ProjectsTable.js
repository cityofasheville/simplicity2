import React from 'react';
import AccessibleReactTable from 'accessible-react-table';
import Measure from 'react-measure';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import expandingRows from '../../../shared/react_table_hoc/ExpandingRows';
import createFilterRenderer from '../../../shared/FilterRenderer';

const GET_PROJECTS = gql`
  query getPermitsQuery($date_field: String!, $after: String, $permit_groups: [String]) {
    permits(date_field: $date_field, after: $after, permit_groups: $permit_groups) {
      applicant_name
      applied_date
      permit_category
      permit_description
      permit_group
      permit_number
      permit_subtype
      permit_type
      status_current
      status_date
      created_by
      building_value
      job_value
      total_project_valuation
      total_sq_feet
      fees
      paid
      balance
      invoiced_fee_total
      address
      comments {
        comment_seq_number
        comment_date
        comments
      }
    }
  }
`;

const tableHeaders = [
  'applied_date',
  'address',
  'permit_subtype',
  'status_current',
  'status_date',
  'applicant_name',
];

const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

class ProjectsTable extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (<Query
      query={GET_PROJECTS}
      variables={{
        date_field: 'applied_date',
        after: new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
        permit_groups: ['Planning'],
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return <LoadingAnimation />;
        if (error) {
          console.log(error);
          return <div>Error :( </div>;
        }

        const projectTypesArray = Object.values(this.props.projectTypes);

        const filteredData = data.permits.filter(d => {
          let typeOfInterest = false;
          projectTypesArray.forEach(type => {
            // ASSUMING THEY ARE ALL PLANNING
            if (d.permit_type === type.permit_type && d.permit_subtype === type.permit_subtype) {
              typeOfInterest = typeOfInterest || true;
            }
          })
          return typeOfInterest;
        })

        console.log(filteredData)

        return (
          <div>
            <div className="row">
              <div className="col-sm-12">
                <Measure
                  client
                  onResize={(contentRect) => {
                    console.log('on resize')
                    // this.setState({
                    //   width: contentRect.client.width,
                    // });
                  }}
                >
                  {({ measureRef }) => (
                    <ExpandableAccessibleReactTable
                      tableId="projects"
                      ariaLabel={"Table of major development projects"}
                      data={filteredData}
                      columns={[{
                        Header: 'Projects',
                        columns: tableHeaders.map(key => {
                          return {
                            Header: key.replace('_', ' '),
                            id: key,
                            accessor: d => d[key],
                            maxWidth: 120,
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
      }}
    </Query>);

  }
}

export default ProjectsTable;
