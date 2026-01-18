export type APIResponse = {
  from_title_id: string; // originating article
  to_title_id: string; // article being references
  to_title: string; // user friendly formatting of `to_title_id`
  link_id: number;
}[];

export type PredpisRelation = {
  mopedID: string;
  naziv: string;
  category: string;
};

export type Link = {
  source: string;
  target: string;
  edgeName?: string;
  ranking?: number;
};

export type Node = {
  id: string;
  title: string;
  tag?: string;
  tags?: string[];
  datumSprejetja?: string;
  datumObjave?: string;
  datumZacetkaVeljavnosti?: string;
  datumPrenehanjaVeljavnosti?: string;
  datumKoncaUporabe?: string;
};

export type Data = {
  links: Link[];
  nodes: Node[];
};
