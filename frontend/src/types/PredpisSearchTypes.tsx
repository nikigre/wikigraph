export type PredpisSearchDisplay = {
  mopedId: string;
  naziv: string;
};

export type PredpisData = {
  mopedId: string;
  naziv: string;
  category?: string;
  posegiVPredpis?: any[];
  vpliviNaPredpis?: any[];
  posegaVPredpise?: any[];
  vplivaNaPredpise?: any[];
  podrejeniPredpisi?: any[];
  [key: string]: any;
};

export type PredpisSearchResponse = {
  primary: PredpisData;
  related: PredpisData[];
};

export type PredpisRelatedResponse = {
  data: PredpisData[];
};
