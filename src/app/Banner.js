import React from 'react';

function Banner({message = 'Default banner message', color = 'orange'}) {

  let defaultLeftMargin = 0;

  if (window.location.href.indexOf('development/major') > -1) {
    defaultLeftMargin = 200;
  }

  return (
    <div role={'alert'} className='alert' style={{ backgroundColor: color, marginTop: '32px', marginLeft: defaultLeftMargin }}>
      <>
        {message}
      </>
    </div>
  );
}

export default Banner;
