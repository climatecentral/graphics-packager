// import querystring from 'querystring';

const IMG_URL_BASE = 'https://images.climatecentral.org/web-image';
const GRAPHICS_URL_BASE = 'https://graphics.climatecentral.org';
const MARKETS_API =
  'https://9pglbdveii.execute-api.us-east-1.amazonaws.com/stage/web-image?url=https%3A%2F%2Fapi.climatecentral.org%2Fv1%2Fcmmarket%2F&getRaw=true&contentType=application/json';

async function getMarketLocations() {
  const resp = await fetch(MARKETS_API);
  const data = await resp.json();
  const locations = {};
  for (const res of data.results) {
    locations[res.cm_slug] = res.name;
  }
  return locations;
}

function graphicSvcOpts(title, background) {
  if (background) {
    background = {};
  } else {
    background = { backgroundStartColor: 'none', backgroundType: 'Solid' };
  }
  return [!title, background];
}

// function holidayUrl(
//   occasionSlug,
//   endYear,
//   marketSlug,
//   lang,
//   title,
//   background,
// ) {
//   const [noTitle, backgroundOpts] = graphicSvcOpts(title, background);
//   const queryParams = querystring.stringify({
//     occasionSlug: occasionSlug,
//     variable: 'mean_tavg',
//     marketSlug: marketSlug,
//     endYear: endYear,
//     lang: lang,
//     noTitle: noTitle,
//     ...backgroundOpts,
//   });
//   return `${GRAPHICS_URL_BASE}/?${queryParams}`;
// }

// function climdivMapUrl(aggPeriod, endYear, _, lang, title, background) {
//   const [noTitle, backgroundOpts] = graphicSvcOpts(title, background);
//   const queryParams = new URLSearchParams({
//     graphicType: 'mapGraphic',
//     season: aggPeriod,
//     variable: 'tmpc',
//     ticksCount: 3,
//     endYear,
//     lang,
//     noTitle,
//     ...backgroundOpts,
//   }).toString();
//   return `${GRAPHICS_URL_BASE}/?${queryParams}`;
// }

function imgUrl(graphicUrl) {
  const imgUrl = `${IMG_URL_BASE}/?url=${encodeURIComponent(graphicUrl)}`;
  return imgUrl;
}

export async function generateMetadata({
  season,
  language_opts = ['en', 'es'],
  background_opts = [true, false],
  title_opts = [true, false],
  downloadableGraphicSets = [
    'Fall Days Above Normal',
    'Average Fall Temperature',
  ],
  variablesForGraphicSetNames = {
    'Fall Days Above Normal': 'dabn_tavg',
    'Average Fall Temperature': 'mean_tavg',
  },
}) {
  //, endYear) {
  const marketLocations = await getMarketLocations();

  const GRAPHIC_SETS = {
    'Average Fall Temperature': {
      graphicURLOpts: { graphicType: 'lineChart' },
      locations: marketLocations,
    },
    'Fall Days Above Normal': {
      graphicURLOpts: { graphicType: 'lineChart' },
      locations: marketLocations,
    },
    'Fall Warming Map': {
      graphicURLOpts: { graphicType: 'mapGraphic', variable: 'tmpc' },
      locations: { CONUS: 'Contiguous United States' },
    },
  };

  function getGraphicURL({
    graphicType = 'lineChart',
    aggPeriod,
    variable,
    endYear,
    marketSlug,
    lang,
    title,
    background,
  }) {
    const [noTitle, backgroundOpts] = graphicSvcOpts(title, background);
    const queryParams = new URLSearchParams({
      graphicType,
      season: aggPeriod,
      variable,
      ticksCount: 3,
      endYear,
      lang,
      noTitle,
      marketSlug,
      ...backgroundOpts,
    }).toString();
    return `${GRAPHICS_URL_BASE}/?${queryParams}`;
  }

  const metadata = [];

  for (const graphicSetName in GRAPHIC_SETS) {
    const { graphicURLOpts, locations } = GRAPHIC_SETS[graphicSetName];
    for (const marketSlug in locations) {
      for (const hasTitle of title_opts) {
        for (const hasBackground of background_opts) {
          for (const language of language_opts) {
            const graphicUrl = getGraphicURL(
              Object.assign({}, graphicURLOpts, {
                hasTitle,
                hasBackground,
                marketSlug,
                language,
              })
            );

            const variable = variablesForGraphicSetNames[graphicSetName];
            metadata.push({
              graphicSet: graphicSetName,
              url: imgUrl(graphicUrl),
              title: hasTitle ? 'title' : 'notitle',
              lang: language,
              extension: hasBackground ? 'jpg' : 'png',
              location: {
                key: marketSlug,
                name: locations[marketSlug],
                latitude: null,
                longitude: null,
              },
              downloadable: downloadableGraphicSets.includes(graphicSetName),
              season,
              variable,
              setType: graphicSetName,
              // dataURL: `https://rtc-prod.climatecentral.org/api/v1/graphic-data/trend/?agg_time=${season}&station_id=${marketSlug}&trend_year_range=1970-${endYear}&variable=${variable}&format=csv`,
            });
          }
        }
      }
    }
  }

  return metadata;
}
