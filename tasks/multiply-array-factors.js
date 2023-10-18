import memoize from 'lodash.memoize';

export function multiplyArrayFactors(arrayFactors, product1D = []) {
  var memoizedMultiply = memoize(executeMultiply, getArgHash);
  return memoizedMultiply(arrayFactors, product1D);

  function executeMultiply(arrayFactors, product1D = []) {
    var arrayFactor = arrayFactors[0];
    var restOfArrayFactors = arrayFactors.slice(1);
    // console.log('arrayFactor', arrayFactor);
    // console.log('product1D', product1D);
    if (restOfArrayFactors.length < 1) {
      return arrayFactor.map((factorItem) => product1D.concat(factorItem));
    }
    return arrayFactor
      .map((factorItem) =>
        memoizedMultiply(restOfArrayFactors, product1D.concat([factorItem]))
      )
      .flat();
  }
}

function getArgHash(multiplyArrayFactors, product1D) {
  return (
    multiplyArrayFactors.map(getArrayHash).join('-') +
    '_' +
    getArrayHash(product1D)
  );
}

function getArrayHash(array) {
  return array.map(getItemHash).join('-');
}

function getItemHash(item) {
  if (typeof item === 'object') {
    return item.name || item.toString();
  }
  if (Array.isArray(item)) {
    return getArrayHash(item);
  }
  return item.toString();
}
