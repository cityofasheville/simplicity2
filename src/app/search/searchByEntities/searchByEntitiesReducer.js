import { TOGGLE_SEARCH_BY_ENTITY } from './searchByEntitiesConstants';
const objectAssign = require('object-assign');

const initialState = {
  entities: [
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    { label: 'Google places', type: 'google', checked: true },
    { label: 'Properties', type: 'property', checked: true },
  ],
};

const searchByEntities = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SEARCH_BY_ENTITY:
      return {
        entities: state.entities.map((entity) => {
          if (entity.type !== action.entityType) {
            return entity;
          }
          return objectAssign({}, {label: entity.label, type: entity.type, checked: !entity.checked });
        }) };
    default:
      return state;
  }
};

export default searchByEntities;
