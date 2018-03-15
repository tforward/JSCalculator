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
  // const num = parseInt(value, 10);

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
    case "*":
      logOperation(value);
      break;
    case "/":
      logOperation(value);
      break;
    case "=":
      logOperation(value);
      performCalc(myApp.operations);
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
  console.log(value);
  // Only Add Numbers here
  if (typeof myApp.currentValue === "number") {
    myApp.operations.push(myApp.currentValue);
    myApp.lastValue = parseInt(value, 10);
    displayValue(value);
  }
  //  Add Operators as strings if last value was number
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

function clearDisplay() {
  myApp.displayValue = "0";
  calcDisplay("0");
}

function clearCalc() {
  myApp.currentValue = 0;
  myApp.lastValue = 0;
  myApp.lastOperations.push(myApp.operations);
  myApp.operations = [];
  clearDisplay();
}

function calcDisplay(valve) {
  const display = document.getElementById("displayNums");
  display.innerText = valve;
}

// =====================================================================
// Calculations
// =====================================================================

function operation(operator, calc) {
  const index = calc.indexOf(operator);
  if (operator === "/") {
    const result = calc[index - 1] / calc[index + 1];
    return [result, index];
  } else
  if (operator === "*") {
    const result = calc[index - 1] * calc[index + 1];
    return [result, index];
  } else
  if (operator === "+") {
    const result = calc[index - 1] + calc[index + 1];
    return [result, index];
  } else
  if (operator === "-") {
    const result = calc[index - 1] - calc[index + 1];
    return [result, index];
  }
  return null;
}

function getOrderofOperations(calc) {
  // Get the operators used
  const operators = calc.filter(i => (typeof (i) === "string"));
  const lastOperations = [];
  let operator = null;
  let orderOfOperations = [];

  for (let i = 0; i < operators.length; i++) {
    operator = operators[i];

    if (operator === "+" || operator === "-") {
      lastOperations.push(operator);
    } else {
      orderOfOperations.push(operator);
    }
  }
  orderOfOperations = orderOfOperations.concat(lastOperations);
  return orderOfOperations;
}

function calculation(calc, index, result) {
  // Replace number before and after and the operator with the new result
  calc.splice(index - 1, 3, result);
}

function performCalc(data) {
  const calc = data.filter(i => i !== "=");
  console.log(calc);
  const orderOfOperations = getOrderofOperations(calc);
  for (let i = 0; i < orderOfOperations.length; i++) {
    const operator = orderOfOperations[i];
    const results = operation(operator, calc);
    calculation(calc, results[1], results[0]);
  }
  const finalResult = calc[0];
  console.log(finalResult);
  clearDisplay();
  displayValue(finalResult);

  return finalResult;
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
  return null;
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
// https://philipwalton.github.io/solved-by-flexbox/demos/grids/}
