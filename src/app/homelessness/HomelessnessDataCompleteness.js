import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import PieChart from '../../shared/visualization/PieChart';

const UDEOnly = [
  {
    name: 'A',
    value: 19,
  },
  {
    name: 'B',
    value: 5,
  },
  {
    name: 'C',
    value: 3,
  },
];

const AdditionalOnly = [
  {
    name: 'A',
    value: 25,
  },
  {
    name: 'B',
    value: 1,
  },
  {
    name: 'C',
    value: 1,
  },
];

const HUDVerificationOnly = [
  {
    name: 'A',
    value: 24,
  },
  {
    name: 'B',
    value: 1,
  },
  {
    name: 'F',
    value: 2,
  },
];

const overall = [
  {
    name: 'A',
    value: 21,
  },
  {
    name: 'B',
    value: 3,
  },
  {
    name: 'C',
    value: 2,
  },
  {
    name: 'F',
    value: 1,
  },
];

const dataColumns = [
  {
    header: 'Organization',
    accessor: 'name',
    minWidth: 400,
  },
  {
    header: 'UDE ONLY',
    columns: [
      {
        header: '%',
        accessor: 'ude_percent',
      },
      {
        header: 'Grade',
        accessor: 'ude_grade',
      },
    ],
  },
  {
    header: 'Additional ONLY',
    columns: [
      {
        header: '%',
        accessor: 'additional_percent',
      },
      {
        header: 'Grade',
        accessor: 'additional_grade',
      },
    ],
  },
  {
    header: 'HUD Verification ONLY',
    columns: [
      {
        header: '%',
        accessor: 'HUD_percent',
      },
      {
        header: 'Grade',
        accessor: 'HUD_grade',
      },
    ],
  },
  {
    header: 'OVERALL',
    columns: [
      {
        header: '%',
        accessor: 'percent',
      },
      {
        header: 'Grade',
        accessor: 'grade',
      },
    ],
  },
];

const dataForTable = [
  {
    name: 'Asheville Buncombe Community Christian Ministries - Buncombe County - Rapid Rehousing - ESG(5231)',
    ude_percent: '100.00%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '100.00%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - Pathways to Permanent Housing Extreme Needs 2  - HUD(4727)',
    ude_percent: '100.00%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '100.00%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - SSVF Prevention(5760)',
    ude_percent: '100.00%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '100.00%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - Smoky Mountain Center Shelter + Care Asheville/Bunc - HUD(5229)',
    ude_percent: '99.86%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '99.91%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - Bridge To Recovery S+C - HUD(5390)',
    ude_percent: '99.82%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '99.88%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - HOME TBRA Asheville - HUD(4435)',
    ude_percent: '99.71%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '99.81%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - HOME HPRP Buncombe - HUD(5194)',
    ude_percent: '99.64%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '99.76%',
    grade: 'A',
  },
  {
    name: 'Asheville Buncombe Community Christian Ministries - Veterans Restoration Quarters PSH(4550)',
    ude_percent: '99.60%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '99.74%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - Pathways HACA - HUD(1218)',
    ude_percent: '98.94%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '99.31%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - Rapid Rehousing - ESG(5196)',
    ude_percent: '98.65%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '93.46%',
    HUD_grade: 'B',
    percent: '97.83%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - Pathways to Permanent Housing Extreme Needs 3 - HUD(4728)',
    ude_percent: '98.41%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '98.98%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - Pathways to Permanent Housing Extreme Needs - HUD(5786)',
    ude_percent: '98.25%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '98.87%',
    grade: 'A',
  },
  {
    name: 'Housing Authority City of Asheville - Buncombe County - VASH - HUD(2193)',
    ude_percent: '97.11%',
    ude_grade: 'A',
    additional_percent: '97.36%',
    additional_grade: 'A',
    HUD_percent: '99.70%',
    HUD_grade: 'A',
    percent: '97.66%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - SSVF RRH(5761)',
    ude_percent: '96.49%',
    ude_grade: 'A',
    additional_percent: '98.93%',
    additional_grade: 'A',
    HUD_percent: '99.11%',
    HUD_grade: 'A',
    percent: '97.39%',
    grade: 'A',
  },
  {
    name: 'Asheville Buncombe Community Christian Ministries -Veteran\'s Restoration Quarters (Transitional) GPD(407)',
    ude_percent: '95.98%',
    ude_grade: 'A',
    additional_percent: '99.88%',
    additional_grade: 'A',
    HUD_percent: '99.17%',
    HUD_grade: 'A',
    percent: '97.25%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - AHOPE Literally Homeless - HUD(1219)',
    ude_percent: '95.94%',
    ude_grade: 'A',
    additional_percent: '99.31%',
    additional_grade: 'A',
    HUD_percent: '97.58%',
    HUD_grade: 'A',
    percent: '96.81%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - Room In The Inn - HUD(1225)',
    ude_percent: '95.81%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '99.07%',
    HUD_grade: 'A',
    percent: '97.10%',
    grade: 'A',
  },
  {
    name: 'Asheville Buncombe Community Christian Minstries - NC 501 - SSVF Homeless Prevention - VA(5534)',
    ude_percent: '95.78%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '98.39%',
    HUD_grade: 'A',
    percent: '96.98%',
    grade: 'A',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - The Independence Project - Private(5323)',
    ude_percent: '95.24%',
    ude_grade: 'A',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '96.89%',
    grade: 'A',
  },
  {
    name: 'Salvation Army of Asheville - Buncombe County - Center of Hope Shelter - ESG(901)',
    ude_percent: '93.03%',
    ude_grade: 'B',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '99.82%',
    HUD_grade: 'A',
    percent: '95.47%',
    grade: 'A',
  },
  {
    name: 'FIRST at Blue Ridge - Buncombe County - Vets First Program - GPD(4713)',
    ude_percent: '92.68%',
    ude_grade: 'B',
    additional_percent: '99.17%',
    additional_grade: 'A',
    HUD_percent: '99.26%',
    HUD_grade: 'A',
    percent: '95.09%',
    grade: 'A',
  },
  {
    name: 'Asheville Buncombe Community Christian Ministries - NC 501 - SSVF Rapid Rehousing - VA(5529)',
    ude_percent: '93.18%',
    ude_grade: 'B',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '96.15%',
    HUD_grade: 'A',
    percent: '94.93%',
    grade: 'B',
  },
  {
    name: 'Asheville Buncombe Community Chrisitan Ministries - Buncombe County - Steadfast Home - VA(408)',
    ude_percent: '92.15%',
    ude_grade: 'B',
    additional_percent: '96.96%',
    additional_grade: 'A',
    HUD_percent: '97.09%',
    HUD_grade: 'A',
    percent: '93.90%',
    grade: 'B',
  },
  {
    name: 'CARING for Children - Asheville - Basic Center Shelter (RHYMIS)(2845)',
    ude_percent: '88.02%',
    ude_grade: 'C',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '92.58%',
    grade: 'B',
  },
  {
    name: 'Homeward Bound of WNC - Buncombe County - PATH Street Outreach (PATH)(5100)',
    ude_percent: '90.37%',
    ude_grade: 'B',
    additional_percent: '90.67%',
    additional_grade: 'B',
    HUD_percent: '77.47%',
    HUD_grade: 'F',
    percent: '88.03%',
    grade: 'C',
  },
  {
    name: 'CARING for Children - Asheville - TLP (RHYMIS)(2844)',
    ude_percent: '83.58%',
    ude_grade: 'C',
    additional_percent: '100.00%',
    additional_grade: 'A',
    HUD_percent: '100.00%',
    HUD_grade: 'A',
    percent: '89.81%',
    grade: 'C',
  },
  {
    name: 'Pisgah Legal Services - Buncombe County - SOAR(4763)',
    ude_percent: '85.91%',
    ude_grade: 'C',
    additional_percent: '87.98%',
    additional_grade: 'C',
    HUD_percent: '39.12%',
    HUD_grade: 'F',
    percent: '77.74%',
    grade: 'F',
  }
];

const HomelessnessDataCompleteness = (props) => {
  return (
    <div>
      <div className="row">
        <div className="col-sm-6">
          <PieChart data={overall} altText="UDE ONLY pie chart" chartTitle="Overall Grade" doughnut />
        </div>
        <div className="col-sm-6">
          <PieChart data={UDEOnly} altText="UDE ONLY pie chart" chartTitle="UDE ONLY Grade" />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <PieChart data={AdditionalOnly} altText="Additional ONLY pie chart" chartTitle="Additional ONLY Grade" doughnut />
        </div>
        <div className="col-sm-6">
          <PieChart data={HUDVerificationOnly} altText="HUD Verification ONLY pie chart" chartTitle="HUD Verification ONLY Grade" />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-12">
          <h3>Data Completeness Report Card Summary Table</h3>
          <div alt="Data Completeness Report Card Summary Table">
            <ReactTable
              data={dataForTable}
              columns={dataColumns}
              defaultPageSize={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomelessnessDataCompleteness;
