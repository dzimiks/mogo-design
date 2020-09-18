const navbar = document.querySelector('.navbar');
const navbarToggler = document.getElementById('navbar__toggler');
const navbarNav = document.querySelector('.navbar__nav');
const navbarLinks = document.querySelectorAll('.navbar__link');

const NAVBAR_CLOSED_CLASSNAME = 'navbar__nav--closed';
const NAVBAR_FIXED_CLASSNAME = 'navbar--fixed';
const NAVBAR_LINK_ACTIVE_CLASSNAME = 'navbar__link--active';

const changeNavbarTogglerClass = () => {
  if (navbarToggler.classList.contains('mdi-menu')) {
    navbarToggler.classList.remove('mdi-menu');
    navbarToggler.classList.add('mdi-close');
  } else {
    navbarToggler.classList.remove('mdi-close');
    navbarToggler.classList.add('mdi-menu');
  }
};

// Change navbar link active class
navbarLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const currentActiveLink = document.querySelector(`.${NAVBAR_LINK_ACTIVE_CLASSNAME}`);

    if (!navbarNav.classList.contains(NAVBAR_CLOSED_CLASSNAME)) {
      navbarNav.classList.add(NAVBAR_CLOSED_CLASSNAME);
      changeNavbarTogglerClass();
    }

    if (currentActiveLink && currentActiveLink.classList.contains(NAVBAR_LINK_ACTIVE_CLASSNAME)) {
      currentActiveLink.classList.remove(NAVBAR_LINK_ACTIVE_CLASSNAME);
      link.classList.add(NAVBAR_LINK_ACTIVE_CLASSNAME);
    }
  });
});

// Toggle navbar
navbarToggler.addEventListener('click', (event) => {
  event.preventDefault();
  changeNavbarTogglerClass();
  navbarNav.classList.toggle(NAVBAR_CLOSED_CLASSNAME);
});

const closeNavbar = (target) => {
  const isNavbarOpen = navbarNav.classList.contains(NAVBAR_CLOSED_CLASSNAME);
  const isClickedOnNavbarNav = target.classList.contains('navbar__nav');
  const isClickedOutsideNavbar = navbar.contains(target);

  if (
    !isNavbarOpen &&
    !isClickedOnNavbarNav &&
    !isClickedOutsideNavbar
  ) {
    navbarNav.classList.add(NAVBAR_CLOSED_CLASSNAME);
    changeNavbarTogglerClass();
  }
};

// Close navbar if user clicks outside the navbar
document.addEventListener('click', (event) => {
  closeNavbar(event.target);
});

/**
 * In case of a "storm of events", this executes once every threshold.
 *
 * @param func
 * @param threshold
 * @param scope
 * @returns {Function}
 */
const throttle = (func, threshold = 250, scope) => {
  let last;
  let deferTimer;

  return function () {
    let context = scope || this;
    let now = +new Date;
    let args = arguments;

    if (last && now < last + threshold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        func.apply(context, args);
      }, threshold);
    } else {
      last = now;
      func.apply(context, args);
    }
  };
};

// Set navbar to be fixed on top when user scrolls bellow header section
// Cross-browser compatibility
const supportPageOffset = window.pageXOffset !== undefined;
const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
const headerHeight = document.querySelector('.header').offsetHeight;
const THROTTLE_THRESHOLD = 200;
const COUNTER_DURATION = 2000;
let isCounterShown = true;

const backToTopButton = document.getElementById('back-to-top');

// Back to top scroll animation
backToTopButton.addEventListener('click', (event) => {
  event.preventDefault();
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

window.addEventListener('scroll', throttle(() => {
  const pageYOffset = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
  const navbarHeight = navbar.offsetHeight;

  if (pageYOffset > navbarHeight) {
    backToTopButton.style.opacity = '1';
  } else {
    backToTopButton.style.opacity = '0';
  }

  if (pageYOffset >= headerHeight) {
    document.body.classList.add(NAVBAR_FIXED_CLASSNAME);
    document.body.style.paddingTop = navbarHeight + 'px';
  } else {
    document.body.classList.remove(NAVBAR_FIXED_CLASSNAME);
    document.body.style.paddingTop = '0';
  }

  const sectionCountingHeight = document.querySelector('.section-counting').offsetHeight;
  const counters = document.querySelectorAll('.section-counting__number');

  if (pageYOffset >= sectionCountingHeight && isCounterShown) {
    isCounterShown = false;
    counters.forEach((counter) => animateCounter(counter, 0, Number(counter.innerHTML), COUNTER_DURATION));
  }

  // Change navbar link active class
  document.querySelectorAll('.navbar__link a').forEach((link) => {
    const section = document.querySelector(link.hash);
    const padding = parseInt(window.getComputedStyle(section, null).getPropertyValue('padding-top'));

    if (section) {
      if (
        section.offsetTop - padding <= pageYOffset &&
        section.offsetTop + section.offsetHeight > pageYOffset
      ) {
        const currentActiveLink = document.querySelector(`.${NAVBAR_LINK_ACTIVE_CLASSNAME}`);

        if (currentActiveLink && currentActiveLink.classList.contains(NAVBAR_LINK_ACTIVE_CLASSNAME)) {
          currentActiveLink.classList.remove(NAVBAR_LINK_ACTIVE_CLASSNAME);
          link.parentNode.classList.add(NAVBAR_LINK_ACTIVE_CLASSNAME);
        }
      }
    }
  });
}, THROTTLE_THRESHOLD));

/**
 * Animates counters in counting section.
 *
 * @param element
 * @param start
 * @param end
 * @param duration
 */
const animateCounter = (element, start, end, duration) => {
  const range = end - start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    element.innerHTML = current;

    if (current === end) {
      clearInterval(timer);
    }
  }, stepTime);
};

// Accordion
const ACCORDION_HEADER_CLASSNAME = 'accordion__header';
const accordionHeaders = document.getElementsByClassName(ACCORDION_HEADER_CLASSNAME);

for (let i = 0; i < accordionHeaders.length; i++) {
  accordionHeaders[i].addEventListener('click', (event) => {
    accordionClick(event);
  });
}

const accordionClick = (event) => {
  let targetClicked = event.target;
  let classClicked = targetClicked.classList;

  while ((classClicked[0] !== ACCORDION_HEADER_CLASSNAME)) {
    targetClicked = targetClicked.parentElement;
    classClicked = targetClicked.classList;
  }

  const content = targetClicked.nextElementSibling;

  if (content.style.maxHeight) {
    content.style.maxHeight = null;
    content.style.margin = '0 1rem';
    changeAccordionArrow(targetClicked, 'up', 'down');
  } else {
    const allContents = document.getElementsByClassName('accordion__content');

    for (let i = 0; i < allContents.length; i++) {
      if (allContents[i].style.maxHeight) {
        allContents[i].style.maxHeight = null;
        allContents[i].style.margin = '0 1rem';
        changeAccordionArrow(allContents[i].previousElementSibling, 'up', 'down');
      }
    }

    changeAccordionArrow(targetClicked, 'down', 'up');
    content.style.maxHeight = '17rem';
    content.style.margin = '1rem';
  }
};

const changeAccordionArrow = (element, from, to) => {
  element.lastElementChild.classList.remove(`mdi-chevron-${from}`);
  element.lastElementChild.classList.add(`mdi-chevron-${to}`);
};

// Open and close Map
const map = document.getElementById('map');
const mapTitle = document.querySelector('.section__title--map');
let isMapOpen = true;

mapTitle.addEventListener('click', () => closeAndOpenMap());

const closeAndOpenMap = () => {
  if (isMapOpen) {
    map.style.maxHeight = '50rem';
  } else {
    map.style.maxHeight = '0';
  }

  mapTitle.innerHTML = `
		<span class="section__subtitle section__subtitle--map"> 
    	<i class="mdi mdi-map-marker"></i>
    </span>
    ${isMapOpen ? 'Close' : 'Open'} map
	`;

  isMapOpen = !isMapOpen;
};

// Leaflet Map
const mymap = L.map('map').setView([44.9256, 20.4489], 10);
const LEAFLET_ACCESS_TOKEN = 'xyz';

L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${LEAFLET_ACCESS_TOKEN}`, {
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(mymap);
