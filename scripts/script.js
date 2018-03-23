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
  myApp.currentValue = null;
  myApp.lastValue = null;
  myApp.values = [];
  myApp.operations = [];
  myApp.lastOperations = [];
  myApp.decimal = false;
};

function eventController(args, e) {
  const btnEvent = getTarget(e, ["BUTTON"]);
  // const num = parseInt(value, 10);

  const btnId = btnEvent.id;

  switch (btnId) {
    case "clear":
      clearCalc();
      break;
    case "equals":
      performCalc(myApp.operations);
      break;
    // Run on only Numbers
    default:
      runOperation(btnId);
      break;
  }
  // Stop the event from going further up the DOM
  e.stopPropagation();
}

function runOperation(btnId) {
  const value = determineValue(btnId);
  const isOperator = determineOperator(value);

  logValue(value, isOperator);
  calcDisplay(myApp.currentValue);
}

function determineOperator(value) {
  const operators = ["+", "-", "x", "\\"];
  if (operators.indexOf(value) !== -1) {
    return true;
  }
  return false;
}


function logValue(value, isOperator) {
  // On init only one zero can be entered
  if (value === "0" && myApp.lastValue === null) {
    myApp.currentValue = value;
  // Handle for Decimal Place
  } else if (value === ".") {
    handleDecimal(value);
  // On init
  } else if (isOperator === false && myApp.lastValue === null) {
    myApp.currentValue = value;
    myApp.lastValue = value;
  } else if (isOperator === true && myApp.lastValue === null) {
    myApp.currentValue = `0${value}`;
    myApp.lastValue = value;
  // After init
  } else {
    myApp.currentValue += value;
    myApp.lastValue = value;
  }
  console.log(myApp.currentValue);
}

function handleDecimal(value) {
  const lastValueOperator = determineOperator(myApp.lastValue);
  if (myApp.decimal === false) {
    // On Init
    if (myApp.lastValue === null) {
      myApp.currentValue = "0.";
      myApp.lastValue = "0.";
    } else if (lastValueOperator === false) {
      myApp.currentValue += value;
      myApp.lastValue = value;
      // If the last value was an operator
    } else {
      myApp.currentValue += `0${value}`;
      myApp.lastValue = `0${value}`;
    }
  }
  myApp.decimal = true;
}


function determineValue(value) {
  const btnMap = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    zero: "0",
    add: "+",
    subtract: "-",
    multiply: "x",
    divide: "\\",
    decimal: ".",
  };
  return btnMap[value];
}

function addDecimal(value) {
  // If decimal was already pressed
  if (myApp.lastOperation !== ".") {
    myApp.lastOperation = ".";
    displayValue(value);
  }
}

function logOperator(value) {

  //  Add Operators as strings if last value was number
  if (typeof value === "string") {
    myApp.operations.push(value);
    myApp.lastValue = null;
    myApp.lastOperation = value;
  }
  console.log(myApp.operations);
  console.log(myApp.lastOperation);
}


function logOperation(value) {
  console.log(myApp.currentValue);
  // Add Numbers here
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

function determineValue2(value) {
  if (typeof myApp.lastValue === "number") {
    console.log(myApp.currentValue);
    console.log(myApp.lastOperation);
    // if (myApp.lastOperation === ".") {
    //   const last = myApp.lastValue.toString();
    //   const decimalNum = value.toString();
    //   const newValue = last + "." + decimalNum
    //   console.log("NEW", newValue);
    //   const newNum = parseInt(newValue)
    //   myApp.operations.push(newNum);
    // }
    if (myApp.lastOperation !== ".") {
      console.log("else", myApp.lastOperation )
      console.log("else", myApp.currentValue )
      myApp.currentValue = parseInt(myApp.lastValue + value, 10);
    }
  } else {
    myApp.currentValue = parseInt(value, 10);
    myApp.lastValue = parseInt(value, 10);
  }
}

function clearDisplay() {
  myApp.displayValue = "0";
  calcDisplay("0");
}

function clearCalc() {
  myApp.currentValue = null;
  myApp.lastValue = null;
  myApp.decimal = false;
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

function getTarget(e, tags) {
  // Returns the target of event triggered, for allowed tags
  //    Prevents events going up the parent
  if (e.target !== e.currentTarget) {
    if (tags.indexOf(e.target.tagName) > -1) {
      return e.target;
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
