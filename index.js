(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ecsLib = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var NOW;
// Include a performance.now polyfill.
// In node.js, use process.hrtime.
// @ts-ignore
if (typeof (self) === 'undefined' && typeof (process) !== 'undefined' && process.hrtime) {
    NOW = function () {
        // @ts-ignore
        var time = process.hrtime();
        // Convert [seconds, nanoseconds] to milliseconds.
        return time[0] * 1000 + time[1] / 1000000;
    };
}
// In a browser, use self.performance.now if it is available.
else if (typeof (self) !== 'undefined' && self.performance !== undefined && self.performance.now !== undefined) {
    // This must be bound, because directly assigning this function
    // leads to an invocation exception in Chrome.
    NOW = self.performance.now.bind(self.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
    NOW = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
    NOW = function () {
        return new Date().getTime();
    };
}
var SEQ_SYSTEM = 1;
var SEQ_ENTITY = 1;
var SEQ_COMPONENT = 1;
/**
 * Utility class for asynchronous access to a list
 */
var Iterator = /** @class */ (function () {
    function Iterator(next) {
        this.end = false;
        this.cache = [];
        this.next = next;
    }
    /**
     * Allows iterate across all items
     *
     * @param cb
     */
    Iterator.prototype.each = function (cb) {
        var index = 0;
        while (true) {
            var value = void 0;
            if (this.cache.length <= index) {
                if (this.end) {
                    break;
                }
                value = this.next(index++);
                if (value === undefined) {
                    this.end = true;
                    break;
                }
                this.cache.push(value);
            }
            else {
                value = this.cache[index++];
            }
            if (cb(value) === false) {
                break;
            }
        }
    };
    /**
     * returns the value of the first element that satisfies the provided testing function.
     *
     * @param test
     */
    Iterator.prototype.find = function (test) {
        var out = undefined;
        this.each(function (item) {
            if (test(item)) {
                out = item;
                // break
                return false;
            }
        });
        return out;
    };
    /**
     * creates a array with all elements that pass the test implemented by the provided function.
     *
     * @param test
     */
    Iterator.prototype.filter = function (test) {
        var list = [];
        this.each(function (item) {
            if (test(item)) {
                list.push(item);
            }
        });
        return list;
    };
    /**
     * creates a new array with the results of calling a provided function on every element in this iterator.
     *
     * @param cb
     */
    Iterator.prototype.map = function (cb) {
        var list = [];
        this.each(function (item) {
            list.push(cb(item));
        });
        return list;
    };
    return Iterator;
}());
exports.Iterator = Iterator;
/**
 * Representation of an entity in ECS
 */
var Entity = /** @class */ (function () {
    function Entity() {
        /**
         * Lista de interessados sobre a atualiação dos componentes
         */
        this.subscriptions = [];
        /**
         * Components by type
         */
        this.components = {};
        /**
         * Informs if the entity is active
         */
        this.active = true;
        this.id = SEQ_ENTITY++;
    }
    /**
     * Allows interested parties to receive information when this entity's component list is updated
     *
     * @param handler
     */
    Entity.prototype.subscribe = function (handler) {
        var _this = this;
        this.subscriptions.push(handler);
        return function () {
            var idx = _this.subscriptions.indexOf(handler);
            if (idx >= 0) {
                _this.subscriptions.splice(idx, 1);
            }
            return _this;
        };
    };
    /**
     * Add a component to this entity
     *
     * @param component
     */
    Entity.prototype.add = function (component) {
        var _this = this;
        var type = component.type;
        if (!this.components[type]) {
            this.components[type] = [];
        }
        if (this.components[type].indexOf(component) >= 0) {
            return;
        }
        this.components[type].push(component);
        // Informa aos interessados sobre a atualização
        this.subscriptions.forEach(function (cb) { return cb(_this, component, undefined); });
    };
    /**
     * Removes a component's reference from this entity
     *
     * @param component
     */
    Entity.prototype.remove = function (component) {
        var _this = this;
        var type = component.type;
        if (!this.components[type]) {
            return;
        }
        var idx = this.components[type].indexOf(component);
        if (idx >= 0) {
            this.components[type].splice(idx, 1);
            if (this.components[type].length < 1) {
                delete this.components[type];
            }
            // Informa aos interessados sobre a atualização
            this.subscriptions.forEach(function (cb) { return cb(_this, undefined, component); });
        }
    };
    return Entity;
}());
exports.Entity = Entity;
/**
 * Representation of a component in ECS
 */
var Component = /** @class */ (function () {
    function Component(type, data) {
        /**
         * A component can have attributes. Attributes are secondary values used to save miscellaneous data required by some
         * specialized systems.
         */
        this.attr = {};
        this.type = type;
        this.data = data;
    }
    /**
     * Register a new component class
     */
    Component.register = function () {
        var typeID = SEQ_COMPONENT++;
        var ComponentImpl = /** @class */ (function (_super) {
            __extends(ComponentImpl, _super);
            /**
             * Create a new instance of this custom component
             *
             * @param data
             */
            function ComponentImpl(data) {
                return _super.call(this, typeID, data) || this;
            }
            ComponentImpl.allFrom = function (entity) {
                var components = entity.components[typeID];
                return components || [];
            };
            ComponentImpl.oneFrom = function (entity) {
                var components = ComponentImpl.allFrom(entity);
                if (components && components.length > 0) {
                    return components[0];
                }
            };
            ComponentImpl.type = typeID;
            return ComponentImpl;
        }(Component));
        return ComponentImpl;
    };
    return Component;
}());
exports.Component = Component;
/**
 * Represents the logic that transforms component data of an entity from its current state to its next state. A system
 * runs on entities that have a specific set of component types.
 */
var System = /** @class */ (function () {
    /**
     * @param componentTypes IDs of the types of components this system expects the entity to have before it can act on.
     * If you want to create a system that acts on all entities, enter [-1]
     * @param frequence The maximum times per second this system should be updated. Defaults 0
     */
    function System(componentTypes, frequence) {
        if (frequence === void 0) { frequence = 0; }
        /**
         * IDs of the types of components this system expects the entity to have before it can act on. If you want to
         * create a system that acts on all entities, enter [-1]
         */
        this.componentTypes = [];
        this.callbacks = {};
        /**
         * Reference to the world, changed at runtime during interactions.
         */
        this.world = undefined;
        /**
         * Allows to trigger any event. Systems interested in this event will be notified immediately
         *
         * Injected by ECS at runtime
         *
         * @param event
         * @param data
         */
        this.trigger = undefined;
        this.id = SEQ_SYSTEM++;
        this.componentTypes = componentTypes;
        this.frequence = frequence;
    }
    /**
     * Allows you to search in the world for all entities that have a specific set of components.
     *
     * @param componentTypes Enter [-1] to list all entities
     */
    System.prototype.query = function (componentTypes) {
        return this.world.query(componentTypes);
    };
    /**
     * Allows the system to listen for a specific event that occurred during any update.
     *
     * In callback, the system has access to the existing entities in the world that are processed by this system, in
     * the form of an Iterator, and the raw data sent by the event trigger.
     *
     * ATTENTION! The callback method will be invoked immediately after the event fires, avoid heavy processing.
     *
     * @param event
     * @param callback
     * @param once Allows you to perform the callback only once
     */
    System.prototype.listenTo = function (event, callback, once) {
        var _this = this;
        if (!this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event] = [];
        }
        if (once) {
            var tmp_1 = callback.bind(this);
            callback = function (data, entities) {
                tmp_1(data, entities);
                var idx = _this.callbacks[event].indexOf(callback);
                if (idx >= 0) {
                    _this.callbacks[event].splice(idx, 1);
                }
                if (_this.callbacks[event].length === 0) {
                    delete _this.callbacks[event];
                }
            };
        }
        this.callbacks[event].push(callback);
    };
    return System;
}());
exports.System = System;
/**
 * The very definition of the ECS. Also called Admin or Manager in other implementations.
 */
var ECS = /** @class */ (function () {
    function ECS(systems) {
        var _this = this;
        /**
         * All systems in this world
         */
        this.systems = [];
        /**
         * All entities in this world
         */
        this.entities = [];
        /**
         * Indexes the systems that must be run for each entity
         */
        this.entitySystems = {};
        /**
         * Records the last instant a system was run in this world for an entity, using real time
         */
        this.entitySystemLastUpdate = {};
        /**
         * Records the last instant a system was run in this world for an entity, using game time
         */
        this.entitySystemLastUpdateGame = {};
        /**
         * Saves subscriptions made to entities
         */
        this.entitySubscription = {};
        /**
         * Injection for the system trigger method
         *
         * @param event
         * @param data
         */
        this.systemTrigger = function (event, data) {
            _this.systems.forEach(function (system) {
                var callbacks = system.callbacks;
                if (callbacks.hasOwnProperty(event) && callbacks[event].length > 0) {
                    _this.inject(system);
                    var entitiesIterator_1 = _this.query(system.componentTypes);
                    callbacks[event].forEach(function (callback) {
                        callback(data, entitiesIterator_1);
                    });
                }
            });
        };
        /**
         * Allows you to apply slow motion effect on systems execution. When timeScale is 1, the timestamp and delta
         * parameters received by the systems are consistent with the actual timestamp. When timeScale is 0.5, the values
         * received by systems will be half of the actual value.
         *
         * ATTENTION! The systems continue to be invoked obeying their normal frequencies, what changes is only the values
         * received in the timestamp and delta parameters.
         */
        this.timeScale = 1;
        /**
         * Last execution of update method
         */
        this.lastUpdate = NOW();
        /**
         * The timestamp of the game, different from the real world, is updated according to timeScale. If at no time does
         * the timeScale change, the value is the same as the current timestamp.
         *
         * This value is sent to the systems update method.
         */
        this.gameTime = 0;
        this.indexEntitySystem = function (entity, system) {
            var idx = _this.entitySystems[entity.id].indexOf(system);
            // Sistema não existe neste mundo, remove indexação
            if (_this.systems.indexOf(system) < 0) {
                if (idx >= 0) {
                    _this.entitySystems[entity.id].splice(idx, 1);
                    delete _this.entitySystemLastUpdate[entity.id][system.id];
                    delete _this.entitySystemLastUpdateGame[entity.id][system.id];
                }
                return;
            }
            var systemComponentTypes = system.componentTypes;
            for (var a = 0, l = systemComponentTypes.length; a < l; a++) {
                // -1 = All components. Allows a system to receive updates from all entities in the world.
                var entityComponentIDs = [-1].concat(Object.keys(entity.components).map(function (v) { return Number.parseInt(v, 10); }));
                if (entityComponentIDs.indexOf(systemComponentTypes[a]) < 0) {
                    // remove
                    if (idx >= 0) {
                        // Informs the system of relationship removal
                        if (system.exit) {
                            _this.inject(system);
                            system.exit(entity);
                        }
                        _this.entitySystems[entity.id].splice(idx, 1);
                        delete _this.entitySystemLastUpdate[entity.id][system.id];
                        delete _this.entitySystemLastUpdateGame[entity.id][system.id];
                    }
                    return;
                }
            }
            // Entity has all the components this system needs
            if (idx < 0) {
                _this.entitySystems[entity.id].push(system);
                _this.entitySystemLastUpdate[entity.id][system.id] = NOW();
                _this.entitySystemLastUpdateGame[entity.id][system.id] = _this.gameTime;
                // Informs the system about the new relationship
                if (system.enter) {
                    _this.inject(system);
                    system.enter(entity);
                }
            }
        };
        if (systems) {
            systems.forEach(function (system) {
                _this.addSystem(system);
            });
        }
    }
    /**
     * Remove all entities and systems
     */
    ECS.prototype.destroy = function () {
        var _this = this;
        this.entities.forEach(function (entity) {
            _this.removeEntity(entity);
        });
        this.systems.forEach(function (system) {
            _this.removeSystem(system);
        });
    };
    /**
     * Get all entities
     */
    ECS.prototype.getEntities = function () {
        return this.entities;
    };
    /**
     * Get an entity by id
     *
     * @param id
     */
    ECS.prototype.getEntity = function (id) {
        return this.entities.find(function (entity) { return entity.id === id; });
    };
    /**
     * Add an entity to this world
     *
     * @param entity
     */
    ECS.prototype.addEntity = function (entity) {
        var _this = this;
        if (!entity || this.entities.indexOf(entity) >= 0) {
            return;
        }
        this.entities.push(entity);
        this.entitySystemLastUpdate[entity.id] = {};
        this.entitySystemLastUpdateGame[entity.id] = {};
        // Remove subscription
        if (this.entitySubscription[entity.id]) {
            this.entitySubscription[entity.id]();
        }
        // Add new subscription
        this.entitySubscription[entity.id] = entity
            .subscribe(function (entity, added, removed) {
            _this.onEntityUpdate(entity, added, removed);
            _this.indexEntity(entity);
        });
        this.indexEntity(entity);
    };
    /**
     * Remove an entity from this world
     *
     * @param idOrInstance
     */
    ECS.prototype.removeEntity = function (idOrInstance) {
        var _this = this;
        var entity = idOrInstance;
        if (typeof idOrInstance === 'number') {
            entity = this.getEntity(idOrInstance);
        }
        if (!entity) {
            return;
        }
        var idx = this.entities.indexOf(entity);
        if (idx >= 0) {
            this.entities.splice(idx, 1);
        }
        // Remove subscription, if any
        if (this.entitySubscription[entity.id]) {
            this.entitySubscription[entity.id]();
        }
        // Invoke system exit
        var systems = this.entitySystems[entity.id];
        if (systems) {
            systems.forEach(function (system) {
                if (system.exit) {
                    _this.inject(system);
                    system.exit(entity);
                }
            });
        }
        // Remove associative indexes
        delete this.entitySystems[entity.id];
        delete this.entitySystemLastUpdate[entity.id];
        delete this.entitySystemLastUpdateGame[entity.id];
    };
    /**
     * Add a system in this world
     *
     * @param system
     */
    ECS.prototype.addSystem = function (system) {
        var _this = this;
        if (!system) {
            return;
        }
        if (this.systems.indexOf(system) >= 0) {
            return;
        }
        this.systems.push(system);
        // Indexes entities
        this.entities.forEach(function (entity) {
            _this.indexEntity(entity, system);
        });
        // Invokes system enter
        this.entities.forEach(function (entity) {
            if (entity.active) {
                var systems = _this.entitySystems[entity.id];
                if (systems && systems.indexOf(system) >= 0) {
                    if (system.enter) {
                        _this.inject(system);
                        system.enter(entity);
                    }
                }
            }
        });
    };
    /**
     * Remove a system from this world
     *
     * @param system
     */
    ECS.prototype.removeSystem = function (system) {
        var _this = this;
        if (!system) {
            return;
        }
        var idx = this.systems.indexOf(system);
        if (idx >= 0) {
            // Invoke system exit
            this.entities.forEach(function (entity) {
                if (entity.active) {
                    var systems = _this.entitySystems[entity.id];
                    if (systems && systems.indexOf(system) >= 0) {
                        if (system.exit) {
                            _this.inject(system);
                            system.exit(entity);
                        }
                    }
                }
            });
            this.systems.splice(idx, 1);
            if (system.world === this) {
                system.world = undefined;
                system.trigger = undefined;
            }
            // Indexes entities
            this.entities.forEach(function (entity) {
                _this.indexEntity(entity, system);
            });
        }
    };
    /**
     * Allows you to search for all entities that have a specific set of components.
     *
     * @param componentTypes Enter [-1] to list all entities
     */
    ECS.prototype.query = function (componentTypes) {
        var _this = this;
        var index = 0;
        var listAll = componentTypes.indexOf(-1) >= 0;
        return new Iterator(function () {
            outside: for (var l = _this.entities.length; index < l; index++) {
                var entity = _this.entities[index];
                if (listAll) {
                    // Prevents unnecessary processing
                    return entity;
                }
                // -1 = All components. Allows to query for all entities in the world.
                var entityComponentIDs = [-1].concat(Object.keys(entity.components).map(function (v) { return Number.parseInt(v, 10); }));
                for (var a = 0, j = componentTypes.length; a < j; a++) {
                    if (entityComponentIDs.indexOf(componentTypes[a]) < 0) {
                        continue outside;
                    }
                }
                // Entity has all the components
                return entity;
            }
        });
    };
    /**
     * Invokes the "update" method of the systems in this world.
     */
    ECS.prototype.update = function () {
        var _this = this;
        var now = NOW();
        // adds scaledDelta
        this.gameTime += (now - this.lastUpdate) * this.timeScale;
        this.lastUpdate = now;
        var toCallAfterUpdateAll = {};
        this.entities.forEach(function (entity) {
            if (!entity.active) {
                // Entidade inativa
                return _this.removeEntity(entity);
            }
            var systems = _this.entitySystems[entity.id];
            if (!systems) {
                return;
            }
            var entityLastUpdates = _this.entitySystemLastUpdate[entity.id];
            var entityLastUpdatesGame = _this.entitySystemLastUpdateGame[entity.id];
            var elapsed, elapsedScaled, interval;
            systems.forEach(function (system) {
                if (system.update) {
                    _this.inject(system);
                    elapsed = now - entityLastUpdates[system.id];
                    elapsedScaled = _this.gameTime - entityLastUpdatesGame[system.id];
                    // Limit FPS
                    if (system.frequence > 0) {
                        interval = 1000 / system.frequence;
                        if (elapsed < interval) {
                            return;
                        }
                        // adjust for fpsInterval not being a multiple of RAF's interval (16.7ms)
                        entityLastUpdates[system.id] = now - (elapsed % interval);
                        entityLastUpdatesGame[system.id] = _this.gameTime;
                    }
                    else {
                        entityLastUpdates[system.id] = now;
                        entityLastUpdatesGame[system.id] = _this.gameTime;
                    }
                    var id = "_" + system.id;
                    if (!toCallAfterUpdateAll[id]) {
                        // Call afterUpdateAll
                        if (system.beforeUpdateAll) {
                            system.beforeUpdateAll(_this.gameTime);
                        }
                        // Save for afterUpdateAll
                        toCallAfterUpdateAll[id] = {
                            system: system,
                            entities: []
                        };
                    }
                    toCallAfterUpdateAll[id].entities.push(entity);
                    // Call update
                    system.update(_this.gameTime, elapsedScaled, entity);
                }
            });
        });
        // Call afterUpdateAll
        for (var attr in toCallAfterUpdateAll) {
            if (!toCallAfterUpdateAll.hasOwnProperty(attr)) {
                continue;
            }
            var system = toCallAfterUpdateAll[attr].system;
            if (system.afterUpdateAll) {
                this.inject(system);
                system.afterUpdateAll(this.gameTime, toCallAfterUpdateAll[attr].entities);
            }
        }
        toCallAfterUpdateAll = {};
    };
    /**
     * Injects the execution context into the system.
     *
     * A system can exist on several worlds at the same time, ECS ensures that global methods will always reference the
     * currently running world.
     *
     * @param system
     */
    ECS.prototype.inject = function (system) {
        system.world = this;
        system.trigger = this.systemTrigger;
        return system;
    };
    /**
     * When an entity receives or loses components, invoking the change method of the systems
     *
     * @param entity
     */
    ECS.prototype.onEntityUpdate = function (entity, added, removed) {
        var _this = this;
        if (!this.entitySystems[entity.id]) {
            return;
        }
        var toNotify = this.entitySystems[entity.id].slice(0);
        outside: for (var idx = toNotify.length - 1; idx >= 0; idx--) {
            var system = toNotify[idx];
            // System is listening to updates on entity?
            if (system.change) {
                var systemComponentTypes = system.componentTypes;
                // Listen to all component type
                if (systemComponentTypes.indexOf(-1) >= 0) {
                    continue;
                }
                if (added && systemComponentTypes.indexOf(added.type) >= 0) {
                    continue outside;
                }
                if (removed && systemComponentTypes.indexOf(removed.type) >= 0) {
                    continue outside;
                }
            }
            // dont match
            toNotify.splice(idx, 1);
        }
        // Notify systems
        toNotify.forEach(function (system) {
            system = _this.inject(system);
            var systemComponentTypes = system.componentTypes;
            var all = systemComponentTypes.indexOf(-1) >= 0;
            system.change(entity, 
            // Send only the list of components this system expects
            all
                ? added
                : (added && systemComponentTypes.indexOf(added.type) >= 0
                    ? added
                    : undefined), all
                ? removed
                : (removed && systemComponentTypes.indexOf(removed.type) >= 0
                    ? removed
                    : undefined));
        });
    };
    /**
     * Indexes an entity
     *
     * @param entity
     */
    ECS.prototype.indexEntity = function (entity, system) {
        var _this = this;
        if (!this.entitySystems[entity.id]) {
            this.entitySystems[entity.id] = [];
        }
        if (system) {
            // Index entity for a specific system
            this.indexEntitySystem(entity, system);
        }
        else {
            // Indexes the entire entity
            this.systems.forEach(function (system) {
                _this.indexEntitySystem(entity, system);
            });
        }
    };
    ECS.System = System;
    ECS.Entity = Entity;
    ECS.Component = Component;
    return ECS;
}());
exports.default = ECS;

}).call(this,require('_process'))
},{"_process":1}]},{},[2])(2)
});
