import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import Icon from '../../../shared/Icon';
import { IM_OFFICE } from '../../../shared/iconConstants';
import { getAverageCounts } from './SLA_utilities';
import PageHeader from '../../../shared/PageHeader';
import ButtonGroup from '../../../shared/ButtonGroup';
import Button from '../../../shared/Button';
import BarChart from '../../../shared/visualization/BarChart';
import LineGraph from '../../../shared/visualization/LineGraph';
import { query } from './SLADashboardQueries';
import LoadingAnimation from '../../../shared/LoadingAnimation';

const DevelopmentSLADashboard = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <p>{props.data.error.message}</p>; // eslint-disable-line react/prop-types
  }
  const aggregateData = getAverageCounts(props.data.firstReviewSLASummary);
  return (
    <div>
      <PageHeader h1="Development Services SLA Dashboard" icon={<Icon path={IM_OFFICE} size={30} />}>
        <ButtonGroup>
          <Button onClick={browserHistory.goBack}>Back</Button>
        </ButtonGroup>
      </PageHeader>
      {
        props.tasks.map((task, index) => (
          <div key={[task, index].join('_')}>
            <div className="row" >
              <h3>{task} (First Plan Review)</h3>
              <div className="col-md-6">
                <LineGraph
                  annotations={[
                    {
                      type: 'y',
                      label: '85%',
                      value: 85,
                      x: 1,
                      color: 'green',
                      disable: ['connector'],
                    }
                  ]}
                  chartTitle="Percentage meeting SLA"
                  data={aggregateData[task]}
                  dataKeys={[[task, 'Met SLA Percent'].join(' ')]}
                  altText={['Line chart of percentage of records meeting SLA for ', task].join(' ')}
                  mainAxisDataKey="displayDate"
                  toolTipFormatter={value => ([value, '%'].join(''))}
                  data={aggregateData[task]} margin={{ right: 34 }}
                  colorScheme="bright_colors"
                />
              </div>
              <div className="col-md-6">
                <BarChart
                  chartTitle="Volume"
                  mainAxisDataKey="displayDate"
                  dataKeys={[[task, 'Past SLA'].join(' '), [task, 'Met SLA'].join(' ')]}
                  data={aggregateData[task]}
                  altText={['Bar chart of number of records meeting SLA for ', task.split(' Total')[0]].join(' ')}
                  colorScheme="bright_colors"
                  xAxisTickFormatter={d => d.replace('20', '')}
                  rotateXLabels
                />
              </div>
            </div>
            <hr />
          </div>
        ))
      }
    </div>
  );
};

DevelopmentSLADashboard.propTypes = {
  data: PropTypes.object,
  tasks: PropTypes.arrayOf(PropTypes.string),
};

DevelopmentSLADashboard.defaultProps = {
  tasks: [
    'Addressing',
    'Building Review',
    'Fire Review',
    'Zoning Review',
  ],
};

export default graphql(query, {
  options: ownProps => ({
    variables: {
      tasks: ownProps.tasks,
    },
  }),
})(DevelopmentSLADashboard);

