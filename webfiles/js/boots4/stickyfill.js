'use strict';

import spUtils from './Util';

/*
  global Stickyfill
*/

/*-----------------------------------------------
|   Sticky fill
-----------------------------------------------*/
spUtils.$document.ready(() => {
  Stickyfill.add($('.sticky-top'));
});
