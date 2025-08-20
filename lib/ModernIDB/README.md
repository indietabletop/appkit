# Modern IndexedDB

## Todo

Include properties for unusual objects in Kaypath type. Eg. Array.length, etc...

## Implementation Notes

In several places, it could feel like subclassing should have been used in certain cases: ObjectStore could extend IDBObjectStore, ModernIDB could extend EventTarget, etc... However, this could not be done without violating the [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle). ModernIDB methods usually return Promises, which are not compatible with IDBRequests. Similarly, the addEventListener/removeEventListener of ModernIDB always dispatch CustomEvents, whereas the base addEventListener/removeEventListener of EventTarget must be able to handle any Event.
