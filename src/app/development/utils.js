import React from 'react';
import moment from 'moment';
import TypePuck from './trc/TypePuck';
import { getTRCTypeFromPermit } from './trc/utils';

export const statusTranslation = [
  {
    accelaSpeak: 'Application Submitted',
    statusText: 'The applicant has submitted an application to the City, but we haven\'t started reviewing it yet.',
  },
  {
    accelaSpeak: 'Application Received',
    statusText: 'The applicant has submitted an application to the City, but we haven\'t started reviewing it yet.',
  },
  {
    accelaSpeak: 'CC Issued',
    statusText: '',
  },
  {
    accelaSpeak: 'City Council Review',
    statusText: 'The Planning & Zoning Commission has completed review of the project and the next step is a public hearing before City Council.',
  },
  {
    accelaSpeak: 'Closed',
    statusText: '',
  },
  {
    accelaSpeak: 'CO Issued',
    statusText: 'This project is complete and has been approved for occupancy.',
  },
  {
    accelaSpeak: 'Expired',
    statusText: 'This project was approved, but too much time has passed since that approval and the approval has now expired.',
  },
  {
    accelaSpeak: 'Finaled',
    statusText: 'This project is complete and has been approved for occupancy.',
  },
  {
    accelaSpeak: 'Issued',
    statusText: 'This project has been approved and the City has issued permits to begin construction.',
  },
  {
    accelaSpeak: 'Master Plan Approved',
    statusText: 'City Council has approved this project. The next step is for the developer to submit detailed applications for development permits.',
  },
  {
    accelaSpeak: 'Partial Issued',
    statusText: 'Some permits have been issued by the City for this project.',
  },
  {
    accelaSpeak: 'Pending Applicant Action',
    statusText: 'The City has asked the applicant for more information and is waiting for the applicant to submit.',
  },
  {
    accelaSpeak: 'Plan Check',
    statusText: 'City staff is reviewing this plan for compliance with local, state, and/or federal standards.',
  },
  {
    accelaSpeak: 'Pre-Application Complete',
    statusText: '',
  },
  {
    accelaSpeak: 'Pre-Application Received',
    statusText: '',
  },
  {
    accelaSpeak: 'Reissued',
    statusText: 'This project has been approved and the City has issued permits to begin construction.',
  },
  {
    accelaSpeak: 'Revision in Review',
    statusText: 'The applicant has submitted new plans and City staff is reviewing those plans.',
  },
  {
    accelaSpeak: 'Revoked',
    statusText: '',
  },
  {
    accelaSpeak: 'TCC Issued',
    statusText: 'This project has been approved for occupancy.',
  },
  {
    accelaSpeak: 'TCO Issued',
    statusText: 'This project has been approved for occupancy.',
  },
  {
    accelaSpeak: 'TRC Review',
    statusText: 'City staff is reviewing this plan for compliance with local, state, and/or federal standards.',
  },
  {
    accelaSpeak: 'Under Review',
    statusText: 'City staff is reviewing this plan for compliance with local, state, and/or federal standards.',
  },
  {
    accelaSpeak: 'Withdrawn',
    statusText: 'The applicant has asked the City to stop reviewing this project.',
  },
];

export const defaultTableHeaders = [
  {
    field: 'applied_date',
    display: 'Date Applied',
    formatFunc: d => moment.utc(new Date(d.applied_date)).format('MMM DD, YYYY'),
  },
  {
    field: 'address',
    display: 'Address',
  },
  {
    field: 'permit_type',
    display: 'Type',
    formatFunc: (d) => {
      const trcType = getTRCTypeFromPermit(d);
      if (!trcType) {
        let returnString = d.permit_type;
        if (d.permit_subtype !== 'NA') {
          returnString += `: ${d.permit_subtype}`;
        }
        if (d.permit_category !== 'NA') {
          returnString += `: ${d.permit_category}`;
        }
        return returnString;
      }
      return (<div>
        <span style={{ marginRight: '1em' }}>{trcType.id}</span>
        <div style={{ verticalAlign: 'middle', display: 'inline-block', float: 'right' }}>
          <TypePuck
            typeObject={trcType}
            size={30}
            hover={false}
          />
        </div>
      </div>);
    },
  },
  {
    field: 'status_current',
    display: 'Status',
  },
  {
    field: 'application_name',
    display: 'Project',
  },
  {
    field: 'permit_number',
    display: 'Record Link',
    formatFunc: d => <a href={`/permits/${d.permit_number}`}>{d.permit_number}</a>,
  },
];
