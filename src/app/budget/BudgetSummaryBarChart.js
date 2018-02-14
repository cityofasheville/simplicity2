import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import BarChart from '../../shared/visualization/BarChart';
import { getBudgetSummaryDept, getBudgetSummaryUse } from './graphql/budgetQueries';

const getDollars = (value) => {
  if (Math.abs(value) > 1000000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000000).toFixed(0).toLocaleString(), ' M'].join('');
  } else if (Math.abs(value) > 1000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000).toFixed(0).toLocaleString(), ' k'].join('');
  }
  return [value < 0 ? '-$' : '$', Math.abs(value).toFixed(0).toLocaleString()].join('');
};

const getDollarsLong = value => (
  [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('')
);

const getTitle = (categoryType) => {
  switch (categoryType) {
    case 'use':
      return 'by use';
    case 'department':
      return 'by department';
    default:
      return '';
  }
};

const getLongDesc = data => (
  <div>
    {data.dataValues.map((value, index) => (
      <div key={[value.display_year, index].join('_')}>
        <p>{value.display_year}<br />
          {data.dataKeys.map(key => (
            <span key={[value.display_year, key].join('_')}>{key}: {getDollarsLong(value[key])}<br /></span>
          ))}
        </p>
      </div>
    ))}
  </div>
);


class BudgetSummaryBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingLongDesc: this.showLongDesc,
      summaryData: props.categoryType === 'use' ? props.summaryUseData : props.summaryDeptData,
    };
  }

  toggleLongDesc() {
    this.setState({
      showingLongDesc: !this.state.showingLongDesc,
    });
  }


  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-9 col-xs-offset-2">
            <h4 className="text-center">Spending {getTitle(this.props.categoryType)}</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <BarChart
              data={this.props.summaryData.dataValues}
              legendHeight={115}
              referenceArea mainAxisDataKey="display_year"
              mainReferenceAxisDataKey="yearAxisNumeric"
              referenceAreaLabels={[['Actual', 'Spent'], ['Adopted', 'Budget'], ['Proposed', 'Budget']]}
              referenceAreaExes={[500, 750, 1000]}
              barDataKeys={this.props.summaryData.dataKeys}
              secondaryTickFormatter={getDollars}
              stacked
              toolTipFormatter={getDollarsLong}
              colorScheme={this.props.colorScheme}
              domain={['dataMin', 'dataMax + 50000000']}
              altText={['Spending by', this.props.categoryType, 'bar chart'].join(' ')}
            />
            {/*<OrdinalFrame
              data={formattedData}
              axis={(
                {
                  orient: 'left',
                  tickFormat: d => d,
                  label: {
                    name: 'Count',
                    position: { anchor: 'middle' }
                  }
                }
              )}
              projection={this.props.layout}
              type='bar'
              oLabel={true}
              oAccessor={this.props.mainAxisDataKey}
              oPadding={10}
              rAccessor='value'
              style={d => ({fill: d.color})}
              pieceHoverAnnotation={true}
              // title={this.props.chartTitle}
              tooltipContent={(d) =>
                `${this.props.mainAxisDataKey[0].toUpperCase()+ this.props.mainAxisDataKey.slice(1)}: ${d.data[this.props.mainAxisDataKey]}, ${d.data.label}: ${d.data.value}`
              }
              legend={{
                width: 40,
                legendGroups: [
                  {
                    styleFn: d => ({fill: d.color}),
                    items: formattedData.map(d => ({label: d.label, color: d.color}))
                      .filter((item, pos, thisArray) => thisArray
                        .findIndex(d => d.label === item.label && d.color === item.color) === pos)
                  }
                ]
              }}
              // max margin should be 1/5 of chart size
              //
              // TODO: determine margin by length of longest label and remsize
              margin={{right: 100}}
            /> */}
          </div>
          <span className="pull-right" style={{ fontSize: '12px' }}>Barchart totals exclude interfund transfers</span>
        </div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-2">
            <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleLongDesc()}>
              {this.state.showingLongDesc ? 'Hide' : 'Show'} spending {getTitle(this.props.categoryType)} bar chart summary
            </a>
            <div hidden={!this.state.showingLongDesc}>
              {getLongDesc(this.state.summaryData)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BudgetSummaryBarChart.propTypes = {
  categoryType: PropTypes.string,
  colorScheme: PropTypes.string,
  budgetSummary: PropTypes.object, // eslint-disable-line
  showLongDesc: PropTypes.bool, // eslint-disable-line
};

BudgetSummaryBarChart.defaultProps = {
  categoryType: 'use',
  colorScheme: 'bright_colors',
  showLongDesc: false,
};

//not that efficient...
export default compose(
  graphql(getBudgetSummaryDept, {
    props: ({ data: { budgetSummaryDept } }) => ({
      summaryDeptData: budgetSummaryDept,
    }),
  }),
  graphql(getBudgetSummaryUse, {
    props: ({ data: { budgetSummaryUse } }) => ({
      summaryUseData: budgetSummaryUse,
    }),
  }),
)(BudgetSummaryBarChart);
