import React from 'react';
import DetailsGrouping from '../../../components/DetailsGrouping';

const permitObjectFiltered = (data) => {
  const copy = Object.assign({}, data);
  delete copy.Address;
  delete copy.PermitDescription;
  delete copy.PermitName;
  return copy;
};

const DevelopmentDetail = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1><button className="btn btn-primary pull-right">Back</button>{props.data.PermitName}</h1>
        <h2>{props.data.Address}</h2>
        <h3>About this permit</h3>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-6">
        <fieldset className="detailsFieldset">
          <DetailsGrouping dataLabels={['Description']} dataValues={[props.data.PermitDescription]} colWidth={12} />
          <DetailsGrouping dataLabels={Object.keys(permitObjectFiltered(props.data))} dataValues={Object.values(permitObjectFiltered(props.data))} colWidth={6} />
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
  PermitDescription: React.PropTypes.string,
  PermitType: React.PropTypes.string,
  PermitSubtype: React.PropTypes.string,
  AppliedDate: React.PropTypes.date,
  UpdatedDate: React.PropTypes.date,
  PermitNum: React.PropTypes.string,
  PermitCategory: React.PropTypes.string,
  Address: React.PropTypes.string,
  PermitGroup: React.PropTypes.string,
  PermitName: React.PropTypes.string,
  CurrentStatus: React.PropTypes.string,
  LicenseNumber: React.PropTypes.string,
  Contractor: React.PropTypes.string,
};

DevelopmentDetail.propTypes = {
  data: React.PropTypes.shape(permitDataShape).isRequired, // eslint-disable-line react/forbid-prop-types
  comments: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

// TODO - this is temporary dummy data
DevelopmentDetail.defaultProps = {
  data: { PermitDescription: 'ASHEVILLE ART MUSEUM EXPANSION AND RENOVATION ASHEVILLE ART MUSEUM EXPANSION AND RENOVATION ASHEVILLE ART MUSEUM EXPANSION AND RENOVATION', PermitName: 'ASHEVILLE ART MUSEUM EXPANSION AND RENOVATION', PermitType: 'Residential', PermitSubType: 'Permit subtype', AppliedDate: '01/01/2001', PermitNum: '1234567879', PermitCategory: 'Planning Level I', Address: '12 Main Street, Apt 4, 20001', PermitGroup: 'Residential', UpdatedDate: '02/02/2001', CurrentStatus: 'Issued', LicenseNumber: '1234A-123', Contractor: 'Bob Jones' },
  comments: ['Comment Date: Mon May 02 15:29:34 EDT 2016 - REC APPLICATION FOR A LEVEL 1 ZONING. ADVISED BY CHRIS COLLINS TO JUST ATTACH IN THE DOCUMENTS. (KLA);', 'Comment Date: Fri DEC 16, 11:12:48 EST 2016 - Per Chris, the project will follow the Level II review process. Either the scope of work has changed or was not clear in the LEvel I zoning submittal.'],
};

export default DevelopmentDetail;
