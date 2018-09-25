import React from 'react';
import PropTypes from 'prop-types';

const BigNumber = props => (
  <div className='card-item'>
    <div
      className='topic-card'
      style={{
        textAlign: 'center'
      }}
    >
      <div
        style={{
          fontSize: '3em'
        }}
      >
        {props.tempNumber}
      </div>
      <div>
        {props.label}
      </div>
    </div>
  </div>
);

BigNumber.propTypes = {
  query: PropTypes.string,
  label: PropTypes.string,
}

BigNumber.defaultProps = {
  query: '',
  label: '',
}

export default BigNumber;
