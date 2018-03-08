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

  myApp.displayValue = "0";
  myApp.currentValue = 0;
  myApp.lastValue = null;
  myApp.operations = [];
  myApp.lastOperations = [];
};

function eventController(args, e) {
  const value = getTargetProp(e, ["BUTTON"], "value");

  //const num = parseInt(value, 10);

  switch (value) {
    case "C":
      clearCalc();
      break;
    case "+":
      logOperation(value);
      break;
    case "-":
      logOperation(value);
      break;
    case "=":
      logOperation(value);
      break;
    default:
      determineValue(value);
      displayValue(value);
      break;
  }

  // Stop the event from going further up the DOM
  e.stopPropagation();
}

function logOperation(value) {
  // Only Add Numbers here
  if (typeof myApp.currentValue === "number") {
    myApp.operations.push(myApp.currentValue);
    myApp.lastValue = parseInt(value, 10);
    displayValue(value);
  }
  //  Add Operators as long as last value was number
  if (typeof myApp.lastValue === "number") {
    myApp.operations.push(value);
    myApp.lastValue = null;
    myApp.lastOperation = value;
  }
  console.log(myApp.operations);
  console.log(myApp.lastOperation);
}

function determineValue(value) {
  if (typeof myApp.lastValue === "number") {
    myApp.currentValue = parseInt(myApp.lastValue + value, 10);
    console.log(myApp.currentValue);
  } else {
    myApp.currentValue = parseInt(value, 10);
    myApp.lastValue = parseInt(value, 10);
  }
}

function displayValue(value) {
  if (value !== "undefined") {
    if (myApp.displayValue !== "0") {
      const newValue = myApp.displayValue + value;
      myApp.displayValue = newValue;
    } else {
      myApp.displayValue = value;
    }
    calcDisplay(myApp.displayValue);
  }
}

function clearCalc() {
  myApp.currentValue = 0;
  myApp.displayValue = "0";
  myApp.lastOperations.push(myApp.operations);
  console.log("Clear")
  myApp.operations = [];
  console.log(myApp.operations)
  calcDisplay("0");
}

function calcDisplay(valve) {
  const display = document.getElementById("displayNums");
  display.innerText = valve;
}


// =====================================================================
// Event Handling
// =====================================================================

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