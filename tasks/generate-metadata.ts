import {
  OverallOpts,
  SetDef,
  GraphicURLOpts,
  TitleEnum,
  BackgroundCombo,
} from '../types';
import { multiplyArrayFactors } from './multiply-array-factors';
import omit from 'lodash.omit';

const IMG_URL_BASE = 'https://images.climatecentral.org/web-image';
const GRAPHICS_URL_BASE = 'https://graphics.climatecentral.org';
// const GRAPHICS_URL_BASE = 'http://localhost:8000';
const MARKETS_API =
  'https://9pglbdveii.execute-api.us-east-1.amazonaws.com/stage/web-image?url=https%3A%2F%2Fapi.climatecentral.org%2Fv1%2Fcmmarket%2F&getRaw=true&contentType=application/json';

var marketNamesForSlugs: Record<string, string>;

export async function generateMetadata({
  overallOpts,
  setDefs,
}: {
  overallOpts: OverallOpts;
  setDefs: SetDef[];
}) {
  var { season } = overallOpts;
  marketNamesForSlugs = await getMarketLocations();

  var factors = [
    setDefs,
    Object.keys(marketNamesForSlugs),
    // titleEnum
    ['title', 'notitle'],
    // backgroundCombo
    [
      { name: 'imageBG', backgroundType: 'Image URL' },
      { name: 'noBG', backgroundType: 'Solid', backgroundStartColor: 'none' },
    ],
    // lang
    ['en', 'es'],
  ];
  var combinations = multiplyArrayFactors(factors);

  return combinations.map(
    (paramArray: [SetDef, string, TitleEnum, BackgroundCombo, string]) =>
      getMetadatum.apply(getMetadatum, paramArray)
  );

  function getMetadatum(
    setDef: SetDef,
    marketSlug: string,
    titleEnum: TitleEnum,
    backgroundCombo: BackgroundCombo,
    lang: string
  ) {
    let graphicURLOpts: GraphicURLOpts = Object.assign({
      graphicType: setDef.graphicType,
      variable: setDef.variable,
      occasionSlug: overallOpts.occasionSlug,
      season: overallOpts.season,
      endYear: overallOpts.endYear,
      ticksCount: setDef.ticksCount,
      lang,
      noTitle: titleEnum === 'notitle',
      marketSlug,
      backgroundType: backgroundCombo.backgroundType,
      backgroundStartColor: backgroundCombo.backgroundStartColor,
    });

    if (setDef.locationType === 'conus') {
      delete graphicURLOpts.marketSlug;
    }

    const queryString = new URLSearchParams(
      // For now, eliminate the stuff graphics does
      // not read in the URL.
      omit(
        graphicURLOpts,
        'name',
        'backgroundEndColor',
        'locationType',
        'downloadable'
      ) as unknown as Record<string, string>
    ).toString();
    const graphicURL = `${GRAPHICS_URL_BASE}/?${queryString}`;

    // const variable = variablesForGraphicSetNames[graphicSetName];
    return {
      graphicSet: setDef.name,
      url: `${IMG_URL_BASE}/?delay=3000&url=${encodeURIComponent(graphicURL)}`,
      graphicURL,
      title: titleEnum,
      lang,
      extension: backgroundCombo.backgroundType === 'Image URL' ? 'jpg' : 'png',
      location: {
        key: marketSlug,
        name: marketNamesForSlugs[marketSlug],
        latitude: null,
        longitude: null,
      },
      downloadable: setDef.downloadable,
      season,
      variable: setDef.variable,
      setType: setDef.name,
      // dataURL: `https://rtc-prod.climatecentral.org/api/v1/graphic-data/trend/?agg_time=${season}&station_id=${marketSlug}&trend_year_range=1970-${endYear}&variable=${variable}&format=csv`,
    };
  }
}

async function getMarketLocations() {
  if (marketNamesForSlugs) {
    return marketNamesForSlugs;
  }

  const resp = await fetch(MARKETS_API);
  const data = await resp.json();
  marketNamesForSlugs = {};
  for (const res of data.results) {
    marketNamesForSlugs[res.cm_slug as string] = res.name;
  }
  return marketNamesForSlugs;
}
