import React from 'react';
import { browserHistory } from 'react-router';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';

const HomelessnessData = () => (
  <div>
    <PageHeader h1="Understand the homelessness data">
      <ButtonGroup>
        <Button onClick={browserHistory.goBack} text="Back"></Button>
      </ButtonGroup>
    </PageHeader>
    <div className="row">
      <div className="col-sm-12">
        <p>Some explanation of the data and limitations of the data, and some links to more detailed reports</p>
      </div>
    </div>
  </div>
);

export default HomelessnessData;
