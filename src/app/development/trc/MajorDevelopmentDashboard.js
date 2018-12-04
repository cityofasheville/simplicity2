import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveNetworkFrame } from 'semiotic';
import AnchorNav from './AnchorNav';
import { colorScheme } from '../volume/granularUtils';


const processData = {
  key: 'Pre Application Meeting',
  splitFactor: 'Size and Zoning',
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  children: [
    {
      key: 'Level I',
      children: [
        {
          key: 'LI Staff Review',
          children: [
            {
              key: 'LI Accepted',
            },
            {
              key: 'LI Rejected',
            }
          ]
        }
      ]
    },
    {
      key: 'Level II and Major Subdivision',
      children: [
        {
          key: 'LII MS Staff Review',
          children: [
            {
              key: 'LII MS Technical Review Committee',
              children: [
                {
                  key: 'Major Subdivision Not Downtown',
                  children: [
                    {
                      key: 'MS Accepted'
                    },
                    {
                      key: 'MS Rejected'
                    }
                  ]
                },
                {
                  key: 'LII MS Design Review',
                  children: [
                    {
                      key: 'Planning and Zoning Commission',
                      children: [
                        {
                          key: 'Accepted'
                        },
                        {
                          key: 'Rejected'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      key: 'Level III, Conditional Zoning, Conditional Use Permit',
      children: [
        {
          key: 'LIII CZ CUP Staff Review',
          children: [
            {
              key: 'Technical Review Committee',
              children: [
                {
                  key: 'Special Zoning Design Review',
                  children: [
                    {
                      key: 'Planning and Zoning Commission',
                      children: [
                        {
                          key: 'City Council',
                          children: [
                            {
                              key: 'Accepted',
                              children: [
                                {
                                  key: 'Technical Review Committee Detail'
                                }
                              ]
                            },
                            {
                              key: 'Rejected'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  key: 'All Else',
                  dummy: true,
                  children: [
                    {
                      key: 'Planning and Zoning Commission',
                      children: [
                        {
                          key: 'City Council',
                          children: [
                            {
                              key: 'Accepted',
                              children: [
                                {
                                  key: 'Technical Review Committee Detail'
                                }
                              ]
                            },
                            {
                              key: 'Rejected'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}


class MajorDevelopmentDashboard extends React.Component {
  constructor(props){
    super(props);
    // this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    // window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    let scrollTop = event.srcElement.body.scrollTop,
        itemTranslate = Math.min(0, scrollTop/3 - 60);

    // console.log(window.scrollY)
    //
    // console.log(event, scrollTop, itemTranslate)
    //
    // this.setState({
    //   transform: itemTranslate
    // })
  }

  render() {
    const nodeSize = 200;
    {/*
      customNodeIcon={(d) => {
        console.log('nodeIcon', d)
        const width = nodeSize * 2 / 3
        const height = nodeSize;
        if (d.d.data.key === 'Accepted' || d.d.data.key === 'Rejected') {
          return (<circle
            key={`${d.i}-${d.d.data.key}`}
            cx={d.d.x}
            cy={d.d.y}
            r={5}
            />)
          }
          return (<g key={`${d.i}-${d.d.data.key}`}>
            <foreignObject
            style={{
              x: d.d.x - width / 2,
              y: d.d.y - height / 2,
              width: width,
              height: height,
            }}
            >
            <div
            style={{
              width: '100%',
              height: '100%',
              border: '0.5px solid gray',
              backgroundColor: 'white',
              fontSize: '0.85em',
              padding: '0.5em',
              borderRadius: '2px'
            }}
            >
            <div
            style={{
              textAlign: 'center',
              fontWeight: 'normal',
            }}
            >
            {d.d.data.key}
            </div>
            <div>
            {d.d.description}
            </div>
            </div>
            </foreignObject>
            </g>)
          }}
          */}
    return (<div id="majorDevDash">
      {/* Highlight/anchor nav button bar */}
      <AnchorNav
        links={[
          {
            linkId: 'about',
            linkName: 'About',
            selected: true,
          },
          {
            linkId: 'notifications',
            linkName: 'Get Notifications',
          },
          {
            linkId: 'data',
            linkName: 'Current Projects'
          },
          {
            linkId: 'calendar',
            linkName: 'Public Events'
          },
          {
            linkId: 'faq',
            linkName: 'Frequently Asked Questions',
          },
        ].map((d, i) => {
          const rObj = Object.assign({}, d);
          rObj.color = colorScheme[i];
          return rObj;
        })}
      />
      <div>
      <br/>
      <br/>
      <br/>
      <h1 id="about" >Major Development in Asheville</h1>
      <div style={{ width: '100%', height: nodeSize * 20 }}>
        <ResponsiveNetworkFrame
          size={[1000, 1000]}
          responsiveWidth
          responsiveHeight
          margin={20}
          edges={processData}
          nodeIDAccessor="key"
          nodeLabels
          networkType={{
            type: "sankey",
            direction: 'down',
            // projection: "vertical",
            orient: 'left'
          }}
          edgeType="ribbon"
          edgeStyle={{ stroke: 'none', fill: 'gray', fillOpacity: 0.5 }}
          // nodeSizeAccessor={nodeSize + 20}
          // nodePadding={10}
        />
      </div>
      {/* Get notifications */}
      <h2 id="notifications">Sign up for Notifications</h2>
      <br/>
      <br/>
      <br/>
      <br/>
      {/* Data - table and map */}
      <h2 id="data">Current Projects</h2>
      <br/>
      <br/>
      <br/>
      <br/>
      {/* Calendar */}
      <h2 id="calendar">Upcoming Public Events</h2>
      <br/>
      <br/>
      <br/>
      <br/>
      {/* FAQ */}
      <h2 id="faq">FAQ</h2>
      </div>
    </div>);
  }

}

export default MajorDevelopmentDashboard;
