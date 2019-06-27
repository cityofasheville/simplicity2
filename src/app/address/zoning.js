export function getZoningLink(zoningAbbreviation) {
  if (zoningLinks[zoningAbbreviation]) {
    return zoningLinks[zoningAbbreviation]
  } else if (zoningAbbreviation.indexOf('RAD') === 0) {
    return 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-29RIARFODI'
  } else if (zoningAbbreviation.indexOf('EXP-CZ') >= 0) {
    return 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIITEAMMAAM_S7-7-8COZO';
  }
  return 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE';
}

export const zoningLinks = {
  CBD: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-18CEBUDI',
  CBI: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-12COBUIDI',
  CBII: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-13COBUIIDI',
  'CBII-CZ': 'disable',
  CI: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-20COINDI',
  HB: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-16HIBUDI',
  'HB-CZ': 'disable',
  HCU: 'https://www.municode.com/library/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTIXOVDI_S7-9-2HIPROVDI',
  'HR-1:CORE': 'disable',
  'HR-2:EXPN': 'disable',
  'HR-3:CRDR': 'disable',
  'HR-4:TRAD': 'disable',
  'HR-5:L-W': 'disable',
  'HR-6:TOWN': 'disable',
  IND: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-22INDI',
  'IND-CZ': 'disable',
  INST: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-15INDI',
  'INST-CZ': 'disable',
  LI: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-21LIINDI',
  NB: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-8NEBUDI',
  NCD: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-24NECODI',
  'NOT ZONED': 'disable',
  O2: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-10OFIIDI',
  OB: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-11OFBUDI',
  OFFICE: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-9OFDI',
  RB: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-17REBUDI',
  'RB-CU': 'disable',
  RESORT: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-14REDI',
  RIVER: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-19RIDI',
  RM16: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-7RMREMUMIHIDEDI',
  'RM16-CZ': 'disable',
  RM6: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-5REMUMILODEDI',
  'RM6-CZ': 'disable',
  RM8: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-6REMUMIMEDEDI',
  RS2: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-2RESIMILODEDI',
  RS4: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-3RESIMIMEDEDI',
  'RS4-CZ': 'disable',
  RS8: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-4RESIMIHIDEDI',
  'RS8-CZ': 'disable',
  UP: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-26URPLDI',
  'UP-CZ': 'disable',
  URD: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-25URREDI',
  UV: 'https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVIIIGEUSEXDI_S7-8-23URVIDI',
};
