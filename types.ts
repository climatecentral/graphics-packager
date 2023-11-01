export enum LocationTypes {
  market = 'market',
  conus = 'conus',
}

export type BackgroundType = 'Linear Gradient' | 'Image URL' | 'Solid' | 'None';
export type BackgroundCombo = {
  name: string;
  backgroundType: BackgroundType;
  backgroundStartColor?: string;
};

export interface SetDef {
  name: string;
  graphicType: 'lineChart' | 'mapGraphic';
  variable: string;
  backgroundType?: BackgroundType;
  imageURL?: string;
  backgroundStartColor?: string;
  backgroundEndColor?: string;
  locationType: LocationTypes;
  downloadable: boolean;
}

export enum TitleEnum {
  title = 'title',
  notitle = 'notitle',
}

export interface GraphicURLOpts extends Omit<SetDef, 'locations'> {
  // [key: string]: string | boolean | undefined
  occasionSlug: string;
  lang: string;
  noTitle: boolean;
  marketSlug: string;
}

export interface OverallOpts {
  occasionSlug: string;
  season: string;
  endYear: number;
  ticksCount?: number;
}
