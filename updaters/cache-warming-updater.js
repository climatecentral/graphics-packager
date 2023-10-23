import { visitURLs } from '../tasks/visit-metadata-urls';
import { renderCacheWarming } from '../renderers/render-cache-warming';

export function CacheWarmingUpdater() {
  var progressText = '';
  var visitedURLs = [];
  var metadata;

  renderCacheWarming({
    onCacheWarmClick,
    progressText,
    visitedURLs,
  });

  return { setMetadata };

  function setMetadata(generatedMetadata) {
    metadata = generatedMetadata;
  }

  function onCacheWarmClick() {
    visitURLs({ metadata, reportProgress, reportVisit, done });
  }

  function reportProgress(newProgress) {
    progressText += '\n' + newProgress;
    renderCacheWarming({
      onCacheWarmClick,
      progressText,
      visitedURLs,
    });
  }

  function reportVisit(url) {
    visitedURLs.push(url);
    renderCacheWarming({
      onCacheWarmClick,
      progressText,
      visitedURLs,
    });
  }

  function done(error) {
    if (error) {
      reportProgress('Finished with error: ' + error.message);
    } else {
      reportProgress('Finished without error!');
    }
  }
}
