import React from 'react';
import PermitTypeCards from './PermitTypeCards';

function MajorDevTypes() {
  return (
    <div>
      <h2 className="text-3xl text-coa-blue-medium mb-6">Major Development Types</h2>
      <p className="mb-6">
        The types of large-scale development are defined by{' '}
        <a
          href="https://codelibrary.amlegal.com/codes/ashevillenc/latest/asheville_nc/0-0-0-2930"
          rel=" noreferrer"
        >
          the City of Asheville's Unified Development Ordinance{' '}
          <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
          <span className="sr-only">(external site)</span>
        </a>
        . Projects located downtown are{' '}
        <a
          href="https://codelibrary.amlegal.com/codes/ashevillenc/latest/asheville_nc/0-0-0-14740#JD_7-5-9.1"
          rel=" noreferrer"
        >
          defined slightly differently in the ordinance{' '}
          <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
          <span className="sr-only">(external site)</span>
        </a>
        .
      </p>
      <PermitTypeCards />
    </div>
  );
}

export default MajorDevTypes;
