import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import CIPFilter from './CIPFilter';
import CategoryDetails from './CategoryDetails';
import { longCategory } from './cip_utilities';
import PageHeader from '../../shared/PageHeader';
import Icon from '../../shared/Icon';
import { IM_CITY } from '../../shared/iconConstants';

const CapitalProjectsSummary = (props) => {
  const selectedArr = [];
  const getSelected = () => {
    if (props.location.query.selected === undefined) {
      return [];
    } else if (props.location.query.selected.length === 0) {
      return selectedArr;
    }
    const selected = props.location.query.selected.split(',');
    for (let category of selected) {
      const longName = longCategory(category);
      if (!selectedArr.includes(longName)) {
        selectedArr.push(longName);
      }
    }
    return selectedArr;
  };

  return (  
    <div>
    <PageHeader h1="Capital Projects" externalLinkText="View the City&apos;s General Capital Improvement Plan (CIP)" externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=28348#page=146" dataLinkPath="/capital_projects/data" icon={<Icon path={IM_CITY} size={60} />}>
      <span>You can search geographically AND by address:</span>
      <br></br>
      <a className="" href="http://arcg.is/Sy5KC" target="_blank">
        Try our Project Map 
      </a>   
    </PageHeader>          
    <CIPFilter selected={getSelected()} location={props.location} />
    <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
    <CategoryDetails location={props.location} categories={getSelected()} />
    </div>
  );
};

CapitalProjectsSummary.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default CapitalProjectsSummary;
