import React from 'react';
import PropTypes from 'prop-types';


const PermitTypeMenus = props => (
  <div>
    {props.parentHierarchyLevels.map((level, levelIndex, array) => {
      // If the level before it has no selection, don't show it
      if (levelIndex > 0 && array[levelIndex - 1].selectedCat === null) {
        return null;
      }
      let keyLevel = props.wholeHierarchy;
      for (let index = 0; index < levelIndex; index++) {
        keyLevel = keyLevel[array[index].selectedCat];
      }
      /*
       * If the value is not null, make it a selected dropdown
       * If someone changes the selected dropdown of
       * one earlier in the array, the later one's value should be cleared
      */
      const orderedKeys = Object.keys(keyLevel).sort((a, b) => {
        if (a > b) {
          return 1;
        } else if (a < b) {
          return -1;
        }
        return 0;
      });

      return (<div
        className="visualization-title"
        style={{
          display: 'inline-block',
          textTransform: 'capitalize',
          padding: '0 2% 0 0',
        }}
        key={level.name}
      >
        <div style={{ display: 'inline-block' }}>
          {`${level.name.replace('_', ' ')}: `}&nbsp;
        </div>
        <select
          name={level.name}
          onChange={e => props.onSelect(e, levelIndex)}
          value={level.selectedCat || 'null'}
        >
          <option value="null">All</option>
          {orderedKeys.map(key => (
            <option
              value={key}
              key={`${level.name}-${key}`}
            >
              {key}
            </option>
          ))}
        </select>
      </div>);
    })}
  </div>
);

PermitTypeMenus.propTypes = {
  onSelect: PropTypes.func,
  parentHierarchyLevels: PropTypes.arrayOf(PropTypes.object),
  wholeHierarchy: PropTypes.object,
};

PermitTypeMenus.defaultProps = {
  onSelect: e => console.log(e.target.value),
  parentHierarchyLevels: {},
  wholeHierarchy: {},
};

export default PermitTypeMenus;
