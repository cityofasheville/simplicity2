import React from 'react';
import AccessibleReactTable from 'accessible-react-table';
import Measure from 'react-measure';
import ProjectDetails from './ProjectDetails';
import expandingRows from '../../shared/react_table_hoc/ExpandingRows';
import createFilterRenderer from '../../shared/FilterRenderer';


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
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <Measure
              client
              onResize={(contentRect) => {
                this.setState({
                  width: contentRect.client.width,
                });
              }}
            >
              {({ measureRef }) => (
                <ExpandableAccessibleReactTable
                  // ref={measureRef}
                  tableId="projects"
                  ariaLabel={this.state.content.capital_projects}
                  data={this.props.data}
                  columns={this.getColumns(this.props.type, this.props.subType)}
                  showPagination
                  defaultPageSize={20}
                  filterable
                  defaultFilterMethod={(filter, row) => {
                    const id = filter.pivotId || filter.id;
                    return row[id] !== undefined ?
                      String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1
                      :
                      true;
                  }}
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
                      <ProjectDetails {...row.original} hideTitle />
                    </div>
                  )}
                >
                  {(state, makeTable) => (
                    <div
                      ref={measureRef}
                      alt={[this.state.content.table_of, this.props.type, this.props.subType || '', this.state.bond_project_statuses].join(' ')}
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

export default withLanguage(ProjectsTable);
