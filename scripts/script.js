"use strict";

const myApp = Object.create(null);

// ======================================================================
// App
// ======================================================================

myApp.main = function main() {
  const sandbox = EventDelegator();
  const div1 = document.getElementById("eventSandbox");

  // Create a event Observer
  const observers = EventObservers();
  observers.init();
};

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

// TODO https://eslint.org/docs/rules/object-shorthand
function observerDelegator() {
  const Observer = {
    init: function(btnId, elem) {
        this.id = elem.id;
        this.elem = elem;
        this.btnId = btnId;
    },
    props: function() {
      this.count = 0;
      this.args = null;
    },
    add: function(num , data) {
        this.count += 1
        this.elem.textContent = this.count;
    },
    clear: function() {
      this.elem.textContent = 0;
      this.count = 0;
    },
  }
  return Observer;
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

function EventObservers() {
  // Delegator
  const Event = Object.create(null);
  Event.init = function init() {
    this.observers = Object.create(null);
  };
  Event.subscribe = function subscribe(observer) {
    this.observers[observer.id] = observer;
  };
  Event.unsubscribe = function unsubscribe(observer) {
    const i = this.observers.indexOf(observer);
    if (i > -1) {
      this.observers.splice(i, 1);
    }
  };
  Event.inform = function inform(elemId, data, func) {
    // Sent to only one observer
    this.observers[elemId][func](elemId, data);
  };
  Event.broadcast = function broadcast(func) {
    // On each object called func
    const keys = Object.keys(this.observers);
    for (let i = 0; i < keys.length; i++) {
      this.observers[keys[i]][func]();
    }
  };
  return Event;
}

function eventControl(args, e) {
  // Note: Function has access to this.elem via "this"
  // "this" being what element the event sandbox is attached to and
  // it's children.
  // To know what button was pressed just use console.log(id).
  // let {arg1, arg2, arg3} = args;
  const id = getTargetId(e, ["BUTTON"]);

  if (id === "btnClear") {
    args["subscribers"].broadcast("clear");
  }
  if (id === "btnAll") {
    args["subscribers"].broadcast("add");
  }
  // TODO This could be cleaned up abit
  if (args[id] !== undefined) {
    args["subscribers"].inform(args[id], args[id], "add");
    args["subscribers"].inform("clicksTotal", args[id], "add");
  }
  // Stop the event from going further up the DOM
  e.stopPropagation();
}

function getTargetId(e, tags) {
  // Returns the target Id of event for allowed tags
  //    Prevents events on the parent
  if (e.target !== e.currentTarget) {
    if (tags.indexOf(e.target.tagName) > -1) {
      return e.target.id;
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