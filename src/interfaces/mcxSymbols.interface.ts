export interface IMcxSymbols {
  id: number;
  identifier: string;
  name: string;
  expiry: string;
  symbol: string;
  refSlug: string;
  script: Script;
  segment: Segment;
}

export interface Script {
  name: string;
}

export interface Segment {
  refSlug: string;
}
