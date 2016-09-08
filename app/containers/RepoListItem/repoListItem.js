/**
 * RepoListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import { connect } from 'react-redux';

import { FormattedNumber } from 'react-intl';
import ListItem from 'components/ListItem/listItem';
import IssueIcon from 'components/IssueIcon/issueIcon';
import A from 'components/A/a';

import styles from './repoListItemStyles.css';

export class RepoListItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const item = this.props.item;
    let nameprefix = '';

    // If the repository is owned by a different person than we got the data for
    // it's a fork and we should show the name of the owner
    if (item.owner.login !== this.props.currentUser) {
      nameprefix = `${item.owner.login}/`;
    }

    // Put together the content of the repository
    const content = (
      <div className={styles.linkWrapper}>
        <A
          className={styles.linkRepo}
          href={item.html_url}
          target="_blank"
        >
          {nameprefix + item.name}
        </A>
        <A
          className={styles.linkIssues}
          href={`${item.html_url}/issues`}
          target="_blank"
        >
          <IssueIcon className={styles.issueIcon} />
          <FormattedNumber value={item.open_issues_count} />
        </A>
      </div>
    );

    // Render the content into a list item
    return (
      <ListItem key={`repo-list-item-${item.full_name}`} item={content} />
    );
  }
}

RepoListItem.propTypes = {
  item: React.PropTypes.object,
  currentUser: React.PropTypes.string,
};

function mapStateToProps(state) {
  const { home } = state;
  const props = {
    username: home.username,
  };
  return props;
}

export default connect(mapStateToProps)(RepoListItem);
