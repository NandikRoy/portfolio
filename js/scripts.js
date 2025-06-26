// variable declairation
const mainMenuContainer = document.getElementById("mainMenuContainer"),
      menuToggler = document.getElementById("mainMenuToggler"),
      menuNavbar = document.getElementById("mainMenuNav"),
      accordionButtons = document.querySelectorAll(".accordion .accordion-button"),
      modalOpeners = document.querySelectorAll("button[data-bs-toggle=modal]"),
      modalClosers = document.querySelectorAll(".modal .btn-close"),
      lightboxOpeners = document.querySelectorAll(".lightbox-item"),
      lightboxPrevBtns = document.querySelectorAll(".lightbox-btn-prev"),
      lightboxNextBtns = document.querySelectorAll(".lightbox-btn-next"),
      masonryGrids = document.querySelectorAll(".masonry-grid");
var lightboxGallery = {"items": [], "index": 0, "target": ""},
    masonryRowHeight, masonryRowGap, lastScrollPosition = 0;

// main menu toggling open/closed
menuToggler.addEventListener("click", () => {
    mainMenuContainer.classList.toggle("collapsed");
    mainMenuContainer.classList.toggle("expanded");
});

// sticky main menu
window.addEventListener("scroll", () => {
    let menuContainerHeight = mainMenuContainer.getBoundingClientRect().height,
        menuHeight = menuNavbar.getBoundingClientRect().height,
        scrollTop = window.scrollY || document.body.scrollTop,
        viewportHeight = window.innerHeight,
        menuOffset = menuHeight - viewportHeight;

    if (scrollTop > lastScrollPosition) { /* Page scroll towards bottom */
        if (scrollTop + viewportHeight >= menuContainerHeight)
            menuNavbar.style.top = `${menuContainerHeight - menuHeight}px`;
        else if (scrollTop + viewportHeight >= menuHeight)
            menuNavbar.style.top = `${scrollTop - menuOffset}px`;
    } else { /* Page scroll towards top */
        if (scrollTop <= 0)
            menuNavbar.style.top = "0px";
        else if (scrollTop + viewportHeight >= menuHeight)
            menuNavbar.style.top = `${scrollTop}px`;
    }

    lastScrollPosition = scrollTop; /* Store last scroll position */
});

// accordion control - activating to show content
let ariaExpand = function (el) {
    let x = document.querySelector(el.dataset.bsTarget); /* targeting accordion content */
    /* making changes to active accordion & show content */
    el.classList.remove("collapsed");
    x.style.height = x.scrollHeight + "px";
    el.setAttribute("aria-expanded", "true");
};

// accordion control - deactivating to hide content
let ariaCollapsed = function (el) {
    let x = document.querySelector(el.dataset.bsTarget); /* targeting accordion content */
    /* making changes to deactive accordion & hide content */
    el.classList.add("collapsed");
    x.style.height = "";
    el.setAttribute("aria-expanded", "false");
};

// accordion control - controlling behaviour on .accordion-button click
accordionButtons.forEach((accordionButton) => accordionButton.addEventListener("click", () => {
    switch (accordionButton.getAttribute("aria-expanded")) {
        case "true":
            ariaCollapsed(accordionButton); /* deactivating clicked accordion */
            break;
        case "false":
            let p = document.querySelector(accordionButton.dataset.bsParent); /* targeting accordion holder */
            p.querySelectorAll(".accordion-button[aria-expanded=true]").forEach(ariaCollapsed); /* collapsed already active accordion */
            ariaExpand(accordionButton); /* activating clicked accordion */
    }
}));

// modal control - controlling open on [data-bs-toggle="modal"] click
modalOpeners.forEach((modalOpener) => modalOpener.addEventListener("click", () => {
    let m = document.querySelector(modalOpener.dataset.bsTarget); /* targeting modal to open */
    m.style.display = "block";
    setTimeout((m) => m.classList.add("show"), 1, m);
}));

// modal control - closing modal on .btn-close click
modalClosers.forEach((modalCloser) => modalCloser.addEventListener("click", () => {
    let m = document.querySelector(modalCloser.dataset.bsTarget); /* targeting modal to open */
    m.classList.remove("show");
    setTimeout((m) => m.style.display = "none", 450, m);

    /* lightbox control - drop gallery items on modal close */
    lightboxGallery.items = [];
}));

// lightbox control - display lighbox content
let loadLightbox = function () {
    let s = lightboxGallery.items[lightboxGallery.index].getAttribute("src");
    lightboxGallery.target.setAttribute("src", s);
};

// lightbox control - display previous lighbox content
lightboxPrevBtns.forEach((lightboxPrevBtn) => lightboxPrevBtn.addEventListener("click", () => {
    lightboxGallery.index = --lightboxGallery.index < 0 ? lightboxGallery.items.length - 1 : lightboxGallery.index;
    loadLightbox();
}));

// lightbox control - display next lighbox content
lightboxNextBtns.forEach((lightboxNextBtn) => lightboxNextBtn.addEventListener("click", () => {
    lightboxGallery.index = ++lightboxGallery.index >= lightboxGallery.items.length ? 0 : lightboxGallery.index;
    loadLightbox();
}));

// lightbox control - load gallery items on modal display
lightboxOpeners.forEach((lightboxOpener) => lightboxOpener.addEventListener("click", () => {
    let l = lightboxOpener.dataset.bsTarget,
        i = lightboxOpener.querySelector(".lightbox-img"),
        t = document.querySelector(`${l} .lightbox-modal-img`);

    /* load lightbox gallery and load content in .modal-body for lightbox */
    lightboxGallery.items.push(...document.querySelectorAll(`.lightbox-item[data-bs-target="${l}"] .lightbox-img`));
    lightboxGallery.index = lightboxGallery.items.indexOf(i);
    lightboxGallery.target = t;
    loadLightbox();
}));

// masonry conrol - adjust spanning over row for one item
let spanMasonryIteam = function (item) {
    item.style.gridRowEnd = "span " + Math.ceil((item.children[0].offsetHeight + rowGap) / (rowHeight + rowGap));
};

// masonry control - adjust masonry items with row-span
let adjustMasonryItems = function (masonry) {
    /* calculate spacings between grid-rows */
    rowHeight = parseInt(window.getComputedStyle(masonry).getPropertyValue('grid-auto-rows'));
    rowGap = parseInt(window.getComputedStyle(masonry).getPropertyValue('grid-row-gap'));

    /* calculating rowspan for each masonry-item */
    masonry.querySelectorAll(".masonry-item").forEach((item) => spanMasonryIteam(item));
};

// masonry control - load masonry on page load or page resize
["load", "resize"].forEach((e) => window.addEventListener(e, () => {
    masonryGrids.forEach((masonryGrid) => adjustMasonryItems(masonryGrid));
}));
