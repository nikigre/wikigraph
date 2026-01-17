export interface PredpisData {
  mopedID: string;
  naziv: string;
  [key: string]: any;
}

export interface PredpisResponse {
  data: PredpisData[];
}

export interface PisrsApiResponse {
  data: any[];
}

export const PREDPIS_TYPES = {
  registerPredpisov: 'registerPredpisov',
  splosniAktiZaIzvrsevanjeJavnihPooblastil: 'splosniAktiZaIzvrsevanjeJavnihPooblastil',
  drugiSplosniInPosamicniAkti: 'drugiSplosniInPosamicniAkti',
  neveljavniPredpisi: 'neveljavniPredpisi',
  obsoletniInKonzumiraniPredpisi: 'obsoletniInKonzumiraniPredpisi',
  predpisiVpripravi: 'predpisiVpripravi',
} as const;
