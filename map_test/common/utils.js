'use strict';
module.exports = {
  isFloat: (val) => {
    return Number(val) === val && val % 1 !== 0;
  },
  isInt: (val) => {
    return Number(val) === val && val % 1 === 0;
  },
  isNumber: (val) => {
    if(Number(val) === val && val % 1 !== 0 || Number(val) === val && val % 1 === 0) return true;
    else false;
  }
}