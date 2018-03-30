import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { accessibility } from 'accessible-react-table';
import moment from 'moment';
import DetailsFormGroup from '../../shared/DetailsFormGroup';
import Icon from '../../shared/Icon';
import { IM_MAP5 } from '../../shared/iconConstants';

const dataColumns = [
  {
    Header: 'Contractor name(s)',
    accessor: 'contractor_name',
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
    Header: 'License Number(s)',
    accessor: 'contractor_license_number',
    Filter: ({ filter, onChange }) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        placeholder="Search..."
      />
    ),
  },
];

const getContractorData = (contractors, licenses) => {
  const allContractorData = [];
  for (let index = 0; index < contractors.length; index += 1) {
    allContractorData.push({
      contractor_name: contractors[index],
      contractor_license_number: licenses[index],
    });
  }
  return allContractorData;
};

const DevelopmentDetail = (props) => {
  const contractorData = getContractorData(props.data.contractor_names, props.data.contractor_license_numbers);
  const AccessibleReactTable = accessibility(ReactTable);
  return (
    <div>
      {props.standalone &&
        <div className="row">
          <div className="col-sm-12">
            <h1><button className="btn btn-primary pull-right">Back</button>{props.data.applicant_name}</h1>
            <h2>{props.data.address}</h2>
            <h3>About this permit</h3>
          </div>
        </div>
      }
      <div className="row">
        <div className="col-sm-12" style={{ marginTop: '15px' }}>
          <fieldset>
            <div className="row">
              <div className="col-sm-12">
                <DetailsFormGroup label="Description" name="permit_description" value={props.data.permit_description} hasLabel />
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <div className="col-xs-12" style={{ marginBottom: '10px' }}>
                    <a href={['https://www.google.com/maps/?q=', [props.data.y, props.data.x].join(',')].join('')} target="_blank" title="Click to view address in Google maps">
                      <span style={{ marginRight: '5px' }}><Icon path={IM_MAP5} size={20} /></span>
                      <label htmlFor="address" style={{ cursor: 'pointer' }}>Address</label>
                    </a>
                    <div style={{ marginLeft: '15px' }} name="address">{props.data.address}</div>
                  </div>
                </div>
                <DetailsFormGroup label="Permit group" name="permit_group" value={props.data.permit_group} hasLabel />
                <DetailsFormGroup label="Updated date" name="status_date" value={moment.utc(props.data.status_date).format('M/DD/YYYY')} hasLabel />
              </div>
              <div className="col-sm-6">
                <DetailsFormGroup label="Civic address id" name="civic_address_id" value={props.data.civic_address_id} hasLabel />
                <DetailsFormGroup label="Permit subtype" name="permit_subtype" value={props.data.permit_subtype} hasLabel />
              </div>
            </div>
            <div style={{ marginRight: '10px', marginLeft: '10px' }}>
              <AccessibleReactTable
                ariaLabel="Contractors"
                data={contractorData}
                columns={dataColumns}
                showPagination={contractorData.length > 5}
                defaultPageSize={contractorData.length <= 5 ? contractorData.length : 5}
                filterable={contractorData.length > 5}
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
            {props.data.comments.length > 0 &&
              <div alt={['Table of comments'].join(' ')} style={{ marginTop: '10px', marginRight: '10px', marginLeft: '10px' }}>
                <AccessibleReactTable
                  ariaLabel="Comments"
                  data={props.data.comments}
                  getTdProps={(state, rowInfo) => {
                    return {
                      style: {
                        whiteSpace: 'normal',
                      },
                    };
                  }}
                  columns={
                  [{
                    Header: 'Date',
                    id: 'comment_date',
                    width: 125,
                    accessor: comment => (<span>{moment.utc(comment.comment_date).format('M/DD/YYYY')}</span>),
                    Filter: ({ filter, onChange }) => (
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        value={filter ? filter.value : ''}
                        placeholder="Search..."
                      />
                    ),
                  }, {
                    Header: 'Comments',
                    accessor: 'comments',
                    minWidth: 400,
                    Filter: ({ filter, onChange }) => (
                      <input
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        value={filter ? filter.value : ''}
                        placeholder="Search..."
                      />
                    ),
                  }]
                  }
                  showPagination={props.data.comments.length > 5}
                  defaultPageSize={props.data.comments.length <= 5 ? props.data.comments.length : 5}
                  filterable={props.data.comments.length > 5}
                  defaultFilterMethod={(filter, row) => {
                    const id = filter.pivotId || filter.id;
                    return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
                  }}
                />
              </div>
            }
          </fieldset>
        </div>
      </div>
    </div>
  );
};


const permitDataShape = {
  permit_number: PropTypes.string,
  permit_type: PropTypes.string,
  permit_group: PropTypes.string,
  applicant_name: PropTypes.string,
  applied_date: PropTypes.date,
  permit_subtype: PropTypes.string,
  status_date: PropTypes.date,
  contractor_name: PropTypes.string,
  comments: PropTypes.array,
};

DevelopmentDetail.propTypes = {
  standalone: PropTypes.bool,
  data: PropTypes.shape(permitDataShape).isRequired, // eslint-disable-line react/forbid-prop-types
};

export default DevelopmentDetail;
