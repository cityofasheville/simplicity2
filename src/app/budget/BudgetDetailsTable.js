import React from 'react';
import { Query } from 'react-apollo';
import AccessibleReactTable from 'accessible-react-table';
import { RadioGroup, Radio } from 'react-radio-group';
import expandingRows from '../../shared/react_table_hoc/ExpandingRows';
import Collapsible from '../../shared/Collapsible';
import { getBudgetTrees } from './graphql/budgetQueries';
import { getBudgetYears } from './budgetUtilities';
import { refreshLocation } from '../../utilities/generalUtilities';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

const BudgetDetailsTable = props => (
  <Query
    query={getBudgetTrees}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      // set language
      let content;
      switch (props.language.language) {
        case 'Spanish':
          content = spanish;
          break;
        default:
          content = english;
      }

      const dataForTable = props.location.query.mode === 'expenditures' ||
        props.location.query.mode === undefined ?
        data.budgetTrees.expenseTree.children : data.budgetTrees.revenueTree.children;

      const getNewUrlParams = mode => (
        {
          mode,
          nodePath: 'root',
        }
      );
      const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);
      const budgetYears = getBudgetYears(props.data.budgetParameters);

      const last4Years = budgetYears;
      const last4YrBudgetTypes = [];

      for (let i = 0; i < budgetYears.length + 1; i += 1) {
        last4YrBudgetTypes.push(i < budgetYears.length - 1 ?
          content.actual :
          (props.data.budgetParameters.in_budget_season ? content.proposed : content.adopted));
      }

      const getDollars = (value) => {
        const initialSymbols = value < 0 ? '-$' : '$';
        return [initialSymbols, Math.abs(value).toLocaleString()].join('');
      };

      const getYearHeader = year => (
        <div>
          { last4Years.indexOf(year) > -1 &&
          <div>{last4YrBudgetTypes[last4Years.indexOf(year)]}</div>
          }
          {[year - 1, year.toString().slice(2)].join('-')}
        </div>
      );

      const getChangeHeader = () => (
        <div>{content.change_from} <br /> {content.past_year}</div>
      );

      const getDataColumnHeader = (level, expenseOrRevenue) => () => {
        switch (level) {
          case 0:
            if (expenseOrRevenue === 'expenditures') {
              return content.budget_section;
            }
            return content.budget_category;
          case 1:
            return content.department;
          case 2:
            return content.division;
          case 3:
            return content.account;
          default:
            return content.grouping;
        }
      };
      const getDataColumns = (level, expenseOrRevenue) => {
        const theHeader = getDataColumnHeader(level, expenseOrRevenue);
        const dataColumns = [
          {
            id: 'name',
            Header: theHeader,
            accessor: 'name',
            width: level === 3 ? 300 - (34 * 2) : 300 - (34 * level),
            getProps: () => ({
              role: 'rowheader',
            }),
          },
          {
            id: 'threeYearsAgo',
            Header: getYearHeader(last4Years[0]),
            accessor: 'yearAmounts',
            Cell: years => getDollars(years.value[0].amount),
            minWidth: 95,
            style: { textAlign: 'right' },
          }, {
            id: 'twoYearsAgo',
            Header: getYearHeader(last4Years[1]),
            accessor: 'yearAmounts',
            Cell: years => getDollars(years.value[1].amount),
            minWidth: 95,
            style: { textAlign: 'right' },
          }, {
            id: 'oneYearAgo',
            Header: getYearHeader(last4Years[2]),
            accessor: 'yearAmounts',
            Cell: years => getDollars(years.value[2].amount),
            minWidth: 95,
            style: { textAlign: 'right' },
          }, {
            id: 'proposed',
            Header: getYearHeader(last4Years[3]),
            accessor: 'yearAmounts',
            Cell: years => getDollars(years.value[3].amount),
            minWidth: 95,
            style: { textAlign: 'right' },
          },
          {
            id: 'deltaPercent',
            Header: getChangeHeader(),
            accessor: 'deltaPercent',
            minWidth: 95,
            style: { textAlign: 'right' },
          },
        ];
        return dataColumns;
      };
      const tdProps = () => ({
        style: {
          whiteSpace: 'normal',
        },
      });
      const trProps = () => ({
        style: {
          cursor: 'pointer',
        },
      });

      const translateMode = (mode) => {
        if (!mode) {
          return content.expenditures;
        }
        switch (mode.toLowerCase()) {
          case 'revenue':
            return content.revenue;
          default:
            return content.expenditures;
        }
      };

      const notes = [content.internal_audit_note];

      return (
        <div>
          <div className="row">
            <div className="col-sm-12">
              <h2
                id={'budget-details-table-label'}
              >{`${content.table_of} ${translateMode(props.location.query.mode).toLowerCase()}`}
              </h2>
              <div style={{ marginBottom: '15px' }}>
                {content.you_may_explore} <a className="inText" href="http://data.ashevillenc.gov/datasets?q=budget&sort_by=relevance" target="_blank">{content.download_here}</a>. {content.click_the_triangles}.
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="radioGroup pull-right" style={{ marginBottom: '3px' }}>
                <RadioGroup
                  name="tableRadios"
                  id="tableRadios"
                  selectedValue={props.location.query.mode || 'expenditures'}
                  onChange={value => refreshLocation(getNewUrlParams(value), props.location)}
                >
                  <label>
                    <Radio value="expenditures" />{content.expenditures}
                  </label>
                  <label>
                    <Radio value="revenue" />{content.revenue}
                  </label>
                </RadioGroup>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <Collapsible trigger={content.notes}>
                {notes.map((item, index) => (
                  <p key={['notes', index].join('_')}>{item}</p>
                ))}
              </Collapsible>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div alt={['Table of', (props.location.query.mode || 'expenditures')].join(' ')}>
                <ExpandableAccessibleReactTable
                  data={dataForTable}
                  columns={getDataColumns(0, props.location.query.mode)}
                  pageSize={dataForTable.length}
                  showPagination={false}
                  getTdProps={tdProps}
                  getTrProps={trProps}
                  tableId="table-1"
                  ariaLabelledBy="budget-details-table-label"
                  SubComponent={innerRow1 => (
                    <div style={{ paddingLeft: '34px' }}>
                      <ExpandableAccessibleReactTable
                        data={dataForTable[innerRow1.index].children}
                        columns={getDataColumns(1, props.location.query.mode)}
                        defaultPageSize={dataForTable[innerRow1.index].children.length}
                        showPagination={false}
                        getTdProps={tdProps}
                        getTrProps={trProps}
                        tableId="table-2"
                        ariaLabel={`${getDataColumnHeader(1, props.location.query.mode)()} subtable`}
                        SubComponent={innerRow2 => (
                          <div style={{ paddingLeft: '34px' }}>
                            <ExpandableAccessibleReactTable
                              data={dataForTable[innerRow1.index].children[innerRow2.index].children}
                              columns={getDataColumns(2, props.location.query.mode)}
                              defaultPageSize={dataForTable[innerRow1.index].children[innerRow2.index].children.length}
                              showPagination={false}
                              getTdProps={tdProps}
                              getTrProps={trProps}
                              tableId="table-3"
                              ariaLabel={`${getDataColumnHeader(2, props.location.query.mode)()} subtable`}
                              SubComponent={innerRow3 => (
                                <div style={{ paddingLeft: '34px' }}>
                                  <AccessibleReactTable
                                    data={dataForTable[innerRow1.index].children[innerRow2.index].children[innerRow3.index].children}
                                    columns={getDataColumns(3, props.location.query.mode)}
                                    defaultPageSize={dataForTable[innerRow1.index].children[innerRow2.index].children[innerRow3.index].children.length}
                                    showPagination={false}
                                    ariaLabel={`${getDataColumnHeader(3, props.location.query.mode)()} subtable`}
                                  />
                                </div>
                              )
                              }
                            />
                          </div>
                        )
                        }
                      />
                    </div>
                  )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      );
    }}
  </Query>
);

BudgetDetailsTable.defaultProps = {
  data: [],
};

export default withLanguage(BudgetDetailsTable);
