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

export const permitFieldFormats = [
  {
    accelaLabel: 'Aquatic Buffer',
    displayGroup: 'environment details',
    displayLabel: null,
    formatFunc: d => (d === 'Yes' ? (
      <span className="permit-icon-boolean">
        <Icon path={IM_WATER} viewBox="0 0 576 512" />Aquatic buffer located on this property
      </span>) : null
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
    formatFunc: d => (d === 'Yes' ? (
      <span className="permit-icon-boolean">
        <Icon path={IM_RECYCLE} viewBox="0 0 512 512" />Seeking LEED certification
      </span>) : null
    ),
  },
  {
    accelaLabel: 'address',
    displayGroup: 'project details',
    displayLabel: 'Address',
    formatFunc: (d, permit) => (permit.civic_address_id ?
      (<a href={`/address?id=${permit.civic_address_id}`}>{d}</a>) :
      d
    ),
  },
  {
    accelaLabel: 'permit_subtype',
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
            <a href="/development/major#types" target="_blank" rel="noopener noreferrer">{permit.trcType.id}</a>
          </span>
        </div>
      );
    },
  },
  {
    accelaLabel: 'Plans Folder Location',
    displayGroup: 'project details',
    displayLabel: 'Site plans and documents',
    formatFunc: d => (d && d.length > 0 ? <a href={d} target="_blank" rel="noopener noreferrer">documents folder</a> : null),
    description: 'Google Drive folder link to view documents',
  },
  {
    accelaLabel: 'Subdivision Number of Lots',
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
    formatFunc: d => (d === 'Yes' ? (
      <span className="permit-icon-boolean">
        <Icon path={IM_HOME2} />Affordable housing proposed
      </span>) : null
    ),
  },
  {
    accelaLabel: 'Number of Units',
    displayGroup: 'project details',
    displayLabel: 'Number of residential units',
    formatFunc: d => (+d > 0 ? `${d} units` : null),
  },
  {
    accelaLabel: 'permit_number',
    displayGroup: 'project details',
    displayLabel: 'Application Number',
    formatFunc: (d, permit) => {
      const splitCap = permit.internal_record_id.split('-'); 
      return (
        <a
          href={`https://services.ashevillenc.gov/CitizenAccess/Cap/GlobalSearchResults.aspx?isNewQuery=yes&QueryText=${permit.permit_number}`}
          target="_blank"
          rel="noopener noreferrer"
        >
        {d}
        </a>
      );
    },
  },
  {
    accelaLabel: 'technical_contact_email',
    displayGroup: 'project details',
    displayLabel: 'Contact',
    formatFunc: (d, permit) => {
      if (!d && !permit.trcType) {
        // If there isn't a staff email address and we shouldn't direct to POD
        // (Don't have people email POD about random small potatoes permits)
        return null;
      }
      let emailLinkText = d;
      if (permit.trcType && !d) {
        emailLinkText = 'pod@ashevillenc.gov';
      }
      return (
        <a
          href={`mailto:${emailLinkText}?subject=Inquiry from SimpliCity user about ${permit.permit_number}`}
        >
          {emailLinkText}
        </a>
      );
    },
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
    accelaLabel: 'setbacks',
    displayGroup: 'zoning details',
    displayLabel: 'Setbacks',
    formatFunc: d => (d.length > 0 ? d.join(', ') : null),
    description: 'Minimum distance required between the front, rear, side, or corner property line and structures',
  },
  {
    accelaLabel: 'DTDR Overlay',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => (d === 'Yes' ? (
      <span className="permit-icon-boolean">
        <Icon path={IM_CITY} />Central business district
      </span>) : null
    ),
  },
  {
    accelaLabel: 'HRC Overlay',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => (d === 'Yes' ? (
      <span className="permit-icon-boolean">
        <Icon path={IM_LANDMARK} viewBox="0 0 512 512" />Historic district
      </span>) : null
    ),
  },
  {
    accelaLabel: 'River District',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => (d === 'Yes' ? (
      <span className="permit-icon-boolean">
        <Icon path={IM_FISH} viewBox="0 0 576 512" />River district
      </span>) : null
    ),
  },
  {
    accelaLabel: 'Landmark',
    displayGroup: 'zoning details',
    displayLabel: null,
    formatFunc: d => (d === 'Yes' ? (
      <span className="permit-icon-boolean">
        <Icon path={IM_MONUMENT} viewBox="0 0 384 512" />Historic landmark
      </span>) : null
    ),
  },
];
