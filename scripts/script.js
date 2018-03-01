"use strict";

const myApp = Object.create(null);

// ======================================================================
// App
// ======================================================================

myApp.main = function main() {
};

myApp.initApplication = function init() {
  myApp.main();
};

// Handler when the DOM is fully loaded
document.onreadystatechange = function onreadystatechange() {
  if (document.readyState === "complete") {
    myApp.initApplication(document.readyState);
  } else {
    // Do something during loading [opitional]
  }
};

// ======================================================================


/// https://philipwalton.github.io/solved-by-flexbox/demos/grids/