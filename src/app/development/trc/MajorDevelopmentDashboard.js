import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveNetworkFrame } from 'semiotic';
import AnchorNav from './AnchorNav';
import { colorScheme } from '../volume/granularUtils';


const processData = {
  key: 'root',
  children: [
    {
      key: 'Level I, Level II, MS',
      children: [
        {
          key: 'LI Staff Review',
          children: [
            {
              key: 'approved',
            },
            {
              key: 'rejected',
            }
          ]
        },
        {
          key: 'LII, MS Staff Review',
          children: [
            {
              key: 'LII MS TRC'
            }
          ]
        }
      ]
    },
    {
      key: 'LIII CZ CUP',
      children: [
        {
          key: 'LIII CZ CUP Staff Review',
          children: [
            {
              key: 'LIII CZ CUP TRC'
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
      {/* About */}
      <div className="col-md-12" >
        <ResponsiveNetworkFrame
          size={[300, 300]}
          responsiveWidth
          edges={processData}
          nodeIDAccessor="key"
          networkType={{
            type: "cluster",
            projection: "vertical",
          }}
          edgeStyle={{ stroke: 'gray' }}
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
