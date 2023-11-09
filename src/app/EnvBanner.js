import React from 'react';

const EnvBanner = props => {

  let bannerContent = '';
  let bannerOverride = false;
  let defaultLeftMargin = 0;

  if (typeof process.env.REACT_APP_SUPPRESS_ENV_WARNING !== "undefined" && +process.env.REACT_APP_SUPPRESS_ENV_WARNING) {
    bannerOverride = true;
  }

  if ((window.location.href.indexOf('simplicity.ashevillenc.gov') === -1
    || window.location.href.indexOf('climatej.d1thp43hcib1lz.amplifyapp.com') === -1)
    && !bannerOverride) {

    let productionPathAddons = '';

    if (window.location.href.indexOf('development/major') > -1) {
      defaultLeftMargin = 200;
    }

    if (window.location.pathname.length) {
      productionPathAddons += window.location.pathname;
    }

    if (window.location.search.length) {
      productionPathAddons += window.location.search;
    }

    bannerContent = (
      <div role={'alert'} className='alert' style={{ backgroundColor: 'orange', marginTop: '32px', marginLeft: defaultLeftMargin }}>
        <p style={{ fontWeight: '500', fontSize: '1.5rem', textAlign: 'center' }}><em>Attention!</em></p> <p>This is an experimental version of SimpliCity, and may
          produce unexpected results. Unless you understand how you've ended up here, we
          recommend <a href={`https://simplicity.ashevillenc.gov${productionPathAddons}`} style={{ color: 'black' }}>visiting this page in the production version of SimpliCity</a> instead. </p>
      </div>
    );
  }

  return (
    bannerContent
  );
}

export default EnvBanner;
