import './app.css';
import handleError from 'handle-error-web';
import { version } from './package.json';
import { renderMetadataForm } from './renderers/render-metadata-form';
import { renderSets } from './renderers/render-sets';
import { runMetadataGeneration } from './updaters/run-metadata-generation';
import { CacheWarmingUpdater } from './updaters/cache-warming-updater';
import { SetDef, LocationTypes } from './types';

var setDefs: SetDef[] = [];

var fieldPacks = [
  { id: 'season', name: 'Season', defaultValue: 'winter' },
  { id: 'occasionSlug', name: 'occasionSlug', defaultValue: '' },
  { id: 'endYear', name: 'End year', defaultValue: '2023' },
];

(async function go() {
  window.addEventListener('error', reportTopLevelError);
  renderVersion();
  renderMetadataForm({ fieldPacks, runMetadataGeneration, onMetadata });
  renderSets({ setDefs, onAddSet });
  var warmingUpdater = CacheWarmingUpdater();

  function onMetadata(metadata: unknown) {
    warmingUpdater.setMetadata(metadata);
  }
})();

function onAddSet() {
  setDefs.push({
    name: 'New set',
    graphicType: 'lineChart',
    variable: 'tavg',
    locationType: LocationTypes.market,
    downloadable: true,
  });
  renderSets({ setDefs, onAddSet });
}

function reportTopLevelError(errorEvent: ErrorEvent) {
  handleError(errorEvent.error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info') as HTMLElement;
  versionInfo.textContent = version;
}
