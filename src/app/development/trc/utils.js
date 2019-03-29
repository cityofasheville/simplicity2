export const trcProjectTypes = {};

trcProjectTypes['Level I'] = {
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Level I',
  short: 'I',
  description: 'Projects smaller than 35,000 square feet or with fewer than 20 residential units that trigger zoning compliance requirements.',
};
trcProjectTypes['Major Subdivision'] = {
  permit_group: 'Planning',
  permit_type: 'Subdivision',
  permit_subtype: 'Major',
  short: 'MS',
  description: 'Any project that requires the extension or creation of a new public or private street.  Typically these projects create new residential lots.',
};
trcProjectTypes['Level II'] = {
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Level II',
  short: 'II',
  description: 'Commercial projects between 35,000 and 99,999 square feet, residential projects between 20 and 49 units, and industrial projects with a floor larger than 100,000 square feet.  Different restrictions apply in the River District or certain expansion projects.',
};
trcProjectTypes['Level III'] = {
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Level III',
  short: 'III',
  description: 'Commercial projects over 100,000 square feet, residential projects over 50 units, industrial projects in the River District that are over 100,000 square feet, and certain expansion projects.',
};
trcProjectTypes['Conditional Zoning'] = {
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Conditional Zoning',
  short: 'CZ',
  description: 'Any development project seeking to change the zoning of a site and develop it at the same time.',
};
trcProjectTypes['Conditional Use Permit'] = {
  permit_group: 'Planning',
  permit_type: 'Development',
  permit_subtype: 'Conditional Use',
  short: 'CUP',
  description: 'Anything that is listed as a conditional use in section 7-16-2 of the Unified Development Ordinance.',
};
