import React from 'react';
import { getZoningLink } from '../../address/zoning';
import TypePuck from '../trc/TypePuck';
import Icon from '../../../shared/Icon';
import {
  IM_WATER,
  IM_TINT,
  IM_RECYCLE,
  IM_HOME2,
  IM_CITY,
  IM_LANDMARK,
  IM_MONUMENT,
  IM_FISH,
} from '../../../shared/iconConstants';
import { trcProjectTypes } from '../utils';

export const permitFieldFormats = [
  {
    accelaLabel: 'Aquatic Buffer',
    displayGroup: 'environment details',
    displayLabel: null,
    formatFunc: d => (d === 'No' ? null : (
      <span className="permit-icon-boolean">
        <Icon path={IM_WATER} viewBox="0 0 576 512" />Aquatic buffer located on this property
      </span>)
    ),
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
      return (
        <span className="permit-icon-boolean">
          <Icon path={IM_TINT} viewBox="0 0 352 512" />{text}
        </span>
      );
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
    formatFunc: d => (d === 'No' ? null : (
      <span className="permit-icon-boolean">
        <Icon path={IM_RECYCLE} viewBox="0 0 512 512" />Seeking LEED certification
      </span>)
    ),
  },
  {
    accelaLabel: 'Address',
    displayGroup: 'project details',
    displayLabel: 'Address',
    formatFunc: (d, permit) => (permit.civic_address_id ?
      (<a href={`/address?id=${permit.civic_address_id}`}>{d}</a>) :
      d
    ),
  },
  {
    accelaLabel: 'Permit Subtype',
    displayGroup: 'project details',
    displayLabel: 'Type of permit review',
    formatFunc: (d, permit) => {
      if (!permit.trcType) {
        return d;
      }
      return (
        <div>
          <TypePuck
            typeObject={permit.trcType}
            size={30}
            hover={false}
          />
          <span style={{ padding: '0 0 0 1rem' }}>
            {permit.trcType.id}
          </span>
        </div>
      );
    },
  },
  {
    accelaLabel: 'Plans Folder Location',
    displayGroup: 'project details',
    displayLabel: 'Site plans and documents',
    formatFunc: d => (<a href={d} target="_blank" rel="noopener noreferrer">Documents folder</a>),
    description: 'Google Drive folder link to view documents',
  },
  {
    accelaLabel: 'Subdivision Number',
    displayGroup: 'project details',
    displayLabel: 'Number of lots to be created',
    formatFunc: d => (+d > 0 ? `${d} lots` : null),
  },
  {
    accelaLabel: 'Total Property Size',
    displayGroup: 'project details',
    displayLabel: 'Total property size',
    formatFunc: d => (+d > 0 ? `${d} acres` : null),
  },
  {
    accelaLabel: 'Affordable Housing',
    displayGroup: 'project details',
    displayLabel: null,
    formatFunc: d => (d === 'No' ? null : (
      <span className="permit-icon-boolean">
        <Icon path={IM_HOME2} />Affordable housing proposed
      </span>
    )),
  },
  {
    accelaLabel: 'Number of Units',
    displayGroup: 'project details',
    displayLabel: 'Number of residential units',
    formatFunc: d => (+d > 0 ? `${d} units` : null),
  },
  {
    accelaLabel: 'Permit Number',
    displayGroup: 'project details',
    displayLabel: 'Application Number',
    formatFunc: (d, permit) => {
      const splitCap = permit.internal_record_id.split('-');
      return (
        <a
          href={`https://services.ashevillenc.gov/CitizenAccess/Cap/CapDetail.aspx?Module=Planning&TabName=Planning&capID1=${splitCap[0]}&capID2=${splitCap[1]}&capID3=${splitCap[2]}&agencyCode=ASHEVILLE`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {d}
        </a>
    )},
  },
  {
    accelaLabel: 'Contact',
    displayGroup: 'project details',
    displayLabel: 'Contact',
  },
  {
    accelaLabel: 'Zoning District',
    displayGroup: 'zoning details',
    displayLabel: 'Zoning district',
    formatFunc: d => d.split(',').filter(z => z.length > 0).map((zone, i) => (
      <a
        href={getZoningLink(zone) || undefined}
        target="_blank"
        rel="noopener noreferrer"
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
    formatFunc: d => (d.length > 0 ? d.join(', ') : null),
    description: 'Minimum distance required between the front, rear, side, or corner property line and structures',
  },
  {
    accelaLabel: 'DTDR Overlay',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => (d === 'No' ? null : (
      <span className="permit-icon-boolean">
        <Icon path={IM_CITY} />Central business district
      </span>
    )),
  },
  {
    accelaLabel: 'HRC Overlay',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => (d === 'No' ? null : (
      <span className="permit-icon-boolean">
        <Icon path={IM_LANDMARK} viewBox="0 0 512 512" />Historic district
      </span>
    )),
  },
  {
    accelaLabel: 'River District',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => (d === 'No' ? null : (
      <span className="permit-icon-boolean">
        <Icon path={IM_FISH} viewBox="0 0 576 512" />River district
      </span>
    )),
  },
  {
    accelaLabel: 'Landmark',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => (d === 'No' ? null : (
      <span className="permit-icon-boolean">
        <Icon path={IM_MONUMENT} viewBox="0 0 384 512" />Historic landmark
      </span>
    )),
  },
];
