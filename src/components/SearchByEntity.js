import React from 'react';
import Checkbox from './Checkbox';
import styles from './searchByEntities.css';

const getIcon = (entityType) => {
  switch (entityType) {
    case 'Neighborhoods':
      return 'users';
    case 'Streets':
      return 'road';
    case 'Addresses':
      return 'map-marker';
    case 'Owners':
      return 'user';
    case 'Google places':
      return 'google';
    case 'Properties':
      return 'home';
    default:
      return 'university';
  }
};

class SearchByEntity extends React.Component {
  constructor(props) {
    super(props);

    this.state = { checked: props.entity.checked };
    this.entity = props.entity;
    this.reviseChecked = this.reviseChecked.bind(this);
  }

  reviseChecked(checkedState) {
    this.setState({
      checked: checkedState,
    });
  }

  render() {
    return (
      <div>
        <Checkbox label={this.entity.entityType} value={this.entity.entityType} checked={this.state.checked} onChangeCallback={this.reviseChecked} />
        <span className="fa-stack fa-lg">
          <i className={this.state.checked === true ? 'fa fa-circle fa-stack-2x text-primary' : ['fa fa-circle fa-stack-2x', styles.unchecked].join(' ')}></i>
          <i className={['fa fa-stack-1x fa-inverse fa-', getIcon(this.entity.entityType)].join('')}></i>
        </span>
        <span className={this.state.checked === true ? ['text-primary', styles.entityDescription].join(' ') : styles.entityDescriptionUnchecked}>
          {this.entity.entityType}
        </span>
      </div>
    );
  }
}

const entityDataShape = {
  entityType: React.PropTypes.string,
  checked: React.PropTypes.bool,
};

SearchByEntity.propTypes = {
  entity: React.PropTypes.shape(entityDataShape).isRequired,
};

export default SearchByEntity;
