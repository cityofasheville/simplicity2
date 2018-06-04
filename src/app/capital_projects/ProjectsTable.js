import React from 'react';
import AccessibleReactTable from 'accessible-react-table';
import Measure from 'react-measure';
import ProjectDetails from './ProjectDetails';
import { mapProjectToCategory } from './cip_utilities';
import Icon from '../../shared/Icon';
import { IM_SHIELD3, IM_TREE, IM_HOME2, IM_BUS, LI_BOLD } from '../../shared/iconConstants';
import expandingRows from '../../shared/react_table_hoc/ExpandingRows';

const getIcon = (category, isExpanded) => {
  switch (category) {
    case 'Parks Program':
      return <Icon path={IM_TREE} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Parks & Recreation':
      return <Icon path={IM_TREE} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Transportation Program':
      return <Icon path={IM_BUS} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Transportation & Infrastructure':
      return <Icon path={IM_BUS} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Housing Program':
      return <Icon path={IM_HOME2} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Affordable Housing':
      return <Icon path={IM_HOME2} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'Public Safety':
      return <Icon path={IM_SHIELD3} size={25} color={isExpanded ? '#fff' : '#4077a5'} />;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" height="25px" transform="translate(0,4)" version="1.1" viewBox="0 0 16 16" width="25px"><g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1"><g fill={isExpanded ? '#fff' : '#4077a5'} id="Group" transform="translate(-528.000000, -576.000000)"><path d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586" id="Oval 12 copy" /></g></g></svg>;
  }
};

const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

class ProjectsTable extends React.Component {
  state = {};

  dataColumns = state => ([
    {
      Header: 'Project',
      accessor: 'display_name',
      Cell: row => (
        <span>
          <span title={mapProjectToCategory(row.original)}>{getIcon(row.original.category, row.isExpanded)}</span>
          {row.original.type === 'Bond' &&
          <span title={'Bond project'} style={{ marginLeft: '3px' }}><Icon path={LI_BOLD} size={16} color={row.isExpanded ? '#fff' : '#4077a5'} viewBox="0 0 24 24" /></span>
          }
          <span style={{ marginLeft: '5px' }}>{row.value}</span>
        </span>
      ),
      Filter: ({ filter, onChange }) => (
        <input
          onChange={event => onChange(event.target.value)}
          style={{ width: '100%' }}
          value={filter ? filter.value : ''}
          placeholder="Search..."
        />
      ),
      getProps: () => ({
        role: 'rowheader',
      }),
    },
    {
      Header: (<div>Zip code</div>),
      accessor: 'zip_code',
      maxWidth: 120,
      show: state.width >= 940,
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
      Header: (<div>Current phase</div>),
      accessor: 'status',
      Cell: row => (
        <span>
          {row.original.status === null ?
            '--'
            :
            row.original.status
          }
          {/* TODO: come and set this properly with new managed_by_city col  */}
          {/* {!row.original.show_pm_fields || row.original.status === null ?
            '--'
            :
            row.original.status
          } */}
        </span>
      ),
      maxWidth: 120,
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
      Header: (<div>Current project budget</div>),
      accessor: 'total_project_funding_budget_document',
      maxWidth: 120,
      show: state.width >= 720,
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
      Header: (<div>Spent</div>),
      id: 'spent',
      accessor: project => (!project.show_pm_fields ? '--' : ['$', parseInt(project.total_spent, 10).toLocaleString()].join('')),
      maxWidth: 120,
      show: state.width >= 720,
      Filter: ({ filter, onChange }) => (
        <input
          onChange={event => onChange(event.target.value)}
          style={{ width: '100%' }}
          value={filter ? filter.value : ''}
          placeholder="Search..."
        />
      ),
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
                  ariaLabel="Capital Projects"
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
                      alt={['Table of', this.props.type, this.props.subType || '', 'bond project statuses'].join(' ')}
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
