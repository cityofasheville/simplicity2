import React from 'react';
import PropTypes from 'prop-types';
import BarChartContainer from '../../shared/visualization/BarChartContainer';

const target_pop_keys = [
  'Veterans',
  'Chronically homeless',
  'Families and children',
];

// todo get this data from graphql
const target_pop_data = [
  {
    Year: '2005',
    'Families and children': 53,
    'Chronically homeless': 169,
    Veterans: 126,
  },
  {
    Year: '2006',
    'Families and children': 101,
    'Chronically homeless': 134,
    Veterans: 108,
  },
  {
    Year: '2007',
    'Families and children': 93,
    'Chronically homeless': 105,
    Veterans: 111,
  },
  {
    Year: '2008',
    'Families and children': 102,
    'Chronically homeless': 175,
    Veterans: 121,
  },
  {
    Year: '2009',
    'Families and children': 86,
    'Chronically homeless': 115,
    Veterans: 162,
  },
  {
    Year: '2010',
    'Families and children': 101,
    'Chronically homeless': 111,
    Veterans: 200,
  },
  {
    Year: '2011',
    'Families and children': 61,
    'Chronically homeless': 81,
    Veterans: 209,
  },
  {
    Year: '2012',
    'Families and children': 56,
    'Chronically homeless': 98,
    Veterans: 230,
  },
  {
    Year: '2013',
    'Families and children': 96,
    'Chronically homeless': 54,
    Veterans: 232,
  },
  {
    Year: '2014',
    'Families and children': 57,
    'Chronically homeless': 47,
    Veterans: 226,
  },
  {
    Year: '2015',
    'Families and children': 60,
    'Chronically homeless': 74,
    Veterans: 209,
  },
  {
    Year: '2016',
    'Families and children': 42,
    'Chronically homeless': 72,
    Veterans: 196,
  },
  // {
  //   Year: '2017',
  //   'Families and children': 57,
  //   'Chronically homeless': 83,
  //   Veterans: 239,
  // },
];

const family_situation_keys = [
  'Without children',
  'Families and children',
];

// todo get this data from graphql
const family_situation_data = [
  {
    date: '2005',
    'Families and children': 17,
    'Without children': 449,
  },
  {
    date: '2006',
    'Families and children': 31,
    'Without children': 497,
  },
  {
    date: '2007',
    'Families and children': 34,
    'Without children': 542,
  },
  {
    date: '2008',
    'Families and children': 34,
    'Without children': 407,
  },
  {
    date: '2009',
    'Families and children': 35,
    'Without children': 432,
  },
  {
    date: '2010',
    'Families and children': 40,
    'Without children': 415,
  },
  {
    date: '2011',
    'Families and children': 24,
    'Without children':  437,
  },
  {
    date: '2012',
    'Families and children': 27,
    'Without children': 451,
  },
  {
    date: '2013',
    'Families and children': 37,
    'Without children': 471,
  },
  {
    date: '2014',
    'Families and children': 25,
    'Without children': 469,
  },
  {
    date: '2015',
    'Families and children': 27,
    'Without children': 502,
  },
  {
    date: '2016',
    'Families and children': 21,
    'Without children': 467,
  },
];

const targetPopsText = ['This chart shows the breakdown among our primary demographic groupings.'];

const familyUnitsText = ['This chart shows homeless families and children compared to homeless adults.'];

class HomelessnessDemographics extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showingDefinition: this.showingDefinition };
  }

  toggleDefinition() {
    this.setState({
      showingDefinition: !this.state.showingDefinition,
    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <h3>Who is homeless?</h3>
            <p>
              The charts below present a breakdown of the major demographic groups experiencing homelessness in Buncombe County. Our area is unusual for its high concentration of homeless veterans, while we have fewer than average families with children compared to other cities in NC. Addressing the challenges of homelessness effectively requires understanding the particular needs of particular subpopulations. Our 5-year strategic plan targets the two largest groups in Buncombe County: homeless veterans and those classified as chronically homeless.&nbsp;
              <br />
              <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleDefinition()}>
                {this.state.showingDefinition ? 'Hide' : 'Show'} chronically homeless definition
              </a>
              <span hidden={!this.state.showingDefinition}>
                <br />
                <strong>Chronically Homeless</strong>: As defined by the McKinney-Vento Homeless Assistance Act (42 U.S.C. 11360(9)), is who: 1) lives in a place not meant for human habitation, a safe haven, or in an emergency shelter; and 2) Has been homeless and living as described continuously for at least 12 months or on at least four separate occasions in the last 3 years, as long as the combined occasions equal at least 12 months and each break in homelessness separating the occasions included at least 7 consecutive nights of not living in a place not meant for human habitation, a safe haven or emergency shelter. Stays in institutional care facilities for fewer than 90 days do not constitute as a break in homelessness, but rather such stays are included in the 12-month total, as long as the individual was living or residing in a place not meant for human habitation, a safe haven, or an emergency shelter immediately before entering an institutional care facility; a) An individual who has been residing in an institutional care facility, including a jail, substance abuse or mental health treatment facility, hospital, or other similar facility, for fewer than 90 days and met all of the criteria in of this definition, before entering the facility; b) A family with an adult head of household (or if there is no adult in the family, a minor head of household) who meets all of the criteria in paragraph (a) or (b) of this definition, including a family whose composition has fluctuated while the head of household has been homeless.
              </span>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <BarChartContainer chartTitle="Target populations" layout="vertical" chartText={targetPopsText} mainAxisDataKey="Year" legendHeight={20} dataKeys={this.props.targetPopKeys} colorScheme="purple_green_diverging" data={this.props.targetPopData} stacked altText="Bar chart of homelessness in target populations" />
          </div>
          <div className="col-sm-6">
            <BarChartContainer chartTitle="Family units" layout="vertical" chartText={familyUnitsText} mainAxisDataKey="date" legendHeight={20} dataKeys={this.props.familySituationKeys} colorScheme="pink_green_diverging" data={this.props.familySituationData} stacked altText="Bar chart of homelessness by family situation" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
          </div>
        </div>
      </div>
    );
  }
}

const targetPopDataShape = {
  Year: PropTypes.string,
  'Families and children': PropTypes.number,
  'Chronically homeless': PropTypes.number,
  Veterans: PropTypes.number,
};

const familySituationDataShape = {
  Year: PropTypes.number,
  'Families and children': PropTypes.number,
  'Without children': PropTypes.number,
};

HomelessnessDemographics.propTypes = {
  targetPopData: PropTypes.arrayOf(PropTypes.shape(targetPopDataShape)),
  targetPopKeys: PropTypes.arrayOf(PropTypes.string),
  familySituationData: PropTypes.arrayOf(PropTypes.shape(familySituationDataShape)),
  familySituationKeys: PropTypes.arrayOf(PropTypes.string),
  showingDescription: PropTypes.bool, // eslint-disable-line
};

HomelessnessDemographics.defaultProps = {
  targetPopData: target_pop_data,
  targetPopKeys: target_pop_keys,
  familySituationData: family_situation_data,
  familySituationKeys: family_situation_keys,
  showingDescription: false,
};

export default HomelessnessDemographics;
