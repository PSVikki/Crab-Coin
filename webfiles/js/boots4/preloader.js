

import spUtils from './Util';

/*-----------------------------------------------
|   Pre-loader
-----------------------------------------------*/
$.holdReady(true);


$($('main')).imagesLoaded().always( () => {
  $.holdReady(false);
});

spUtils.$document.ready(() => {
  const $preloader = $('#preloader');
  $preloader.addClass('loaded');
  setTimeout(() => {
    $preloader.remove();
  }, 800);
});
