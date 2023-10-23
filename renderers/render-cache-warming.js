import { select } from 'd3-selection';

var buttonSel = select('#cache-warm-button');

var progressTextArea = select('.visit-progress').node();
var visitedURLsRoot = select('.visited-urls');

export function renderCacheWarming({
  onCacheWarmClick,
  progressText,
  visitedURLs,
}) {
  buttonSel.on('click', onCacheWarmClick);
  progressTextArea.value = progressText;
  renderVisitedURLs(visitedURLs);
}

function renderVisitedURLs(visitedURLs) {
  var visitedItemsSel = visitedURLsRoot.selectAll('li').data(visitedURLs);

  visitedItemsSel.exit().remove();

  var newItemsSel = visitedItemsSel.enter().append('li');
  newItemsSel.append('a').attr('target', '_blank');

  var stillPresentItemsSel = newItemsSel.merge(visitedItemsSel);

  stillPresentItemsSel
    .select('a')
    .attr('href', (a) => a)
    .text((a) => a);
}
