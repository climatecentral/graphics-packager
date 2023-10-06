export interface SetDef {
  graphicType: 'lineChart' | 'mapGraphic';
  variable: string;
  locations: Record<string, string>;
}
