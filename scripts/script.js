"use strict";

const myApp = Object.create(null);

// ======================================================================
// App
// ======================================================================

myApp.main = function main() {
  const sandbox = EventDelegator();
  const eventSandbox = document.getElementById("calc");
  sandbox.init(eventSandbox, "click", null);
  sandbox.add(eventController);

  myApp.currentValue = "0";
};

function eventController(args, e) {
  const value = getTargetProp(e, ["BUTTON"], "value");

  const num = parseInt(value, 10);

  if (value === "C") {
    clearCalc();
  }

  if (Number.isInteger(num)) {
    determineValue(value);
  }

  // Stop the event from going further up the DOM
  e.stopPropagation();
}

function determineValue(value) {
  if (value !== "undefined") {
    if (myApp.currentValue !== "0") {
      const newValue = myApp.currentValue + value;
      myApp.currentValue = newValue;
    } else {
      myApp.currentValue = value;
    }
    calcDisplay(myApp.currentValue);
  }
}

function clearCalc() {
  calcDisplay("0");
  myApp.currentValue = "0";
}

function calcDisplay(valve) {
  const display = document.getElementById("displayNums");
  display.innerText = valve;
}

function EventDelegator() {
  const Event = Object.create(createEvent());
  Event.init = function setup(elem, type, args) {
    this.setup(elem, type, args);
  };
  Event.add = function add(func, options) {
    this.addListener(func, options);
  };
  return Event;
}

function createEvent() {
  const CreateEvent = {
    setup: function init(onElem, typeEvent, args) {
      this.elem = onElem;
      this.eventType = typeEvent;
      this.args = args;
      // Convert Array to Object
      if (Array.isArray(args)) {
        this.args = Object.assign({}, args);
      }
    },
    addListener: function addListener(func, options) {
      // .bound prevents binding loss
      this.boundFunc = func.bind(this.elem, this.args);
      this.boundOptions = options;
      this.elem.addEventListener(this.eventType, this.boundFunc, this.boundOptions);
    },
    removeListener: function removeListener() {
      this.elem.removeEventListener(this.eventType, this.boundFunc, this.boundOptions);
    },
  };
  return CreateEvent;
}

function getTargetProp(e, tags, prop) {
  // Returns the target Id of event for allowed tags
  //    Prevents events on the parent
  if (e.target !== e.currentTarget) {
    if (tags.indexOf(e.target.tagName) > -1) {
      return e.target[prop];
    }
  }
  e.stopPropagation();
}

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


/// https://philipwalton.github.io/solved-by-flexbox/demos/grids/}