const _ = require('lodash');
const Bluebird = require('bluebird');

/**
 * Calculator
 */
const Calculator = {
    multiply: {
       start: 1,
       symbol: '*',
       operation: (partial, value) => {
        return partial * value;
      }
    },
    sum: {
       start: 0,
       symbol: '+',
       operation: (partial, value) => {
          return partial + value;
       }
    },
    divide: {
      start: 1,
      symbol: '/',
      operation: (partial, value) => {
          if(partial === 1) {
            return value;
          }
          return partial / value;
      }
    },
    subtract: {
      start: 0,
      symbol: '-',
      operation: (partial, value) => {
          if(partial === 0) {
            return value;
          }
          return partial - value;
      }
    }
}

/**
 * Perform async computation on all lists
 * 
 * @param {Array<Number>} lists 
 * @param {function} operation 
 * @return {Array<Promise>}
 */
function computeAsync(lists, calculator) {
    return _.map(lists, list => {
       return new Promise((resolve, reject) => {
         try {
            const computed = _.reduce(list, calculator.operation, calculator.start);
            resolve(computed);
         } catch(error) {
            reject(error);
         }
      })
   })
}

/**
 * Compute all promises
 * 
 * @param {Array<Array<Number>>} numberLists 
 * @param {function} computation 
 */
function computeAllAsync(numberLists, computation = Calculator.sum) {
     return Bluebird.all(computeAsync(numberLists, computation))
     .then(results => {
         let idx = 0;
        _.forEach(results, result => {
           console.log(`${computation.symbol} over ${numberLists[idx++]} = ${result}`);
        })
     }).catch( error => console.log(error))
}

// Examples
computeAllAsync([
  [1, 3, 4,],
  [12, 6],
  [1, 3, 5, 7, 9],
  [10, 100, 1000]
]);

computeAllAsync([
  [1, 3, 4,],
  [12, 6],
  [1, 3, 5, 7, 9],
  [100, 100, 1000]
], Calculator.subtract);

computeAllAsync([
  [1, 3, 4,],
  [12, 6],
  [1, 3, 5, 7, 9],
  [10, 100, 1000]
], Calculator.multiply);
