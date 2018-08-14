import React from 'react';
import { browserHistory } from 'react-router';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import Icon from '../../shared/Icon';
import { IM_CITY } from '../../shared/iconConstants';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

const CIPData = (props) => {
  // set language
  let content;
  switch (props.language.language) {
    case 'Spanish':
      content = spanish;
      break;
    default:
      content = english;
  }

  return (
    <div>
      <PageHeader
        h1={content.understand_the_capital_projects_data}
        icon={<Icon path={IM_CITY} size={60} />}
      >
        <ButtonGroup>
          <Button onClick={browserHistory.goBack}>{content.back}</Button>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-12">
          <p>{content.data_info}</p>
        </div>
      </div>
    </div>
  );
};

export default withLanguage(CIPData);
