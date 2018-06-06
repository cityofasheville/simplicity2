import React from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { getLanguage } from './graphql/langQueries';
import { updateLanguage } from './graphql/langMutations';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';

const LangSwitcher = props => (
  <Query query={getLanguage}>
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;
      return (
        <Mutation mutation={updateLanguage}>
          {updateLanguage => (
            <li className={['dropdown', data.language.dropdownOpen ? 'open' : ''].join(' ')}>
              <a
                className="dropdown-toggle"
                onClick={() => updateLanguage({
                  variables: {
                    lang: data.language.lang,
                    dropdownOpen: !data.language.dropdownOpen,
                  },
                })}
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >{data.language.lang}
                <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      //e.preventDefault();
                      updateLanguage({
                        variables: {
                          lang: "English",
                          dropdownOpen: false,
                        },
                      });
                    }}
                    className=""
                  >English
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      //e.preventDefault();
                      updateLanguage({
                        variables: {
                          lang: "Spanish",
                          dropdownOpen: false,
                        },
                      });
                    }}
                    className=""
                    >Spanish
                  </a>
                </li>
              </ul>
            </li>
          )}
        </Mutation>
      );
    }}
  </Query>
);

export default LangSwitcher;

