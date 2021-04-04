/**
 * Utility class for asynchronous access to a list
 */
export declare class Iterator<T> {
    private end;
    private cache;
    private next;
    constructor(next: (i: number) => T | void);
    /**
     * Allows iterate across all items
     *
     * @param cb
     */
    each(cb: (item: T) => boolean | void): void;
    /**
     * returns the value of the first element that satisfies the provided testing function.
     *
     * @param test
     */
    find(test: (item: T) => boolean): T | undefined;
    /**
     * creates a array with all elements that pass the test implemented by the provided function.
     *
     * @param test
     */
    filter(test: (item: T) => boolean): T[];
    /**
     * creates a new array with the results of calling a provided function on every element in this iterator.
     *
     * @param cb
     */
    map<P>(cb: (item: T) => P): P[];
}
export declare type Susbcription = (entity: Entity, added?: Component<any>, removed?: Component<any>) => void;
/**
 * Representation of an entity in ECS
 */
export declare abstract class Entity {
    /**
     * Lista de interessados sobre a atualiação dos componentes
     */
    private subscriptions;
    /**
     * Components by type
     */
    private components;
    id: number;
    /**
     * Informs if the entity is active
     */
    active: boolean;
    constructor();
    /**
     * Allows interested parties to receive information when this entity's component list is updated
     *
     * @param handler
     */
    subscribe(handler: Susbcription): () => Entity;
    /**
     * Add a component to this entity
     *
     * @param component
     */
    add(component: Component<any>): void;
    /**
     * Removes a component's reference from this entity
     *
     * @param component
     */
    remove(component: Component<any>): void;
}
/**
 * Force typing
 */
export declare type ComponentClassType<P, S> = (new (data: P) => Component<P, S>) & {
    /**
     * Static reference to type id
     */
    type: number;
    /**
     * Get all instances of this component from entity
     *
     * @param entity
     */
    allFrom(entity: Entity): Component<P, S>[];
    /**
     * Get one instance of this component from entity
     *
     * @param entity
     */
    oneFrom(entity: Entity): Component<P, S>;
};
/**
 * Representation of a component in ECS
 */
export declare abstract class Component<T, S = Record<string, any>> {
    /**
     * Register a new component class
     */
    static register<P, S = Record<string, any>>(): ComponentClassType<P, S>;
    type: number;
    data: T;
    /**
     * A component can have attributes. Attributes are secondary values used to save miscellaneous data required by some
     * specialized systems.
     */
    attr: Partial<S>;
    constructor(type: number, data: T);
}
/**
 * System callback
 */
export declare type EventCallback = (data: any, entities: Iterator<Entity>) => void;
/**
 * Represents the logic that transforms component data of an entity from its current state to its next state. A system
 * runs on entities that have a specific set of component types.
 */
export declare abstract class System {
    /**
     * IDs of the types of components this system expects the entity to have before it can act on. If you want to
     * create a system that acts on all entities, enter [-1]
     */
    private readonly componentTypes;
    private readonly callbacks;
    /**
     * Unique identifier of an instance of this system
     */
    readonly id: number;
    /**
     * The maximum times per second this system should be updated
     */
    frequence: number;
    /**
     * Reference to the world, changed at runtime during interactions.
     */
    protected world: ECS;
    /**
     * Allows to trigger any event. Systems interested in this event will be notified immediately
     *
     * Injected by ECS at runtime
     *
     * @param event
     * @param data
     */
    protected trigger: (event: string, data: any) => void;
    /**
     * Invoked before updating entities available for this system. It is only invoked when there are entities with the
     * characteristics expected by this system.
     *
     * @param time
     */
    beforeUpdateAll?(time: number): void;
    /**
     * Invoked in updates, limited to the value set in the "frequency" attribute
     *
     * @param time
     * @param delta
     * @param entity
     */
    update?(time: number, delta: number, entity: Entity): void;
    /**
     * Invoked after performing update of entities available for this system. It is only invoked when there are entities
     * with the characteristics expected by this system.
     *
     * @param time
     */
    afterUpdateAll?(time: number, entities: Entity[]): void;
    /**
     * Invoked when an expected feature of this system is added or removed from the entity
     *
     * @param entity
     * @param added
     * @param removed
     */
    change?(entity: Entity, added?: Component<any>, removed?: Component<any>): void;
    /**
     * Invoked when:
     * a) An entity with the characteristics (components) expected by this system is added in the world;
     * b) This system is added in the world and this world has one or more entities with the characteristics expected by
     * this system;
     * c) An existing entity in the same world receives a new component at runtime and all of its new components match
     * the standard expected by this system.
     *
     * @param entity
     */
    enter?(entity: Entity): void;
    /**
     * Invoked when:
     * a) An entity with the characteristics (components) expected by this system is removed from the world;
     * b) This system is removed from the world and this world has one or more entities with the characteristics
     * expected by this system;
     * c) An existing entity in the same world loses a component at runtime and its new component set no longer matches
     * the standard expected by this system
     *
     * @param entity
     */
    exit?(entity: Entity): void;
    /**
     * @param componentTypes IDs of the types of components this system expects the entity to have before it can act on.
     * If you want to create a system that acts on all entities, enter [-1]
     * @param frequence The maximum times per second this system should be updated. Defaults 0
     */
    constructor(componentTypes: number[], frequence?: number);
    /**
     * Allows you to search in the world for all entities that have a specific set of components.
     *
     * @param componentTypes Enter [-1] to list all entities
     */
    protected query(componentTypes: number[]): Iterator<Entity>;
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
    protected listenTo(event: string, callback: EventCallback, once?: boolean): void;
}
/**
 * The very definition of the ECS. Also called Admin or Manager in other implementations.
 */
export default class ECS {
    static System: typeof System;
    static Entity: typeof Entity;
    static Component: typeof Component;
    /**
     * All systems in this world
     */
    private systems;
    /**
     * All entities in this world
     */
    private entities;
    /**
     * Indexes the systems that must be run for each entity
     */
    private entitySystems;
    /**
     * Records the last instant a system was run in this world for an entity, using real time
     */
    private entitySystemLastUpdate;
    /**
     * Records the last instant a system was run in this world for an entity, using game time
     */
    private entitySystemLastUpdateGame;
    /**
     * Saves subscriptions made to entities
     */
    private entitySubscription;
    /**
     * Injection for the system trigger method
     *
     * @param event
     * @param data
     */
    private systemTrigger;
    /**
     * Allows you to apply slow motion effect on systems execution. When timeScale is 1, the timestamp and delta
     * parameters received by the systems are consistent with the actual timestamp. When timeScale is 0.5, the values
     * received by systems will be half of the actual value.
     *
     * ATTENTION! The systems continue to be invoked obeying their normal frequencies, what changes is only the values
     * received in the timestamp and delta parameters.
     */
    timeScale: number;
    /**
     * Last execution of update method
     */
    private lastUpdate;
    /**
     * The timestamp of the game, different from the real world, is updated according to timeScale. If at no time does
     * the timeScale change, the value is the same as the current timestamp.
     *
     * This value is sent to the systems update method.
     */
    private gameTime;
    constructor(systems?: System[]);
    /**
     * Remove all entities and systems
     */
    destroy(): void;
    /**
     * Get all entities
     */
    getEntities(): Entity[];
    /**
     * Get an entity by id
     *
     * @param id
     */
    getEntity(id: number): Entity | undefined;
    /**
     * Add an entity to this world
     *
     * @param entity
     */
    addEntity(entity: Entity): void;
    /**
     * Remove an entity from this world
     *
     * @param idOrInstance
     */
    removeEntity(idOrInstance: number | Entity): void;
    /**
     * Add a system in this world
     *
     * @param system
     */
    addSystem(system: System): void;
    /**
     * Remove a system from this world
     *
     * @param system
     */
    removeSystem(system: System): void;
    /**
     * Allows you to search for all entities that have a specific set of components.
     *
     * @param componentTypes Enter [-1] to list all entities
     */
    query(componentTypes: number[]): Iterator<Entity>;
    /**
     * Invokes the "update" method of the systems in this world.
     */
    update(): void;
    /**
     * Injects the execution context into the system.
     *
     * A system can exist on several worlds at the same time, ECS ensures that global methods will always reference the
     * currently running world.
     *
     * @param system
     */
    private inject;
    /**
     * When an entity receives or loses components, invoking the change method of the systems
     *
     * @param entity
     */
    private onEntityUpdate;
    private indexEntitySystem;
    /**
     * Indexes an entity
     *
     * @param entity
     */
    private indexEntity;
}
