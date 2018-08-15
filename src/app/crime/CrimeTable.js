import React from 'react';
import PropTypes from 'prop-types';
import AccessibleReactTable, { CellFocusWrapper } from 'accessible-react-table';
import moment from 'moment';
import Icon from '../../shared/Icon';
import {
  IM_SHIELD3,
  IM_MAP5,
  IM_USER,
  IM_LIBRARY2,
  IM_CAR,
  IM_FENCE,
  IM_PENCIL7,
  LI_BILL_DOLLAR,
  IM_COIN_DOLLAR,
  IM_AID_KIT2,
  IM_HAMMER,
  LI_AMBULANCE,
  IM_PROFILE,
  IM_BUBBLE9,
  IM_GUN_FORBIDDEN,
} from '../../shared/iconConstants';
import { english } from './english';
import { spanish } from './spanish';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import createFilterRenderer from '../../shared/FilterRenderer';

const getIcon = (type, isExpanded) => {
  switch (type) {
    case 'MISSING PERSON REPORT':
    case 'RUNAWAY JUVENILE':
      return <Icon path={IM_USER} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'DAMAGE TO PERSONAL PROPERTY':
    case 'VANDALISM':
      return <Icon path={IM_HAMMER} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'ASSAULT - SIMPLE':
    case 'ASSAULT ON FEMALE':
    case 'ASSAULT W/DEADLY WEAPON':
      return (
        <Icon
          path={LI_AMBULANCE}
          size={24}
          viewBox="0 0 24 24"
          color={isExpanded ? '#fff' : '#4077a5'}
        />);
    case 'COMMUNICATING THREAT':
      return <Icon path={IM_BUBBLE9} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'INTIMIDATING STATE WITNESS':
    case 'PERJURY':
    case 'OBSTRUCTION OF JUSTICE':
      return <Icon path={IM_LIBRARY2} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'FRAUD':
    case 'FRAUD-CREDIT CARD':
    case 'FALSE PRETENSE - OBTAIN PROPERTY BY':
    case 'IMPERSONATE':
      return <Icon path={IM_PROFILE} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'CARRYING CONCEALED WEAPON':
      return <Icon path={IM_GUN_FORBIDDEN} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'RESIST, DELAY, OBSTRUCT OFFICER':
    case 'CIT INCIDENT':
    case 'DV ASSISTANCE OTHER':
    case 'VICTIM ASSISTANCE OTHER':
    case 'ASSAULT ON GOVERNMENT OFFICIAL':
      return <Icon path={IM_SHIELD3} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'DWI':
    case 'UNAUTHORIZED USE OF MOTOR VEHICLE':
      return <Icon path={IM_CAR} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'LARCENY OF MV OTHER':
    case 'LARCENY OF MV AUTO':
    case 'LARCENY OF MV TRUCK':
      return <Icon path={IM_CAR} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'TRESPASS':
      return <Icon path={IM_FENCE} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'INFORMATION ONLY':
      return <Icon path={IM_PENCIL7} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'DRUG PARAPHERNALIA POSSESS':
    case 'DRUG OFFENSE - FELONY':
    case 'DRUG OFFENSE - MISDEMEANOR':
    case 'DRUG PARAPHERNALIA OTHER':
      return <Icon path={IM_AID_KIT2} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    case 'COUNTERFEITING-BUYING/RECEIVING':
      return (
        <Icon
          path={LI_BILL_DOLLAR}
          viewBox="0 0 24 24"
          size={24}
          color={isExpanded ? '#fff' : '#4077a5'}
        />);
    case 'LARCENY ALL OTHER':
    case 'LARCENY FROM BUILDING':
    case 'LARCENY FROM MOTOR VEHICLE':
    case 'ROBBERY - COMMON LAW':
    case 'ROBBERY - ARMED - KNIFE':
      return <Icon path={IM_COIN_DOLLAR} size={24} color={isExpanded ? '#fff' : '#4077a5'} />;
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" height="25px" transform="translate(0,4)" version="1.1" viewBox="0 0 16 16" width="25px"><g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1"><g fill={isExpanded ? '#fff' : '#4077a5'} id="Group" transform="translate(-528.000000, -576.000000)"><path d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586" id="Oval 12 copy" /></g></g></svg>; // eslint-disable-line
  }
};

const CrimeTable = (props) => {
  let content;
  switch (props.language.language) {
    case 'Spanish':
      content = spanish;
      break;
    default:
      content = english;
  }

  const urlString = `${props.location.pathname}?entity=${props.location.query.entity}&id=${props.location.query.id}&entities=${props.location.query.entities}&label=${props.location.query.label}&within=${props.location.query.within || '660'}&during=${props.location.query.during || '183'}&hideNavbar=${props.location.query.hideNavbar}&search=${props.location.query.search}&view=map&x=${props.location.query.x}&y=${props.location.query.y}`; // eslint-disable-line

  const FilterRenderer = createFilterRenderer(content.placeholder);

  const dataColumns = [
    {
      Header: content.type,
      accessor: 'offense_long_description',
      width: 335,
      Cell: row => (
        <span>
          <span title={row.original.crime}>{getIcon(row.value, row.isExpanded)}</span>
          <span style={{ marginLeft: '5px' }}>{row.value}</span>
        </span>
      ),
      Filter: FilterRenderer,
    },
    {
      Header: content.date,
      id: 'date_occurred',
      accessor: crime => (<span>{moment.utc(crime.date_occurred).format('M/DD/YYYY')}</span>),
      width: 100,
      Filter: FilterRenderer,
      filterMethod: (filter, row) => {
        const id = filter.pivotId || filter.id;
        return row[id] !== undefined ? String(row[id].props.children).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
      },
    },
    {
      Header: content.location,
      accessor: 'address',
      minWidth: 200,
      innerFocus: true,
      Cell: row => (
        <CellFocusWrapper>
          {(focusRef, focusable) => (
            <span>
              <span>
                <a
                  title={content.click_to_crime}
                  href={[
                    urlString,
                    '&zoomToPoint=',
                    [row.original.y, row.original.x].join(','),
                  ].join('')}
                  tabIndex={focusable ? 0 : -1}
                  ref={focusRef}
                  onClick={e => e.stopPropagation()}
                >
                  <Icon path={IM_MAP5} size={23} />
                  <span style={{ marginLeft: '5px' }}>{row.value}</span>
                </a>
              </span>
            </span>
          )}
        </CellFocusWrapper>
      ),
      Filter: FilterRenderer,
    },
    {
      Header: content.case_no,
      accessor: 'case_number',
      width: props.language.language === 'Spanish' ? 125 : 95,
      Filter: FilterRenderer,
    },
    {
      Header: content.law_beat,
      accessor: 'geo_beat',
      width: 85,
      Filter: FilterRenderer,
    },
  ];

  return (
    <div>
      <div className="col-sm-12">
        {props.data.length < 1 ?
          <div className="alert alert-info">{content.no_results_found}</div>
        :
          <div style={{ marginTop: '10px' }}>
            <AccessibleReactTable
              data={props.data}
              ariaLabel={content.crimes}
              columns={dataColumns}
              showPagination={props.data.length > 20}
              defaultPageSize={props.data.length <= 20 ? props.data.length : 20}
              getTdProps={() => {
                return {
                  style: {
                    whiteSpace: 'normal',
                  },
                };
              }}
              filterable
              defaultFilterMethod={(filter, row) => {
                const id = filter.pivotId || filter.id;
                return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
              }}
            />
          </div>
        }
      </div>
    </div>
  );
};

CrimeTable.propTypes = {
  data: PropTypes.array, // eslint-disable-line
};

CrimeTable.defaultProps = {
  data: [],
};

export default withLanguage(CrimeTable);
