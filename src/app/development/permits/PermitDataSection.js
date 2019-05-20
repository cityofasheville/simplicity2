import React from 'react';
import PropTypes from 'prop-types';
import { permitFieldFormats } from './permitFieldFormats';

const PermitDataSection = ({ detailsSet, formattedPermit }) => (
  <div>
    {permitFieldFormats.filter(field => field.displayGroup === detailsSet)
      .sort(a => (!a.displayLabel ? -1 : 0))
      .map((d) => {
        const snakeCaseAccelaLabel = d.accelaLabel.toLowerCase().split(' ').join('_');
        const val = formattedPermit[snakeCaseAccelaLabel];
        if (!val) {
          return null;
        }
        const formattedDisplayVal = d.formatFunc ? d.formatFunc(val, formattedPermit) : val;
        if (!formattedDisplayVal) {
          // Format functions return null if it should not show
          return null;
        }
        if (!d.displayLabel) {
          return (
            <div className="permit-form-group bool" key={d.accelaLabel}>
              {formattedDisplayVal}
            </div>
          );
        }
        return (
          <div className="permit-form-group" key={d.accelaLabel}>
            <div className="display-label">{d.displayLabel}</div>
            <div className="formatted-val">{formattedDisplayVal}</div>
          </div>
        );
      })
    }
  </div>
);

PermitDataSection.propTypes = {
  detailsSet: PropTypes.string.isRequired,
  formattedPermit: PropTypes.shape({}).isRequired,
};

export default PermitDataSection;
