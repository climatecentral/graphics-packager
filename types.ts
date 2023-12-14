export enum LocationTypes {
  market = 'market',
  conus = 'conus',
}

export type BackgroundType = undefined | 'Linear Gradient' | 'Image URL' | 'Solid' | 'None';
export type BackgroundCombo = {
  name: string;
  backgroundType: BackgroundType;
  backgroundStartColor?: string;
};

export interface SetDef {
  name: string;
  graphicType: 'lineChart' | 'mapGraphic';
  variable: string;
  season?: string;
  occasionSlug?: string;
  backgroundType?: BackgroundType;
  imageURL?: string;
  backgroundStartColor?: string;
  backgroundEndColor?: string;
  locationType: LocationTypes;
  downloadable: boolean;
  ticksCount?: number;
}

export enum TitleEnum {
  title = 'title',
  notitle = 'notitle',
}

export interface GraphicURLOpts extends Omit<SetDef, 'locations'> {
  // [key: string]: string | boolean | undefined
  lang: string;
  noTitle: boolean;
  marketSlug?: string;
}

export interface OverallOpts {
  endYear: number;
}

export interface Station {
  name: string;
  station: string;
}