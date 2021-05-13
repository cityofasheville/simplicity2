import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AccessibleReactTable, { CellFocusWrapper } from 'accessible-react-table';
import EmailDownload from '../../shared/EmailDownload';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import Map from '../../shared/visualization/Map';
import {
  getBoundsFromStreetData,
  formatMaintenanceData,
  getBounds,
  createMaintenanceLegend,
} from '../../utilities/mapUtilities';
import Icon from '../../shared/Icon';
import { IM_MAP5 } from '../../shared/iconConstants';
import createFilterRenderer from '../../shared/FilterRenderer';

const getMaintenanceInfo = (entity, comma) => {
  if (entity === null) {
    return <div>No information available{comma ? ',' : ''}</div>;
  }
  if (entity === 'CITY OF ASHEVILLE') {
    return (
      <CellFocusWrapper>
        {(focusRef, focusable) => (
          // TODO this needs to be converted to widget with its own keyboard nav or split into
          // a separate column for the report button.
          <div>
            <span>
              <a
                href="http://www.ashevillenc.gov/departments/street_services/maintenance.htm"
                target="_blank"
                ref={focusRef}
                tabIndex={focusable ? 0 : -1}
              >
                {entity}
              </a>
            </span>
            <span style={{ marginLeft: '10px' }}>
              <a
                href="http://www.ashevillenc.gov/departments/it/online/service_requests.htm"
                target="_blank"
                tabIndex="-1"
              >
                <button className="btn btn-xs btn-warning">Report with the Asheville App</button>
              </a>
            </span>
          </div>
        )}
      </CellFocusWrapper>
    );
  }
  if (entity === 'NCDOT') {
    return (
      <CellFocusWrapper>
        {(focusRef, focusable) => (
          <div>
            <span>
              <a
                href="https://apps.ncdot.gov/contactus/Home/PostComment?Unit=PIO"
                target="_blank"
                tabIndex={focusable ? 0 : -1}
                ref={focusRef}
              >
                {entity}
              </a>
              {comma ? ',' : ''}
            </span>
          </div>
        )}
      </CellFocusWrapper>
    );
  }
  return <div>{entity}{comma ? ',' : ''}</div>;
};

const FilterRenderer = createFilterRenderer('Search...');

const MaintenanceByStreet = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }

  const urlString = [
    props.location.pathname,
    '?entity=',
    props.location.query.entity,
    '&id=',
    props.location.query.id,
    '&entities=',
    props.location.query.entities,
    '&label=',
    props.location.query.label,
    '&hideNavbar=',
    props.location.query.hideNavbar,
    '&search=',
    props.location.query.search,
    '&view=map',
  ].join('');

  const dataColumns = [
    {
      Header: 'Centerline ID',
      accessor: 'centerline_id',
      innerFocus: true,
      Cell: row => (
        <CellFocusWrapper>
          {(focusRef, focusable) => (
            <span>
              <span>
                <a
                  title="Click to centerline in map"
                  href={[
                    urlString,
                    '&bounds=',
                    JSON.stringify(getBounds(row.original.line)),
                  ].join('')}
                  tabIndex={focusable ? 0 : -1}
                  ref={focusRef}
                >
                  <Icon path={IM_MAP5} size={23} />
                  <span style={{ marginLeft: '5px' }}>{parseInt(row.value, 10)}</span>
                </a>
              </span>
            </span>
          )}
        </CellFocusWrapper>
      ),
      Filter: FilterRenderer,
    },
    {
      Header: 'Maintenance Entities',
      accessor: 'maintenance_entities',
      innerFocus: true,
      Cell: row => (
        <span>
          {
            row.original.maintenance_entities.map((item, index) => (
              <div key={index}>
                {getMaintenanceInfo(
                  item,
                  row.original.maintenance_entities.length > 1
                  && index < row.original.maintenance_entities.length - 1
                )}
              </div>))
          }
        </span>
      ),
      Filter: FilterRenderer,
      filterMethod: (filter, row) => {
        const joinedInfo = row._original.maintenance_entities.join('');
        return row._original !== undefined ? joinedInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
      },
    },
  ];

  return (
    <div className="row">
      <div className="col-sm-12">
        <EmailDownload downloadData={props.data.streets} fileName="maintenance_by_street.csv" />
      </div>
      <div className="col-sm-12">
        <div id="listView" hidden={props.location.query.view !== 'list'} style={{ marginTop: '10px' }}>
          <AccessibleReactTable
            ariaLabel="Street Maintenance"
            data={props.data.streets}
            columns={dataColumns}
            showPagination={props.data.streets.length > 20}
            defaultPageSize={props.data.streets.length <= 20 ? props.data.streets.length : 20}
            filterable
            defaultFilterMethod={(filter, row) => {
              const id = filter.pivotId || filter.id;
              return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
            }}
            getTdProps={(state, rowInfo) => {
              return {
                style: {
                  whiteSpace: 'normal',
                },
              };
            }}
          />
        </div>

        <div id="mapView" hidden={props.location.query.view === 'list'}>
          {props.data.streets.length === 0 || props.location.query.view === 'list' ?
            <div className="alert alert-info">No results found</div>
            :
            <Map legend={createMaintenanceLegend(formatMaintenanceData(props.data.streets))} maintenanceData={formatMaintenanceData(props.data.streets)} drawMaintenance bounds={props.location.query.bounds !== undefined & props.location.query.bounds !== '' ? JSON.parse(props.location.query.bounds) : getBoundsFromStreetData(props.data.streets)} />
          }
        </div>
      </div>
    </div>
  );
};

const getMaintenanceQuery = gql`
  query getMaintenanceQuery($centerline_ids: [Float]) {
    streets (centerline_ids: $centerline_ids) {
      centerline_id
        left_zipcode
        right_zipcode
        maintenance_entities
        line {
          x
          y
        }
    }    
  }
`;

const MaintenanceByStreetGQL = graphql(getMaintenanceQuery, {
  options: ownProps => ({
    variables: {
      centerline_ids: ownProps.location.query.id.trim().split(',').map(x=>+x),
    },
  }),
})(MaintenanceByStreet);

export default MaintenanceByStreetGQL;
