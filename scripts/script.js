"use strict";

const myApp = Object.create(null);

// ======================================================================

myApp.main = function main(){
  console.log("Main loaded")
  
}
// ======================================================================
// NOTE
// ======================================================================
 

// ======================================================================
// Onload fuction alt. to JQuery ready method.
// ======================================================================

myApp.initApplication = function(){
  console.log("App Loaded.\n");
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