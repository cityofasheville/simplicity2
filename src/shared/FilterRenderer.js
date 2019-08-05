import React from 'react';
import { CellFocusWrapper } from 'accessible-react-table';

// eslint-disable-next-line react/prop-types
const createFilterRenderer = (placeholderText, extraProps) => ({ filter, onChange }) => (
  <CellFocusWrapper>
    {(focusRef, focusable) => (
      <input
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : ''}
        className={`table-filter${filter && filter.value ? ' filter-active' : ''}`}
        placeholder={placeholderText}
        tabIndex={focusable ? 0 : -1}
        ref={focusRef}
        {...extraProps}
      />
    )}
  </CellFocusWrapper>
);

export default createFilterRenderer;
