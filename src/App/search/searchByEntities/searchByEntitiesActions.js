import { TOGGLE_SEARCH_BY_ENTITY } from './searchByEntitiesConstants';

export const toggleSearchByEntity = entityType => ({
  type: TOGGLE_SEARCH_BY_ENTITY,
  entityType,
});
