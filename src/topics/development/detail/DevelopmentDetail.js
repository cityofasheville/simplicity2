import React from 'react';
import DetailsGrouping from '../../../components/DetailsGrouping';

const DevelopmentDetail = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1><button className="btn btn-primary pull-right">Back</button>{props.PermitName}</h1>
        <h2>{props.PermitAddress}</h2>
        <h3>About this permit</h3>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-6">
        <fieldset className="detailsFieldset">
          <DetailsGrouping dataLabels={['Description']} dataValues={[props.PermitDescription]} colWidth={12} />
          <DetailsGrouping dataLabels={Object.keys(props.data)} dataValues={Object.values(props.data)} colWidth={6} />
        </fieldset>
      </div>
      <div className="col-sm-6">
        <fieldset className="detailsFieldset">
          <DetailsGrouping hasTitle hasTitleIcon title={'Comments'} titleIcon={'comment'} dataValues={props.comments} />
        </fieldset>
      </div>
    </div>
  </div>
);

const permitDataShape = {
  'Permit #': React.PropTypes.string,
  'Permit type': React.PropTypes.string,
  'Permit group': React.PropTypes.string,
  Status: React.PropTypes.string,
  'Applicant name': React.PropTypes.string,
  'Applied date': React.PropTypes.date,
  'Permit subtype': React.PropTypes.string,
  'Permit category': React.PropTypes.string,
  'Updated date': React.PropTypes.date,
  Contractor: React.PropTypes.string,
  'License #': React.PropTypes.string,
};

DevelopmentDetail.propTypes = {
  PermitDescription: React.PropTypes.string,
  PermitName: React.PropTypes.string,
  PermitAddress: React.PropTypes.string,
  data: React.PropTypes.shape(permitDataShape).isRequired, // eslint-disable-line react/forbid-prop-types
  comments: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

// TODO - this is temporary dummy data
DevelopmentDetail.defaultProps = {
  PermitName: 'ASHEVILLE ART MUSEUM EXPANSION AND RENOVATION',
  PermitAddress: '12 Main Street, Apt 4, 20001',
  PermitDescription: 'ASHEVILLE ART MUSEUM EXPANSION AND RENOVATION ASHEVILLE ART MUSEUM EXPANSION AND RENOVATION ASHEVILLE ART MUSEUM EXPANSION AND RENOVATION',
  data: {
    'Permit #': '1234567879',
    'Permit type': 'Residential',
    'Permit group': 'Residential',
    Status: 'Issued',
    'Applicant name': 'Billy Contractor',
    'Applied date': '01/01/2001',
    'Permit subtype': 'Permit subtype',
    'Permit category': 'Planning Level I',
    'Updated date': '02/02/2001',
    Contractor: 'Billy Contractor Contractorson',
    'License #': '1234A-123',
  },
  comments: [
    'Comment Date: Mon May 02 15:29:34 EDT 2016 - REC APPLICATION FOR A LEVEL 1 ZONING. ADVISED BY CHRIS COLLINS TO JUST ATTACH IN THE DOCUMENTS. (KLA);',
    'Comment Date: Fri DEC 16, 11:12:48 EST 2016 - Per Chris, the project will follow the Level II review process. Either the scope of work has changed or was not clear in the LEvel I zoning submittal.',
  ],
};

export default DevelopmentDetail;
