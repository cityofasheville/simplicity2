import { TOGGLE_SEARCH_BY_ENTITY } from './searchByEntitiesConstants';

const initialState = {
  entities: [
    { entityType: 'Neighborhoods', checked: true },
    { entityType: 'Streets', checked: true },
    { entityType: 'Addresses', checked: true },
    { entityType: 'Owners', checked: true },
    { entityType: 'Google places', checked: true },
    { entityType: 'Properties', checked: true },
  ],
};

const searchByEntities = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SEARCH_BY_ENTITY:
      return {
        entities: state.entities.map((entity) => {
          if (entity.entityType !== action.entityType) {
            return entity;
          }
          return Object.assign({}, { entityType: entity.entityType, checked: !entity.checked });
        }) };
    default:
      return state;
  }
};

export default searchByEntities;
