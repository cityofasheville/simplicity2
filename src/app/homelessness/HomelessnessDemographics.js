import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import BarChartContainer from '../../shared/visualization/BarChartContainer';

const historical_pit = [
  {
    Year: '2005',
    // 'Adults without children': ,
    // 'In a household with at least one adult and one child': ,
    // 'In a household with only children': ,
    Veteran: 126,
    'Not a Veteran': 376,
    'Chronically homeless': 169,
    'Not chronically homeless': 333,
    Total: 502,
  },
  {
    Year: '2006',
    // 'Adults without children': ,
    // 'In a household with at least one adult and one child': ,
    // 'In a household with only children': ,
    Veteran: 108,
    'Not a Veteran': 490,
    'Chronically homeless': 134,
    'Not chronically homeless': 464,
    Total: 598,
  },
  {
    Year: '2007',
    // 'Adults without children':,
    // 'In a household with at least one adult and one child': ,
    // 'In a household with only children': ,
    Veteran: 111,
    'Not a Veteran': 542,
    'Chronically homeless': 105,
    'Not chronically homeless': 530,
    Total: 635,
  },
  {
    Year: '2008',
    // 'Adults without children': ,
    // 'In a household with at least one adult and one child': ,
    // 'In a household with only children': ,
    Veteran: 121,
    'Not a Veteran': 388,
    'Chronically homeless': 175,
    'Not chronically homeless': 334,
    Total: 509,
  },
  {
    Year: '2009',
    // 'Adults without children': ,
    // 'In a household with at least one adult and one child': ,
    // 'In a household with only children': ,
    Veteran: 162,
    'Not a Veteran': 356,
    'Chronically homeless': 115,
    'Not chronically homeless': 403,
    Total: 518,
  },
  {
    Year: '2010',
    'Adults without children': 415,
    'In a household with at least one adult and one child': 101,
    'In a household with only children': 0,
    Veteran: 200,
    'Not a Veteran': 316,
    'Chronically homeless': 111,
    'Not chronically homeless': 405,
    Total: 516,
  },
  {
    Year: '2011',
    'Adults without children': 443,
    'In a household with at least one adult and one child': 61,
    'In a household with only children': 10,
    Veteran: 209,
    'Not a Veteran': 289,
    'Chronically homeless': 81,
    'Not chronically homeless': 417,
    Total: 498,
  },
  {
    Year: '2012',
    'Adults without children': 457,
    'In a household with at least one adult and one child': 94,
    'In a household with only children': 9,
    Veteran: 230,
    'Not a Veteran': 293,
    'Chronically homeless': 98,
    'Not chronically homeless': 425,
    Total: 523,
  },
  {
    Year: '2013',
    'Adults without children': 474,
    'In a household with at least one adult and one child': 92,
    'In a household with only children': 4,
    Veteran: 232,
    'Not a Veteran': 338,
    'Chronically homeless': 54,
    'Not chronically homeless': 516,
    Total: 570,
  },
  {
    Year: '2014',
    'Adults without children': 473,
    'In a household with at least one adult and one child': 52,
    'In a household with only children': 5,
    Veteran: 226,
    'Not a Veteran': 307,
    'Chronically homeless': 47,
    'Not chronically homeless': 486,
    Total: 533,
  },
  {
    Year: '2015',
    'Adults without children': 502,
    'In a household with at least one adult and one child': 52,
    'In a household with only children': 8,
    Veteran: 206,
    'Not a Veteran': 356,
    'Chronically homeless': 74,
    'Not chronically homeless': 488,
    Total: 562,
  },
  {
    Year: '2016',
    'Adults without children': 467,
    'In a household with at least one adult and one child': 37,
    'In a household with only children': 5,
    Veteran: 196,
    'Not a Veteran': 313,
    'Chronically homeless': 72,
    'Not chronically homeless': 437,
    Total: 509,
  },
  {
    Year: '2017',
    // 'Adults without children': ,
    // 'In a household with at least one adult and one child': ,
    // 'In a household with only children': ,
    Veteran: 239,
    'Not a Veteran': 323,
    'Chronically homeless': 83,
    'Not chronically homeless': 479,
    Total: 562,
  },
];

const family_keys = [
  'Adults without children',
  'In a household with at least one adult and one child',
  'In a household with only children',
];

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
  'Adults without children',
  'Families and children',
];

// todo get this data from graphql
const family_situation_data = [
  {
    date: '2005',
    'Families and children': 17,
    'Adults without children': 449,
  },
  {
    date: '2006',
    'Families and children': 31,
    'Adults without children': 497,
  },
  {
    date: '2007',
    'Families and children': 34,
    'Adults without children': 542,
  },
  {
    date: '2008',
    'Families and children': 34,
    'Adults without children': 407,
  },
  {
    date: '2009',
    'Families and children': 35,
    'Adults without children': 432,
  },
  {
    date: '2010',
    'Families and children': 40,
    'Adults without children': 415,
  },
  {
    date: '2011',
    'Families and children': 24,
    'Adults without children':  437,
  },
  {
    date: '2012',
    'Families and children': 27,
    'Adults without children': 451,
  },
  {
    date: '2013',
    'Families and children': 37,
    'Adults without children': 471,
  },
  {
    date: '2014',
    'Families and children': 25,
    'Adults without children': 469,
  },
  {
    date: '2015',
    'Families and children': 27,
    'Adults without children': 502,
  },
  {
    date: '2016',
    'Families and children': 21,
    'Adults without children': 467,
  },
];

const targetPopsText = ['This chart shows the breakdown among the primary demographic groupings.'];

const familyUnitsText = ['This chart shows how many homeless individuals were single adults and how many were in households including children by year.'];

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
              Our community is unusual for its high concentration of homeless Veterans, while we have fewer than average families with children compared to other cities in NC. Addressing the challenges of homelessness effectively requires understanding the particular needs of particular subpopulations. Our <a className="inText" href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27777" target="_blank">Five Year Strategic Plan</a> targets the two largest sub-populations in Buncombe County: homeless Veterans and those defined as chronically homeless by the US Department of Housing and Urban Development (HUD).
              <br />
              <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleDefinition()}>
                {this.state.showingDefinition ? 'Hide' : 'Show'} chronically homeless definition
              </a>
              <span hidden={!this.state.showingDefinition}>
                <br />
                <strong>Chronically Homeless</strong>: As defined since January 15, 2016, a person who is chronically homeless is one who lives in a place not meant for human habitation or in an emergency shelter and has been homeless as described continuously for at least 12 months or on at least four separate occasions in the last 3 years meets that description, as long as the combined occasions total at least 12 months and have a disability (42 U.S.C. 11360(9)). In the past 10 years, there have been several changes to the definition of chronically homeless by US Department of Housing and Urban Devlopment (HUD).
              </span>
            </p>
            <p>View the <Link to="/homelessness/veterans" className="inText">Veterans page</Link> to see detailed information about homeless Veterans.</p>
          </div>
        </div>
        <div className="row" style={{ marginBottom: '10px' }}>
          <div className="col-sm-6">
            <BarChartContainer chartTitle="Families and children" layout="vertical" mainAxisDataKey="Year" legendHeight={60} dataKeys={family_keys} colorScheme="bright_colors" data={historical_pit} stacked altText="Bar chart of families" />
          </div>
          <div className="col-sm-6">
            <p>
              <br />
              <br />
              The graphs on this page reflect the literally homeless as defined by HUD. The Public education systems operate under a different definition of homelessness that includes individuals who lack a fixed, regular, and adequate nighttime residence. This includes what is commonly referred to as ‘doubled-up’ – 2 or more families living in the same unit, often because of economic hardship. The public school systems track this data for the community and it can be viewed at the following links: <a href="http://www.ashevillecityschools.net/pages/Asheville_City_Schools/Student_Services/Education_for_Homeless_Childre" target="_blank" className="inText">Asheville City Schools homelessness information</a> and <a href="https://buncombeschools.org/cms/One.aspx?portalId=92531&pageId=255538" target="_blank" className="inText">Buncombe County Schools homelessness information</a>.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <BarChartContainer chartTitle="Veterans" layout="vertical" mainAxisDataKey="Year" legendHeight={20} dataKeys={['Veteran', 'Not a Veteran']} colorScheme="bright_colors_2" data={historical_pit} stacked altText="Bar chart of homeless Veterans" />
          </div>
          <div className="col-sm-6">
            <BarChartContainer chartTitle="Chronically homeless" layout="vertical" mainAxisDataKey="Year" legendHeight={20} dataKeys={['Chronically homeless', 'Not chronically homeless']} colorScheme="bright_colors" data={historical_pit} stacked altText="Bar chart of chronically homeless individuals" />
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
  'Adults without children': PropTypes.number,
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
