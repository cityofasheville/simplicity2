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
    }
  }
`;

const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

class ProjectsTable extends React.Component {
  constructor() {
    super();
  }

  dataColumns = () => ([
    {
      Header: this.state.content.project,
      accessor: 'display_name',
      Cell: row => (
        <span>
          <span title={row.original.category}>{getIcon(row.original.category, row.isExpanded)}</span>
          {row.original.type === 'Bond' &&
          <span title={content.bond_project} style={{ marginLeft: '3px' }}><Icon path={LI_BOLD} size={16} color={row.isExpanded ? '#fff' : '#4077a5'} viewBox="0 0 24 24" /></span>
          }
          <span style={{ marginLeft: '5px' }}>{row.value}</span>
        </span>
      ),
      Filter: createFilterRenderer(this.state.content.search),
      getProps: () => ({
        role: 'rowheader',
      }),
    },
    {
      Header: (<div>{this.state.content.zip_code}</div>),
      accessor: 'zip_code',
      maxWidth: 120,
      show: this.state.width >= 940,
      Filter: createFilterRenderer(this.state.content.search),
    },
    {
      Header: (<div>{this.state.content.phase}</div>),
      accessor: 'status',
      Cell: row => (
        <span>
          {row.original.status === null ?
            '--'
            :
            row.original.status
          }
        </span>
      ),
      maxWidth: 120,
      Filter: createFilterRenderer(this.state.content.search),
    },
    {
      Header: (<div>{this.state.content.budget}</div>),
      accessor: 'total_project_funding_budget_document',
      maxWidth: 120,
      show: this.state.width >= 720,
      Filter: createFilterRenderer(this.state.content.search),
    },
    {
      Header: (<div>{this.state.content.under_contract}</div>),
      id: 'encumbured',
      accessor: project => ['$', parseInt(project.encumbered, 10).toLocaleString()].join(''),
      maxWidth: 120,
      show: this.state.width >= 720,
      style: { textAlign: 'right' },
      Filter: createFilterRenderer(this.state.content.search),
    },
    {
      Header: (<div>{this.state.content.spent}</div>),
      id: 'spent',
      accessor: project => ['$', parseInt(project.total_spent, 10).toLocaleString()].join(''),
      maxWidth: 120,
      show: this.state.width >= 720,
      Filter: createFilterRenderer(this.state.content.search),
    },
  ]);

  getColumns = (type, subType) => {
    if (type === 'Transportation') {
      return [{
        Header: subType,
        columns: this.dataColumns(this.state),
      }];
    }
    return [{
      Header: type,
      columns: this.dataColumns(this.state),
    }];
  };

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
                        Header: '???',
                        columns: Object.keys(filteredData[0]).map(key => {
                          console.log(key)
                          // todo: get comments and deal with them appropriately
                          // they are an object
                          return {
                            Header: key,
                            id: key,
                            accessor: key,
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
