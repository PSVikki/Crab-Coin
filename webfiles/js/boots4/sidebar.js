import spUtils from './Util';
import spDetector from './detector';

spUtils.$document.ready(() => {

  const Selector = {
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

  const DataKey = {
    CONTENT: 'content'
  }

  const gridNav = $(Selector.GRIDNAV);
  const baseContent = $(Selector.BASECONTENT);
  const homePage = $(Selector.HOME);
  const WindowLocation = window.location;
  const WindowHistory = window.history;
  const pages = [];
  let isInHome;
  let clickEvent = spDetector.isIOS ? 'tap' : 'click';
  let breakPoint;

  if (baseContent.length) {
    breakPoint = spUtils.breakpoints[baseContent.attr("class").split(' ')
      .filter(cls => cls.indexOf('w-'))
      .pop()
      .split('-')[1]];
  }

  //
  // ─── COUNT UP ───────────────────────────────────────────────────────────────────
  //

  const $counters = $('[data-countup]');
  const count = (isCounterStart = false) => {
    if ($counters.length) {
      $counters.each((index, value) => {
        const $counter = $(value);
        let counterStart = isCounterStart;
        const countTo = $counter.attr('data-countup');
        const countUP = () => {
          $({ countNum: 0 }).animate(
            { countNum: countTo },
            {
              duration: 2000,
              easing: 'linear',
              step() {
                $counter.text(Math.floor(this.countNum));
              },
              complete() {
                $counter.text(this.countNum);
              },
            },
          );
        };
        countUP();
        spUtils.$window.on('scroll', () => {
          if (!counterStart && spUtils.isScrolledIntoView($counter)) {
            countUP();
            counterStart = true;
          }
        });
      });
    }
  }

  //
  // ─── GET ALL PAGE NAME ──────────────────────────────────────────────────────────
  //

  $(Selector.SIDEBAR_ITEM_WRAPPER).each((item, value) => {
    const $this = $(value);
    pages.push($this.data(DataKey.CONTENT));
  });

  //
  // ─── GOToContent TO PAGE ─────────────────────────────────────────────────────────────────
  //

  const goToPage = (content) => {


    let position = spUtils.$window.width() < breakPoint ? '-100%' : '-50%';

    baseContent.css({
      left: position
    });
    gridNav.css({
      right: position
    });

    if (content) {

      const sortable = $(`#${content} .sortable`);
      const countUp = $(`#${content} [data-countup]`);
      $(Selector.PAGE).fadeOut('1000');
      $(`#${content}`).fadeIn('1000');
      $(Selector.CLOSEBUTTON).fadeIn('slow');

      if (!!sortable.length) {
        $(Selector.SORTABLEMENU).find(Selector.ACTIVE).removeClass('active');
        $(Selector.SORTABLEMENU).find(Selector.ITEM).first().addClass('active');

        setTimeout(() => {
          $(Selector.SORTABLECONTAINER).isotope({ filter: '*' });
        }, 300);
      }
      if (!!countUp.length) {
        count(false);
      }

      setTimeout(() => {

        if (spUtils.$window.width() < breakPoint) {
          homePage.css('display', 'none');
          if ($.inArray(window.location.hash.substr(1), pages) > -1) {
            $(window).scrollTop(0);
          }
        }

        isInHome = false;

      }, 500);


    }
  }

  //
  // ─── GOToContent TO HOME ─────────────────────────────────────────────────────────────────
  //

  const home = () => {

    isInHome = true;
    if (spUtils.$window.width() < breakPoint) {

      homePage.css('display', 'block');

      setTimeout(() => {
        gridNav.css('right', 0);
        baseContent.css('left', 0);
        $(Selector.PAGE).fadeOut();
      }, 100);

    } else {
      baseContent.css({
        left: 0,
      });
      gridNav.css({
        right: 0,
      });
      $(Selector.PAGE).fadeOut();
    }

  }

  //
  // ─── FIRST LOAD CONTENT ─────────────────────────────────────────────────────────
  //

  const load = () => {

    let { hash } = window.location;
    let pageId;
    if (document.getElementById(hash.substr(1))) {
      pageId = $(hash).closest('.page').attr('id');
    }

    if ($.inArray(hash.substr(1), pages) > -1) {
      goToPage(hash.substr(1));
    } else if ($.inArray(pageId, pages) > -1) {
      goToPage(pageId);
    }
    else {
      home();
      WindowLocation.replace('#');
      let newUrl = WindowLocation.href;
      (newUrl.lastIndexOf('#') > -1) && (newUrl = newUrl.slice(0, -1));
      WindowHistory.replaceState({}, '', newUrl);
    }
  }

  //
  // ─── LOAD ───────────────────────────────────────────────────────────────────────
  //

  load();

  //
  // ─── CLICK EVENT FOR NAVIGATION ─────────────────────────────────────────────────
  //

  spUtils.$document.on(clickEvent, Selector.SIDEBAR_ITEM_WRAPPER, (e) => {

    const $this = $(e.target);
    let content = '';

    if ($this.closest(Selector.SIDEBAR_ITEM_WRAPPER).data(DataKey.CONTENT)) {
      content = $this.closest(Selector.SIDEBAR_ITEM_WRAPPER).data(DataKey.CONTENT);
    }
    window.location.hash = content;
  });

  //
  // ─── CLICK EVENT FOR CLOSE AREA ─────────────────────────────────────────────────
  //

  spUtils.$document.on(clickEvent, Selector.CLOSEAREA, () => {

    window.location.hash = '';

    let newUrl = WindowLocation.href;
    (newUrl.lastIndexOf('#') > -1) && (newUrl = newUrl.slice(0, -1));
    WindowHistory.replaceState({}, '', newUrl);
    home();

  });

  //
  // ─── LOAD PAGE ON HASH CHANGE ───────────────────────────────────────────────────
  //

  window.onhashchange = () => {
    const url = window.location.href;
    let { hash } = window.location;
    let pageId;
    if (document.getElementById(hash.substr(1))) {
      pageId = $(hash).closest('.page').attr('id');
    }

    let currentPage = $(".page:visible").attr('id');

    if ($.inArray(window.location.hash.substr(1), pages) > -1) {
      goToPage(window.location.hash.substr(1));
    }
    else if ($.inArray(pageId, pages) > -1) {
      if (currentPage !== pageId) {
        goToPage(pageId);
        $('html, body').animate({
          scrollTop: $(hash).offset().top - 30
        }, 100);
      }
    }
    else if (url.lastIndexOf('#') < 0 && window.location.hash === '') {
      home();
    }

  }

  //
  // ─── ALIGN GRID NAV ON SCREEN RESIZE ────────────────────────────────────────────
  //

  spUtils.$window.on('resize', () => {

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
