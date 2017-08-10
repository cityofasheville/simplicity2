import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend} from 'recharts';
import Icon from '../../shared/Icon';
import { IM_OFFICE } from '../../shared/iconConstants';
import { getAverageCounts } from './SLA_utilities';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import BarChartContainer from '../../shared/visualization/BarChartContainer';
import ChartContainer from '../../shared/visualization/ChartContainer';
import { query } from './SLADashboardQueries';
import LoadingAnimation from '../../shared/LoadingAnimation';

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
                <h3>{task}</h3>
                <div className="col-sm-6">
                  <ChartContainer chartTitle="Percentage meeting SLA" data={aggregateData[task]} dataKeys={[[task, 'Met SLA Percent'].join(' ')]} altText={['Line chart of percentage of records meeting SLA for ', task].join(' ')} mainAxisDataKey="displayDate" toolTipFormatter={(value) => ([value, '%'].join(''))}>
                    <LineChart data={aggregateData[task]} margin={{ right: 34 }}>
                      <XAxis dataKey="displayDate" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => ([value, '%'].join(''))} />
                      <CartesianGrid strokeDasharray="3 3"/>
                      <Tooltip formatter={(value) => ([value, '%'].join(''))} />
                      <Legend />
                      <ReferenceLine y={85} label="85%" stroke="green" />
                      <Line type="monotone" dataKey={[task, 'Met SLA Percent'].join(' ')} stroke="#db6d00" strokeWidth={2} />
                    </LineChart>
                  </ChartContainer>
                </div>
                <div className="col-sm-6" style={{ marginBotton: '10px' }} >
                  <BarChartContainer chartTitle="Volume" mainAxisDataKey="displayDate" legendHeight={40} dataKeys={[[task, 'Past SLA'].join(' '), [task, 'Met SLA'].join(' ')]} data={aggregateData[task]} stacked altText={['Bar chart of number of records meeting SLA for ', task.split(' Total')[0]].join(' ')} colorScheme="bright_colors_2" />
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
  options: (ownProps) => ({
    variables: {
      tasks: ownProps.tasks,
    }
  })
})(DevelopmentSLADashboard);

