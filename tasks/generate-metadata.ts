import { OverallOpts, SetDef, GraphicURLOpts, TitleEnum } from '../types';
import { multiplyArrayFactors } from './multiply-array-factors';

const IMG_URL_BASE = 'https://images.climatecentral.org/web-image';
const GRAPHICS_URL_BASE = 'https://graphics.climatecentral.org';
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
  var downloadableGraphicSets = [
    'Fall Days Above Normal',
    'Average Fall Temperature',
  ];
  marketNamesForSlugs = await getMarketLocations();

  var factors = [
    setDefs,
    Object.keys(marketNamesForSlugs),
    // titleEnum
    ['title', 'notitle'],
    // hasBG
    [true, false],
    // lang
    ['en', 'es'],
  ];
  var combinations = multiplyArrayFactors(factors);

  return combinations.map(
    (paramArray: [SetDef, string, TitleEnum, boolean, string]) =>
      getMetadatum.apply(getMetadatum, paramArray)
  );

  function getMetadatum(
    setDef: SetDef,
    marketSlug: string,
    titleEnum: TitleEnum,
    hasBG: boolean,
    lang: string
  ) {
    // TODO: Handle setDef.locationType === 'conus'.
    let graphicURLOpts: GraphicURLOpts = Object.assign(
      {
        season: overallOpts.season,
        aggPeriod: overallOpts.season,
        endYear: overallOpts.endYear,
        ticksCount: overallOpts.ticksCount,
        lang,
        titleEnum,
        marketSlug,
      },
      setDef
    );

    // TODO: Set bg params when graphics supports it.
    // if (hasBG) {
    //   graphicURLOpts.backgroundType = setDef.backgroundType;
    //   if (setDef.backgroundType === 'imageURL') {
    //     graphicURLOpts.imageURL = setDef.imageURL;
    //   }
    // }
    const queryString = new URLSearchParams(
      graphicURLOpts as unknown as Record<string, string>
    ).toString();
    const graphicURL = `${GRAPHICS_URL_BASE}/?${queryString}`;

    // const variable = variablesForGraphicSetNames[graphicSetName];
    return {
      graphicSet: setDef.name,
      url: `${IMG_URL_BASE}/?url=${encodeURIComponent(graphicURL)}`,
      graphicURL,
      title: titleEnum,
      lang,
      extension: hasBG ? 'jpg' : 'png',
      location: {
        key: marketSlug,
        name: marketNamesForSlugs[marketSlug],
        latitude: null,
        longitude: null,
      },
      downloadable: downloadableGraphicSets.includes(setDef.name),
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
