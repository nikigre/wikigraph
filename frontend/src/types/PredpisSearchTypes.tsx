export type PredpisSearchDisplay = {
  mopedID: string;
  naziv: string;
};

export type PredpisData = {
  mopedID: string;
  naziv: string;
  category?: string;
  posegiVPredpis?: any[];
  vpliviNaPredpis?: any[];
  posegaVPredpise?: any[];
  vplivaNaPredpise?: any[];
  [key: string]: any;
};

export type PredpisSearchResponse = {
  primary: PredpisData;
  related: PredpisData[];
};

export type PredpisRelatedResponse = {
  data: PredpisData[];
};
