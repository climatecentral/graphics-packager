import {
  OverallOpts,
  SetDef,
  GraphicURLOpts,
  TitleEnum,
  BackgroundCombo,
  Station,
} from '../types';
import { multiplyArrayFactors } from './multiply-array-factors';
import omit from 'lodash.omit';
import { select } from 'd3-selection';

// const IMG_URL_BASE = 'https://images.climatecentral.org/web-image';
const IMG_URL_BASE = 'https://api.climatecentral.org/v1/web-image';
const GRAPHICS_URL_BASE = 'https://graphics.climatecentral.org';
// const GRAPHICS_URL_BASE = 'http://localhost:8000';
const DATA_URL_BASE = 'https://rtc-prod.climatecentral.org';
const MARKETS_API =
  'https://9pglbdveii.execute-api.us-east-1.amazonaws.com/stage/web-image?url=https%3A%2F%2Fapi.climatecentral.org%2Fv1%2Fcmmarket%2F&getRaw=true&contentType=application/json';

let marketData: Record<string, Station>;

export async function generateMetadata({
  overallOpts,
  setDefs,
}: {
  overallOpts: OverallOpts;
  setDefs: SetDef[];
}) {
  marketData = await getMarketLocations();

  var factors = [
    setDefs,
    Object.keys(marketData),
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
    lang: string,
  ) {

    let graphicURLOpts: GraphicURLOpts = Object.assign({
      graphicType: setDef.graphicType,
      variable: setDef.variable,
      season: overallOpts.season,
      endYear: overallOpts.endYear,
      ticksCount: setDef.ticksCount,
      lang,
      noTitle: titleEnum === 'notitle',
      marketSlug,
      backgroundType: backgroundCombo.backgroundType,
      backgroundStartColor: backgroundCombo.backgroundStartColor,
    });

    // The graphics lib determines season from occasionSlug based on its config;
    // therefore we pass either season (default) or only occasionSlug as a URL param.
    if (overallOpts.occasionSlug) {
      graphicURLOpts.occasionSlug = overallOpts.occasionSlug;
      delete graphicURLOpts.season;
    }

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

    const cacheCheckbox = select('#use-cache');
    const cache = cacheCheckbox.property('checked') ? 'persist' : 'none';

    return {
      graphicSet: setDef.name,
      url: `${IMG_URL_BASE}/?delay=3000&cache=${cache}&url=${encodeURIComponent(graphicURL)}`,
      graphicURL,
      title: titleEnum,
      lang,
      extension: backgroundCombo.backgroundType === 'Image URL' ? 'jpg' : 'png',
      location: {
        key: marketSlug,
        name: marketData[marketSlug].name,
        latitude: null,
        longitude: null,
      },
      downloadable: setDef.downloadable,
      season: overallOpts.season,
      variable: setDef.variable,
      setType: setDef.name,
      dataURL: setDef.downloadable ? `${DATA_URL_BASE}/api/v1/graphic-data/trend/?agg_time=${overallOpts.season}&station_id=${marketData[marketSlug].station}&trend_year_range=1970-${overallOpts.endYear}&variable=${setDef.variable}&format=csv` : null,
    };
  }
}

async function getMarketLocations() {
  if (marketData) {
    return marketData;
  }

  const resp = await fetch(MARKETS_API);
  const data = await resp.json();
  marketData = {};
  for (const res of data.results) {
    marketData[res.cm_slug as string] = { name: res.name, station: res.master_station };
  }
  return marketData;
}
