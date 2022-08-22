import React from 'react';

const EnvBanner = props => {

  let bannerContent = '';
  let bannerOverride = false;
  let defaultLeftMargin = 0;

  if (typeof process.env.REACT_APP_SUPPRESS_ENV_WARNING !== "undefined" && +process.env.REACT_APP_SUPPRESS_ENV_WARNING) {
    bannerOverride = true;
  }

  console.log();

  if (window.location.href.indexOf('simplicity.ashevillenc.gov') === -1 && !bannerOverride) {

    if (window.location.href.indexOf('development/major') > -1) {
      defaultLeftMargin = 200;
    }

    bannerContent = (
      <div role={'alert'} className='alert' style={{backgroundColor: 'orange', marginTop: '32px', marginLeft: defaultLeftMargin}}>
        <p style={{fontWeight: '500', fontSize: '1.5rem', textAlign:'center'}}><em>Attention!</em></p> <p>This is an experimental version of SimpliCity, and may
        produce unexpected results. Unless you understand why you've ended up here, you should probably visit the 
        <a href="https://simplicity.ashevillenc.gov">production version of SimpliCity</a> instead. </p>
      </div>
    );
  }

  return (
    bannerContent
  );
} 

export default EnvBanner;
