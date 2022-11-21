"use strict";

var _this2 = this;

/*-----------------------------------------------
|   Utilities
-----------------------------------------------*/
var spUtils = function ($) {
  var Utils = {
    $window: $(window),
    $document: $(document),
    $html: $('html'),
    $body: $('body'),
    $main: $('main'),
    isRTL: function isRTL() {
      return this.$html.attr('dir') === 'rtl';
    },
    location: window.location,
    nua: navigator.userAgent,
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200
    },
    offset: function offset(element) {
      var rect = element.getBoundingClientRect();
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
      };
    },
    isScrolledIntoViewJS: function isScrolledIntoViewJS(element) {
      var windowHeight = window.innerHeight;
      var elemTop = this.offset(element).top;
      var elemHeight = element.offsetHeight;
      var windowScrollTop = window.scrollY;
      return elemTop <= windowScrollTop + windowHeight && windowScrollTop <= elemTop + elemHeight;
    },
    isScrolledIntoView: function isScrolledIntoView(el) {
      var $el = $(el);
      var windowHeight = this.$window.height();
      var elemTop = $el.offset().top;
      var elemHeight = $el.height();
      var windowScrollTop = this.$window.scrollTop();
      return elemTop <= windowScrollTop + windowHeight && windowScrollTop <= elemTop + elemHeight;
    },
    getCurrentScreanBreakpoint: function getCurrentScreanBreakpoint() {
      var _this = this;

      var currentScrean = '';
      var windowWidth = this.$window.width();
      $.each(this.breakpoints, function (index, value) {
        if (windowWidth >= value) {
          currentScrean = index;
        } else if (windowWidth >= _this.breakpoints.xl) {
          currentScrean = 'xl';
        }
      });
      return {
        currentScrean: currentScrean,
        currentBreakpoint: this.breakpoints[currentScrean]
      };
    }
  };
  return Utils;
}(jQuery);
/*-----------------------------------------------
|   Variables
-----------------------------------------------*/

/*
  global opr, safari
*/

/*-----------------------------------------------
|   Detector
-----------------------------------------------*/


var spDetector = function () {
  var Detector = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(spUtils.nua),
    isOSX: spUtils.nua.match(/(iPad|iPhone|iPod|Macintosh)/g),
    isOpera: !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
    isFirefox: typeof InstallTrigger !== 'undefined',
    isSafari: /constructor/i.test(window.HTMLElement) || function (p) {
      return p.toString() === '[object SafariRemoteNotification]';
    }(!window.safari || safari.pushNotification),
    isNewerIE: spUtils.nua.match(/msie (9|([1-9][0-9]))/i),
    isOlderIE: spUtils.nua.match(/msie/i) && !_this2.isNewerIE,
    isAncientIE: spUtils.nua.match(/msie 6/i),
    isIE: _this2.isAncientIE || _this2.isOlderIE || _this2.isNewerIE,
    isIE11: !!window.MSInputMethodContext && !!document.documentMode,
    isEdge: !_this2.isIE11 && !_this2.isIE && !!window.StyleMedia,
    isChrome: !!window.chrome && !!window.chrome.webstore,
    isBlink: (_this2.isChrome || _this2.isOpera) && !!window.CSS,
    isPuppeteer: spUtils.nua.match(/puppeteer/i),
    isIOS: parseFloat((/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(spUtils.nua) || [0, ''])[1].replace('undefined', '3_2').replace('_', '.').replace('_', '')) || false,
    iPadiPhoneFirefox: spUtils.nua.match(/iPod|iPad|iPhone/g) && spUtils.nua.match(/Gecko/g),
    macFirefox: spUtils.nua.match(/Macintosh/g) && spUtils.nua.match(/Gecko/g) && spUtils.nua.match(/rv:/g),
    isAndroid: spUtils.nua.indexOf('Mozilla/5.0') > -1 && spUtils.nua.indexOf('Android ') > -1 && spUtils.nua.indexOf('AppleWebKit') > -1
  };
  spUtils.$document.ready(function () {
    if (Detector.isOpera) spUtils.$html.addClass('opera');
    if (Detector.isMobile) spUtils.$html.addClass('mobile');
    if (Detector.isOSX) spUtils.$html.addClass('osx');
    if (Detector.isFirefox) spUtils.$html.addClass('firefox');
    if (Detector.isSafari) spUtils.$html.addClass('safari');
    if (Detector.isIOS) spUtils.$html.addClass('ios');
    if (Detector.isIE || Detector.isIE11) spUtils.$html.addClass('ie');
    if (Detector.isEdge) spUtils.$html.addClass('edge');
    if (Detector.isChrome) spUtils.$html.addClass('chrome');
    if (Detector.isBlink) spUtils.$html.addClass('blink');
    if (Detector.isPuppeteer) spUtils.$html.addClass('puppeteer');
  });
  return Detector;
}(); // //////////////////////////////////////
//
// Universal contact form ajax submission
//
// //////////////////////////////////////


$(document).ready(function () {
  if ($('.zform').length) {
    var submitButtonValue = {
      set: function set($elm, value) {
        if ($elm.prop('tagName') === 'BUTTON') {
          $elm.html(value);
          return;
        }

        $elm.val(value);
      },
      get: function get($elm) {
        var value = $elm.val();

        if (value === '') {
          return $elm.html();
        }

        return value;
      }
    };
    $('.zform').each(function (index, value) {
      var $form = $(value);
      $form.on('submit', function (e) {
        e.preventDefault();

        if ($('#g-recaptcha-response').val() === '') {
          $form.find('.zform-feedback').html('<div class="alert alert-danger alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Please, verify you are a human!</div>');
          return;
        }

        var $submit = $form.find(':submit');
        var submitText = submitButtonValue.get($submit);
        submitButtonValue.set($submit, 'Sending...');
        $.ajax({
          type: 'post',
          url: 'assets/php/form-processor.php',
          data: $form.serialize() // again, keep generic so this applies to any form

        }).done(function (result) {
          // if(result.status ==)
          $form.find('.zform-feedback').html(result);
          submitButtonValue.set($submit, submitText);
          window.grecaptcha.reset();
          $form.trigger('reset');
        }).fail(function (xhr) {
          $form.find('.zform-feedback').html(xhr.responseText);
          submitButtonValue.set($submit, submitText);
        });
      });
    });
  }
});
/*-----------------------------------------------
|   Gooogle Map
-----------------------------------------------*/

/*
  global google
*/

function initMap() {
  var $googlemaps = $('.googlemap');

  if ($googlemaps.length) {
    // Visit https://snazzymaps.com/ for more themes
    var mapStyles = {
      Default: [{
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#e9e9e9'
        }, {
          lightness: 17
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{
          color: '#f5f5f5'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#ffffff'
        }, {
          lightness: 17
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#ffffff'
        }, {
          lightness: 29
        }, {
          weight: 0.2
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
          color: '#ffffff'
        }, {
          lightness: 18
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{
          color: '#ffffff'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          color: '#f5f5f5'
        }, {
          lightness: 21
        }]
      }, {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{
          color: '#dedede'
        }, {
          lightness: 21
        }]
      }, {
        elementType: 'labels.text.stroke',
        stylers: [{
          visibility: 'on'
        }, {
          color: '#ffffff'
        }, {
          lightness: 16
        }]
      }, {
        elementType: 'labels.text.fill',
        stylers: [{
          saturation: 36
        }, {
          color: '#333333'
        }, {
          lightness: 40
        }]
      }, {
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          color: '#f2f2f2'
        }, {
          lightness: 19
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#fefefe'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#fefefe'
        }, {
          lightness: 17
        }, {
          weight: 1.2
        }]
      }],
      Gray: [{
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{
          saturation: 36
        }, {
          color: '#000000'
        }, {
          lightness: 40
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{
          visibility: 'on'
        }, {
          color: '#000000'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 17
        }, {
          weight: 1.2
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 21
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 17
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 29
        }, {
          weight: 0.2
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 18
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 19
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 17
        }]
      }],
      Midnight: [{
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#ffffff'
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 13
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#144b53'
        }, {
          lightness: 14
        }, {
          weight: 1.4
        }]
      }, {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{
          color: '#08304b'
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          color: '#0c4152'
        }, {
          lightness: 5
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#0b434f'
        }, {
          lightness: 25
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#0b3d51'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }]
      }, {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{
          color: '#146474'
        }]
      }, {
        featureType: 'water',
        elementType: 'all',
        stylers: [{
          color: '#021019'
        }]
      }],
      Hopper: [{
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          hue: '#165c64'
        }, {
          saturation: 34
        }, {
          lightness: -69
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{
          hue: '#b7caaa'
        }, {
          saturation: -14
        }, {
          lightness: -18
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'landscape.man_made',
        elementType: 'all',
        stylers: [{
          hue: '#cbdac1'
        }, {
          saturation: -6
        }, {
          lightness: -9
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          hue: '#8d9b83'
        }, {
          saturation: -89
        }, {
          lightness: -12
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          hue: '#d4dad0'
        }, {
          saturation: -88
        }, {
          lightness: 54
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
          hue: '#bdc5b6'
        }, {
          saturation: -89
        }, {
          lightness: -3
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{
          hue: '#bdc5b6'
        }, {
          saturation: -89
        }, {
          lightness: -26
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          hue: '#c17118'
        }, {
          saturation: 61
        }, {
          lightness: -45
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'poi.park',
        elementType: 'all',
        stylers: [{
          hue: '#8ba975'
        }, {
          saturation: -46
        }, {
          lightness: -28
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          hue: '#a43218'
        }, {
          saturation: 74
        }, {
          lightness: -51
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'administrative.province',
        elementType: 'all',
        stylers: [{
          hue: '#ffffff'
        }, {
          saturation: 0
        }, {
          lightness: 100
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'administrative.neighborhood',
        elementType: 'all',
        stylers: [{
          hue: '#ffffff'
        }, {
          saturation: 0
        }, {
          lightness: 100
        }, {
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.locality',
        elementType: 'labels',
        stylers: [{
          hue: '#ffffff'
        }, {
          saturation: 0
        }, {
          lightness: 100
        }, {
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.land_parcel',
        elementType: 'all',
        stylers: [{
          hue: '#ffffff'
        }, {
          saturation: 0
        }, {
          lightness: 100
        }, {
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{
          hue: '#3a3935'
        }, {
          saturation: 5
        }, {
          lightness: -57
        }, {
          visibility: 'off'
        }]
      }, {
        featureType: 'poi.medical',
        elementType: 'geometry',
        stylers: [{
          hue: '#cba923'
        }, {
          saturation: 50
        }, {
          lightness: -46
        }, {
          visibility: 'on'
        }]
      }],
      Beard: [{
        featureType: 'poi.business',
        elementType: 'labels.text',
        stylers: [{
          visibility: 'on'
        }, {
          color: '#333333'
        }]
      }],
      AssassianCreed: [{
        featureType: 'all',
        elementType: 'all',
        stylers: [{
          visibility: 'on'
        }]
      }, {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }, {
          saturation: '-100'
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{
          saturation: 36
        }, {
          color: '#000000'
        }, {
          lightness: 40
        }, {
          visibility: 'off'
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{
          visibility: 'off'
        }, {
          color: '#000000'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'all',
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 17
        }, {
          weight: 1.2
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 20
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#4d6059'
        }]
      }, {
        featureType: 'landscape',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#4d6059'
        }]
      }, {
        featureType: 'landscape.natural',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#4d6059'
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          lightness: 21
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#4d6059'
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#4d6059'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          visibility: 'on'
        }, {
          color: '#7f8d89'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#7f8d89'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#7f8d89'
        }, {
          lightness: 17
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#7f8d89'
        }, {
          lightness: 29
        }, {
          weight: 0.2
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 18
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#7f8d89'
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#7f8d89'
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 16
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#7f8d89'
        }]
      }, {
        featureType: 'road.local',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#7f8d89'
        }]
      }, {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          color: '#000000'
        }, {
          lightness: 19
        }]
      }, {
        featureType: 'water',
        elementType: 'all',
        stylers: [{
          color: '#2b3638'
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#2b3638'
        }, {
          lightness: 17
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#24282b'
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#24282b'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.text',
        stylers: [{
          visibility: 'off '
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }],
      SubtleGray: [{
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{
          saturation: '-100'
        }]
      }, {
        featureType: 'administrative.province',
        elementType: 'all',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{
          saturation: -100
        }, {
          lightness: 65
        }, {
          visibility: 'on'
        }]
      }, {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{
          saturation: -100
        }, {
          lightness: '50'
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'road',
        elementType: 'all',
        stylers: [{
          saturation: -100
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [{
          visibility: 'simplified'
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'all',
        stylers: [{
          lightness: '30'
        }]
      }, {
        featureType: 'road.local',
        elementType: 'all',
        stylers: [{
          lightness: '40'
        }]
      }, {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{
          saturation: -100
        }, {
          visibility: 'simplified'
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          hue: '#ffff00'
        }, {
          lightness: -25
        }, {
          saturation: -97
        }]
      }, {
        featureType: 'water',
        elementType: 'labels',
        stylers: [{
          lightness: -25
        }, {
          saturation: -100
        }]
      }],
      Tripitty: [{
        featureType: 'all',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [{
          color: '#2c5ca5'
        }]
      }, {
        featureType: 'poi',
        elementType: 'all',
        stylers: [{
          color: '#2c5ca5'
        }]
      }, {
        featureType: 'road',
        elementType: 'all',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'transit',
        elementType: 'all',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'water',
        elementType: 'all',
        stylers: [{
          color: '#193a70'
        }, {
          visibility: 'on'
        }]
      }]
    };
    $googlemaps.each(function (index, value) {
      var $googlemap = $(value);
      var latLng = $googlemap.data('latlng').split(',');
      var markerPopup = $googlemap.html();
      var icon = $googlemap.data('icon') ? $googlemap.data('icon') : 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png';
      var zoom = $googlemap.data('zoom');
      var mapStyle = $googlemap.data('theme');
      var mapElement = value;

      if ($googlemap.data('theme') === 'streetview') {
        var pov = $googlemap.data('pov');
        var _mapOptions = {
          position: {
            lat: Number(latLng[0]),
            lng: Number(latLng[1])
          },
          pov: pov,
          zoom: zoom,
          gestureHandling: 'none',
          scrollwheel: false
        };
        return new google.maps.StreetViewPanorama(mapElement, _mapOptions);
      }

      var mapOptions = {
        zoom: zoom,
        scrollwheel: $googlemap.data('scrollwheel'),
        center: new google.maps.LatLng(latLng[0], latLng[1]),
        styles: mapStyles[mapStyle]
      };
      var map = new google.maps.Map(mapElement, mapOptions);
      var infowindow = new google.maps.InfoWindow({
        content: markerPopup
      });
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latLng[0], latLng[1]),
        icon: icon,
        map: map
      });
      marker.addListener('click', function () {
        infowindow.open(map, marker);
      });
      return null;
    });
  }
}
/*-----------------------------------------------
|   Masonry with isotope
-----------------------------------------------*/


spUtils.$window.on('load', function () {
  var $sortables = $('.sortable');

  if ($sortables.length) {
    var Selector = {
      SORTABLE: '.sortable',
      SORTABLE_ITEM: '.sortable-item',
      SORTABLE_CONTAINER: '.sortable-container',
      MENU: '.menu',
      ITEM: '.item'
    };
    var ClassName = {
      ACTIVE: 'active'
    };
    var DATA_KEY = {
      OPTIONS: 'options',
      FILTER_GROUP: 'filter-group',
      FILTER: 'filter'
    };
    $sortables.each(function (index, value) {
      var $sortable = $(value);
      var $masonryContainer = $sortable.find(Selector.SORTABLE_CONTAINER);
      var $menu = $sortable.find(Selector.MENU);
      $(Selector.SORTABLE).imagesLoaded().done(function () {
        $masonryContainer.isotope($.extend($sortable.data(DATA_KEY.OPTIONS) || {}, {
          itemSelector: Selector.SORTABLE_ITEM,
          masonry: {
            columnWidth: Selector.SORTABLE_ITEM
          }
        }));
      });
      /*-----------------------------------------------
      |   Flatten object by concatting values
      -----------------------------------------------*/

      var concatValues = function concatValues(obj) {
        return Object.keys(obj).map(function (key) {
          return obj[key];
        }).join();
      };
      /*-----------------------------------------------
      |   Store filter for each group
      -----------------------------------------------*/


      var filters = {};
      $menu.on('click', Selector.ITEM, function (e) {
        var $masonryFilter = $(e.target);
        filters[$masonryFilter.parent().data(DATA_KEY.FILTER_GROUP) || 0] = $masonryFilter.data(DATA_KEY.FILTER);
        var filterValue = concatValues(filters);
        $masonryFilter.siblings().removeClass(ClassName.ACTIVE);
        $masonryFilter.addClass(ClassName.ACTIVE);
        $masonryContainer.isotope({
          filter: filterValue
        });
      });
    });
  }
});
/*-----------------------------------------------
|   Lightbox
-----------------------------------------------*/

/*
  global lightbox
*/

spUtils.$document.ready(function () {
  if ($('[data-lightbox]').length) {
    lightbox.option({
      resizeDuration: 400,
      wrapAround: true,
      fadeDuration: 300,
      imageFadeDuration: 300
    });
  }
});
/*-----------------------------------------------
|   Owl Carousel
-----------------------------------------------*/

var $carousel = $('.owl-carousel');
spUtils.$document.ready(function () {
  if ($carousel.length) {
    var Selector = {
      ALL_TIMELINE: '*[data-zanim-timeline]',
      ACTIVE_ITEM: '.owl-item.active'
    };
    var owlZanim = {
      zanimTimeline: function zanimTimeline($el) {
        return $el.find(Selector.ALL_TIMELINE);
      },
      play: function play($el) {
        if (this.zanimTimeline($el).length === 0) return;
        $el.find(Selector.ACTIVE_ITEM + " > " + Selector.ALL_TIMELINE).zanimation(function (animation) {
          animation.play();
        });
      },
      kill: function kill($el) {
        if (this.zanimTimeline($el).length === 0) return;
        this.zanimTimeline($el).zanimation(function (animation) {
          animation.kill();
        });
      }
    };
    $carousel.each(function (index, value) {
      var $this = $(value);
      var options = $this.data('options') || {};
      spUtils.isRTL() && (options.rtl = true);
      options.navText || (options.navText = ['<span class="fas fa-angle-left"></span>', '<span class="fas fa-angle-right"></span>']);
      options.touchDrag = true;
      $this.owlCarousel($.extend(options || {}, {
        onInitialized: function onInitialized(event) {
          owlZanim.play($(event.target));
        },
        onTranslate: function onTranslate(event) {
          owlZanim.kill($(event.target));
        },
        onTranslated: function onTranslated(event) {
          owlZanim.play($(event.target));
        }
      }));
    });
  }
});
/*-----------------------------------------------
|   Pre-loader
-----------------------------------------------*/

$.holdReady(true);
$($('main')).imagesLoaded().always(function () {
  $.holdReady(false);
});
spUtils.$document.ready(function () {
  var $preloader = $('#preloader');
  $preloader.addClass('loaded');
  setTimeout(function () {
    $preloader.remove();
  }, 800);
});
/*-----------------------------------------------
|   Rellax [Parallax]
-----------------------------------------------*/

/*
  global Rellax
*/

spUtils.$document.ready(function () {
  var Selector = {
    PARALLAX: '.parallax'
  };

  if ($(Selector.PARALLAX).length) {
    var callRellax = function callRellax() {
      return new Rellax(Selector.PARALLAX, {
        speed: -3
      });
    };

    if (!spDetector.isIE && !spDetector.isIE11 && !spDetector.isPuppeteer) callRellax();
  }
});
/*-----------------------------------------------
|   Remodal [video lightbox]
-----------------------------------------------*/

spUtils.$document.ready(function () {
  var $videoModals = $('.video-modal');

  if ($videoModals.length) {
    spUtils.$body.after("\n      <div id='videoModal' class='remodal remodal-video'>\n        <button data-remodal-action='close' class='remodal-close'></button>\n        <div class='embed-responsive embed-responsive-16by9'>\n          <div id='videoModalIframeWrapper'></div>\n        </div>\n      </div>\n    ");
    var $videoModal = $('#videoModal').remodal();
    var $videoModalIframeWrapper = $('#videoModalIframeWrapper');
    $videoModals.each(function (index, value) {
      $(value).on('click', function (e) {
        e.preventDefault();
        var $this = $(e.currentTarget);
        var ytId = $this.attr('href').split('/');
        var start = $this.data('start');
        var end = $this.data('end');

        if (ytId[2] === 'www.youtube.com') {
          $videoModalIframeWrapper.html("<iframe id='videoModalIframe' src='//www.youtube.com/embed/" + ytId[3].split('?v=')[1] + "?rel=0&amp;autoplay=1&amp;enablejsapi=0&amp;start=" + start + "&ampend=" + end + "' allowfullscreen' frameborder='0' class='embed-responsive-item hide'></iframe>");
        } else if (ytId[2] === 'vimeo.com') {
          $videoModalIframeWrapper.html("<iframe id='videoModalIframe' src='https://player.vimeo.com/video/" + ytId[3] + "?autoplay=1&title=0&byline=0&portrait=0 ?autoplay=1&title=0&byline=0&portrait=0 hide'></iframe>");
        }

        $videoModal.open();
      });
    });
    spUtils.$document.on('closed', '.remodal', function (e) {
      var $this = $(e.currentTarget);

      if ($this.attr('id') === 'videoModal') {
        $videoModalIframeWrapper.html('');
      }
    });
  }
});
/*-----------------------------------------------
|   Sementic UI
-----------------------------------------------*/

spUtils.$document.ready(function () {
  var uiDropdown = $('.ui.dropdown');
  var uiAccordion = $('.ui.accordion');
  /*-----------------------------------------------
  |   Dropdown
  -----------------------------------------------*/

  if (uiDropdown.length) {
    uiDropdown.dropdown();
  }
  /*-----------------------------------------------
  |   Accordion
  -----------------------------------------------*/


  if (uiAccordion.length) {
    uiAccordion.each(function (index, value) {
      var $this = $(value);
      $this.accordion($.extend({
        exclusive: false
      }, $this.data('options') || {}));
    });
  }
});
spUtils.$document.ready(function () {
  var Selector = {
    HOME: '#home',
    PAGE: '.page',
    CLOSEAREA: '.sticky-area',
    SIDEBARITEM: '.sidebar-item',
    SIDEBAR_ITEM_WRAPPER: '.sidebar-item-wrapper',
    BASECONTENT: '#baseContent',
    GRIDNAV: '#gridNav',
    PAGETITLE: '.page-title',
    CLOSEBUTTON: '.btn-close',
    SORTABLEMENU: '.sortable .menu',
    ITEM: '.item',
    ACTIVE: '.active',
    SORTABLECONTAINER: '.sortable-container',
    DOCUMENTNAV: '#docs-nav'
  };
  var DataKey = {
    CONTENT: 'content'
  };
  var gridNav = $(Selector.GRIDNAV);
  var baseContent = $(Selector.BASECONTENT);
  var homePage = $(Selector.HOME);
  var WindowLocation = window.location;
  var WindowHistory = window.history;
  var pages = [];
  var isInHome;
  var clickEvent = spDetector.isIOS ? 'tap' : 'click';
  var breakPoint;

  if (baseContent.length) {
    breakPoint = spUtils.breakpoints[baseContent.attr('class').split(' ').filter(function (cls) {
      return cls.indexOf('w-');
    }).pop().split('-')[1]];
  } //
  // ─── COUNT UP ───────────────────────────────────────────────────────────────────
  //


  var $counters = $('[data-countup]');

  var count = function count(isCounterStart) {
    if (isCounterStart === void 0) {
      isCounterStart = false;
    }

    if ($counters.length) {
      $counters.each(function (index, value) {
        var $counter = $(value);
        var counterStart = isCounterStart;
        var countTo = $counter.attr('data-countup');

        var countUP = function countUP() {
          $({
            countNum: 0
          }).animate({
            countNum: countTo
          }, {
            duration: 2000,
            easing: 'linear',
            step: function step() {
              $counter.text(Math.floor(this.countNum));
            },
            complete: function complete() {
              $counter.text(this.countNum);
            }
          });
        };

        countUP();
        spUtils.$window.on('scroll', function () {
          if (!counterStart && spUtils.isScrolledIntoView($counter)) {
            countUP();
            counterStart = true;
          }
        });
      });
    }
  }; //
  // ─── GET ALL PAGE NAME ──────────────────────────────────────────────────────────
  //


  $(Selector.SIDEBAR_ITEM_WRAPPER).each(function (item, value) {
    var $this = $(value);
    pages.push($this.data(DataKey.CONTENT));
  }); //
  // ─── GOToContent TO PAGE ─────────────────────────────────────────────────────────────────
  //

  var goToPage = function goToPage(content) {
    var position = spUtils.$window.width() < breakPoint ? '-100%' : '-50%';
    baseContent.css({
      left: position
    });
    gridNav.css({
      right: position
    });

    if (content) {
      var sortable = $("#" + content + " .sortable");
      var countUp = $("#" + content + " [data-countup]");
      $(Selector.PAGE).fadeOut('1000');
      $("#" + content).fadeIn('1000');
      $(Selector.CLOSEBUTTON).fadeIn('slow');

      if (sortable.length) {
        $(Selector.SORTABLEMENU).find(Selector.ACTIVE).removeClass('active');
        $(Selector.SORTABLEMENU).find(Selector.ITEM).first().addClass('active');
        setTimeout(function () {
          $(Selector.SORTABLECONTAINER).isotope({
            filter: '*'
          });
        }, 300);
      }

      if (countUp.length) {
        count(false);
      }

      setTimeout(function () {
        if (spUtils.$window.width() < breakPoint) {
          homePage.css('display', 'none');

          if ($.inArray(window.location.hash.substr(1), pages) > -1) {
            $(window).scrollTop(0);
          }
        }

        isInHome = false;
      }, 500);
    }
  }; //
  // ─── GOToContent TO HOME ─────────────────────────────────────────────────────────────────
  //


  var home = function home() {
    isInHome = true;

    if (spUtils.$window.width() < breakPoint) {
      homePage.css('display', 'block');
      setTimeout(function () {
        gridNav.css('right', 0);
        baseContent.css('left', 0);
        $(Selector.PAGE).fadeOut();
      }, 100);
    } else {
      baseContent.css({
        left: 0
      });
      gridNav.css({
        right: 0
      });
      $(Selector.PAGE).fadeOut();
    }
  }; //
  // ─── FIRST LOAD CONTENT ─────────────────────────────────────────────────────────
  //


  var load = function load() {
    var hash = window.location.hash;
    var pageId;

    if (document.getElementById(hash.substr(1))) {
      pageId = $(hash).closest('.page').attr('id');
    }

    if ($.inArray(hash.substr(1), pages) > -1) {
      goToPage(hash.substr(1));
    } else if ($.inArray(pageId, pages) > -1) {
      goToPage(pageId);
    } else {
      home();
      WindowLocation.replace('#');
      var newUrl = WindowLocation.href;
      newUrl.lastIndexOf('#') > -1 && (newUrl = newUrl.slice(0, -1));
      WindowHistory.replaceState({}, '', newUrl);
    }
  }; //
  // ─── LOAD ───────────────────────────────────────────────────────────────────────
  //


  load(); //
  // ─── CLICK EVENT FOR NAVIGATION ─────────────────────────────────────────────────
  //

  spUtils.$document.on(clickEvent, Selector.SIDEBAR_ITEM_WRAPPER, function (e) {
    var $this = $(e.target);
    var content = '';

    if ($this.closest(Selector.SIDEBAR_ITEM_WRAPPER).data(DataKey.CONTENT)) {
      content = $this.closest(Selector.SIDEBAR_ITEM_WRAPPER).data(DataKey.CONTENT);
    }

    window.location.hash = content;
  }); //
  // ─── CLICK EVENT FOR CLOSE AREA ─────────────────────────────────────────────────
  //

  spUtils.$document.on(clickEvent, Selector.CLOSEAREA, function () {
    window.location.hash = '';
    var newUrl = WindowLocation.href;
    newUrl.lastIndexOf('#') > -1 && (newUrl = newUrl.slice(0, -1));
    WindowHistory.replaceState({}, '', newUrl);
    home();
  }); //
  // ─── LOAD PAGE ON HASH CHANGE ───────────────────────────────────────────────────
  //

  window.onhashchange = function () {
    var url = window.location.href;
    var hash = window.location.hash;
    var pageId;

    if (document.getElementById(hash.substr(1))) {
      pageId = $(hash).closest('.page').attr('id');
    }

    var currentPage = $('.page:visible').attr('id');

    if ($.inArray(window.location.hash.substr(1), pages) > -1) {
      goToPage(window.location.hash.substr(1));
    } else if ($.inArray(pageId, pages) > -1) {
      if (currentPage !== pageId) {
        goToPage(pageId);
        $('html, body').animate({
          scrollTop: $(hash).offset().top - 30
        }, 100);
      }
    } else if (url.lastIndexOf('#') < 0 && window.location.hash === '') {
      home();
    }
  }; //
  // ─── ALIGN GRID NAV ON SCREEN RESIZE ────────────────────────────────────────────
  //


  spUtils.$window.on('resize', function () {
    if (spUtils.$window.width() < breakPoint && !isInHome) {
      homePage.css('display', 'none');
      baseContent.css({
        left: '-100%'
      });
      gridNav.css({
        right: '-100%'
      });
    } else {
      homePage.css('display', 'block');
    }
  });
});
/*
  global Stickyfill
*/

/*-----------------------------------------------
|   Sticky fill
-----------------------------------------------*/

spUtils.$document.ready(function () {
  Stickyfill.add($('.sticky-top'));
});
/*-----------------------------------------------
|   Sticky Kit
-----------------------------------------------*/

spUtils.$document.ready(function () {
  var stickyKit = $('.sticky-kit');

  if (stickyKit.length) {
    stickyKit.each(function (index, value) {
      $(value).stick_in_parent();
    });
  }
});
/*-----------------------------------------------
|   YTPlayer
-----------------------------------------------*/

spUtils.$document.ready(function () {
  var Selector = {
    BG_YOUTUBE: '.bg-youtube',
    BG_HOLDER: '.bg-holder'
  };
  var DATA_KEY = {
    PROPERTY: 'property'
  };
  var $youtubeBackground = $(Selector.BG_YOUTUBE);

  if ($youtubeBackground.length) {
    $youtubeBackground.each(function (index, value) {
      var $this = $(value);
      $this.data(DATA_KEY.PROPERTY, $.extend($this.data(DATA_KEY.PROPERTY), {
        showControls: false,
        loop: true,
        autoPlay: true,
        mute: true,
        containment: $this.parent(Selector.BG_HOLDER)
      }));
      $this.YTPlayer();
    });
  }
});