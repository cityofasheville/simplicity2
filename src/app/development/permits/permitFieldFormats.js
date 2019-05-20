import React from 'react';
import moment from 'moment';
import { getZoningLink } from '../../address/zoning';
import Icon from '../../../shared/Icon';
import { IM_WATER, IM_TINT } from '../../../shared/iconConstants';

const dateFormatter = inputDate => moment(new Date(inputDate)).format('MM/DD/YYYY');

export const permitFieldFormats = [
  {
    accelaLabel: 'Aquatic Buffer',
    displayGroup: 'environment details',
    displayLabel: null,
    formatFunc: d => d === 'No' ? null : <span><Icon path={IM_WATER} viewBox="0 0 576 512"/>Aquatic buffer located on this property</span>,
  },
  {
    accelaLabel: 'Flood Plain',
    displayGroup: 'environment details',
    displayLabel: null,
    formatFunc: (d) => {
      let text = 'Floodplain located on this property';
      if (d[0] === 'X') {
        return null;
      } else if (d === 'Floodway') {
        text = 'Floodway and floodplain located on this property';
      }
      // If it isn't no
      return <span><Icon path={IM_TINT} viewBox="0 0 352 512"/>{text}</span>;
    },
  },
  {
    accelaLabel: 'Percent Slope',
    displayGroup: 'environment details',
    displayLabel: 'Average slope of the property',
    formatFunc: d => `${Math.round(+d)}%`,
  },
  {
    accelaLabel: 'Max Elevation',
    displayGroup: 'environment details',
    displayLabel: 'Maximum elevation of the property',
    formatFunc: d => `${Math.round(+d)} feet`,
  },
  {
    accelaLabel: 'Seeking LEED Certification',
    displayGroup: 'environment details',
    displayLabel: null,
    formatFunc: d => d === 'No' ? null : 'Seeking LEED certification',
  },
  {
    accelaLabel: 'Permit Subtype',
    displayGroup: 'project details',
    displayLabel: 'Type of permit review',
    formatFunc: (d, permit) => permit.trcType ? permit.trcType.id : d,
  },
  {
    accelaLabel: 'Plans Folder Location',
    displayGroup: 'project details',
    displayLabel: 'Site plans and documents',
    formatFunc: d => (<a href={d} target='_blank' rel='noopener noreferrer'>Documents folder</a>),
    description: 'Google Drive folder link to view documents',
  },
  {
    accelaLabel: 'Subdivision Number',
    displayGroup: 'project details',
    displayLabel: 'Number of lots to be created',
    formatFunc: d => `${d} lots`,
  },
  {
    accelaLabel: 'Total Property Size',
    displayGroup: 'project details',
    displayLabel: 'Total property size',
    formatFunc: d => `${d} acres`,
  },
  {
    accelaLabel: 'Affordable Housing',
    displayGroup: 'project details',
    displayLabel: null,
    formatFunc: d => d === 'No' ? null : 'Affordable housing proposed',
  },
  {
    accelaLabel: 'Number of Units',
    displayGroup: 'project details',
    displayLabel: 'Number of residential units',
    formatFunc: d => `${d} units`,
  },
  {
    accelaLabel: 'Permit Number',
    displayGroup: 'project details',
    displayLabel: 'Record ID',
  },
  {
    accelaLabel: 'Zoning District',
    displayGroup: 'zoning details',
    displayLabel: 'Zoning district',
    formatFunc: d => d.split(',').filter(z => z.length > 0).map((zone, i) => (
      <a
        href={getZoningLink(zone) || undefined}
        target='_blank'
        rel='noopener noreferrer'
        key={zone}
      >
        {`${i > 0 ? ', ' : ''}${zone}`}
      </a>
    )),
  },
  {
    // This is a combined field from corner, side, and rear-- see formatted permit transoformations in render func
    accelaLabel: 'Setbacks',
    displayGroup: 'zoning details',
    displayLabel: 'Setbacks',
    formatFunc: d => d.length > 0 ? d.join(', ') : null,
    description: 'Minimum distance required between the front, rear, side, or corner property line and structures',
  },
  {
    accelaLabel: 'DTDR Overlay',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => d === 'No' ? null : 'Central business district',
  },
  {
    accelaLabel: 'HRC Overlay',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => d === 'No' ? null : 'Historic district',
  },
  {
    accelaLabel: 'River District',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => d === 'No' ? null : 'River district',
  },
  {
    accelaLabel: 'Landmark',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => d === 'No' ? null : 'Historic landmark',
  }
];
