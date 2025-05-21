---
id: "core_src.IScenario"
title: "Interface: IScenario"
sidebar_label: "IScenario"
custom_edit_url: null
---

Test scenario specifies how you want a E2E test to interact with a web browser.
The test scenario can be saved as a `.js` file and passed to the `memlab
run --scenario` command:
```javascript
// save as test.js and use in terminal:
// $ memlab run --scenario test.js

module.exports = {
  url: () => 'https://www.npmjs.com/',
  action: async () => ... ,
  back: async () => ... ,
  cookies: () => ... , // optional
  repeat: () => ... , // optional
  ...
};
```

The test scenario instance can also be passed to the
[run](../modules/api_src.md#run) API exported by `@memlab/api`.
```typescript
const {run} = require('@memlab/api');

(async function () {
  const scenario = {
    url: () => 'https://www.facebook.com',
    action: async () => ... ,
    back: async () => ... ,
    cookies: () => ... , // optional
    repeat: () => ... , // optional
    ...
  };
  const leaks = await run({scenario});
})();
```

## Properties

### <a id="action" name="action"></a> `Optional` **action**: [`InteractionsCallback`](../modules/core_src.md#interactionscallback)

`action` is the callback function that defines the interaction
where you want to trigger memory leaks after the initial page load.
All JS objects in browser allocated by the browser interactions triggered
from the `action` callback will be candidates for memory leak filtering.

* **Parameters**:
  * `page`: <code>[Page](../modules/core_src.md#page)</code> | the puppeteer
    [`Page`](https://pptr.dev/api/puppeteer.page)
    object, which provides APIs to interact with the web browser. To import
    this type, check out [Page](../modules/core_src.md#page).

* **Examples**:
```typescript
const scenario = {
  url: () => 'https://www.npmjs.com/',
  action: async (page) => {
    await page.click('a[href="/link"]');
  },
  back: async (page) => {
    await page.click('a[href="/back"]');
  },
}

module.exports = scenario;
```
Note: Always dispose of puppeteer element handles (e.g., from page.$x or
page.$) to prevent memory leaks in the browser context. Use
element.dispose() or Promise.all(elements.map(e => e.dispose())) to
clean up.
```typescript
const scenario = {
  url: () => 'https://www.npmjs.com/',
  action: async (page) => {
    const elements = await page.$x("//button[contains(., 'Text in Button')]");
    const [button] = elements;
    if (button) {
      await button.click();
    }
    // dispose external references to JS objects in browser context
    await promise.all(elements.map(e => e.dispose()));
  },
  back: async (page) => ... ,
}

module.exports = scenario;
```

 * **Source**:
    * core/src/lib/Types.ts:843

___

### <a id="back" name="back"></a> `Optional` **back**: [`InteractionsCallback`](../modules/core_src.md#interactionscallback)

`back` is the callback function that specifies how memlab should
back/revert the `action` callback. Think of it as an undo action.

* **Parameters**:
  * `page`: <code>[Page](../modules/core_src.md#page)</code> | the puppeteer
    [`Page`](https://pptr.dev/api/puppeteer.page)
    object, which provides APIs to interact with the web browser. To import
    this type, check out [Page](../modules/core_src.md#page).

* **Examples**:
```typescript
const scenario = {
  url: () => 'https://www.npmjs.com/',
  action: async (page) => {
    await page.click('a[href="/link"]');
  },
  back: async (page) => {
    await page.click('a[href="/back"]');
  },
}
```
Check out [this page](/docs/how-memlab-works) on why
memlab needs to undo/revert the `action` callback.

 * **Source**:
    * core/src/lib/Types.ts:869

___

### <a id="beforeinitialpageload" name="beforeinitialpageload"></a> `Optional` **beforeInitialPageLoad**: [`InteractionsCallback`](../modules/core_src.md#interactionscallback)

`beforeInitialPageLoad` is the callback function that will be called only
once before the initial page load. This callback can be used to set up
the HTTP headers or to prepare data before loading the web page.

* **Parameters**:
  * `page`: <code>[Page](../modules/core_src.md#page)</code> | the puppeteer
    [`Page`](https://pptr.dev/api/puppeteer.page)
    object, which provides APIs to interact with the web browser. To import
    this type, check out [Page](../modules/core_src.md#page).

* **Examples**:
```typescript
const scenario = {
  url: () => 'https://www.npmjs.com/',
  beforeInitialPageLoad: async (page) => {
    // before the initial page load
  },
  action: async (page) => {
    await page.click('a[href="/link"]');
  },
  back: async (page) => {
    await page.click('a[href="/back"]');
  },
}

module.exports = scenario;
```

 * **Source**:
    * core/src/lib/Types.ts:745

___

### <a id="beforeleakfilter" name="beforeleakfilter"></a> `Optional` **beforeLeakFilter**: [`InitLeakFilterCallback`](../modules/core_src.md#initleakfiltercallback)

Lifecycle function callback that is invoked initially once before
the subsequent `leakFilter` function calls. This callback could
be used to initialize some data stores or to any one-off
preprocessings.

* **Parameters**:
  * `snapshot`: <code>[IHeapSnapshot](core_src.IHeapSnapshot.md)</code> | the final heap
     snapshot taken after all browser interactions are done.
     Check out [IHeapSnapshot](core_src.IHeapSnapshot.md) for more APIs that queries the
     heap snapshot.
  * `leakedNodeIds`: `Set<number>` | the set of ids of all JS heap objects
     allocated by the `action` call but not released after the `back` call
     in browser.

* **Examples**:
```typescript
module.exports = {
  url: () => ... ,
  action: async (page) => ... ,
  back: async (page) => ... ,
  beforeLeakFilter: (snapshot, leakedNodeIds) {
    // initialize some data stores
  },
};
```

 * **Source**:
    * core/src/lib/Types.ts:955

___

### <a id="ispageloaded" name="ispageloaded"></a> `Optional` **isPageLoaded**: [`CheckPageLoadCallback`](../modules/core_src.md#checkpageloadcallback)

Optional callback function that checks if the web page is loaded
for the initial page load and subsequent browser interactions.

If this callback is not provided, memlab by default
considers a navigation to be finished when there are no network
connections for at least 500ms.

* **Parameters**:
  * `page`: <code>[Page](../modules/core_src.md#page)</code> | the puppeteer
    [`Page`](https://pptr.dev/api/puppeteer.page)
    object, which provides APIs to interact with the web browser. To import
    this type, check out [Page](../modules/core_src.md#page).

* **Returns**: a boolean value, if it returns `true`, memlab will consider
  the navigation completes, if it returns `false`, memlab will keep calling
  this callback until it returns `true`. This is an async callback, you can
  also `await` and returns `true` until some async logic is resolved.

* **Examples**:
```typescript
module.exports = {
  url: () => ... ,
  action: async (page) => ... ,
  back: async (page) => ... ,
  isPageLoaded: async (page) => {
    await page.waitForNavigation({
      // consider navigation to be finished when there are
      // no more than 2 network connections for at least 500 ms.
      waitUntil: 'networkidle2',
      // Maximum navigation time in milliseconds
      timeout: 5000,
    });
    return true;
  },
};
```

 * **Source**:
    * core/src/lib/Types.ts:927

___

### <a id="leakfilter" name="leakfilter"></a> `Optional` **leakFilter**: [`LeakFilterCallback`](../modules/core_src.md#leakfiltercallback)

This callback defines how you want to filter out the
leaked objects. The callback is called for every node (JS heap
object in browser) allocated by the `action` callback, but not
released after the `back` callback. Those objects could be caches
that are retained in memory on purpose, or they are memory leaks.

This optional callback allows you to define your own algorithm
to cherry pick memory leaks for specific JS program under test.

If this optional callback is not defined, memlab will use its
built-in leak filter, which considers detached DOM elements
and unmounted Fiber nodes (detached from React Fiber tree) as
memory leaks.

* **Parameters**:
  * `node`: <code>[IHeapNode](core_src.IHeapNode.md)</code> | the heap object
     allocated but not released. This filter callback will be applied
     to each node allocated but not released in the heap snapshot.
  * `snapshot`: <code>[IHeapSnapshot](core_src.IHeapSnapshot.md)</code> | the final heap
     snapshot taken after all browser interactions are done.
     Check out [IHeapSnapshot](core_src.IHeapSnapshot.md) for more APIs that queries the
     heap snapshot.
  * `leakedNodeIds`: `Set<number>` | the set of ids of all JS heap objects
     allocated by the `action` call but not released after the `back` call
     in browser.

* **Returns**: the boolean value indicating whether the given node in
  the snapshot should be considered as leaked.

* **Examples**:
```typescript
module.exports = {
  url: () => ... ,
  action: async (page) => ... ,
  back: async (page) => ... ,
  leakFilter(node, snapshot, leakedNodeIds) {
    // any unreleased node (JS heap object) with 1MB+
    // retained size is considered a memory leak
    return node.retainedSize > 1000000;
  },
};
```

 * **Source**:
    * core/src/lib/Types.ts:1000

___

### <a id="retainerreferencefilter" name="retainerreferencefilter"></a> `Optional` **retainerReferenceFilter**: [`ReferenceFilterCallback`](../modules/core_src.md#referencefiltercallback)

Callback that can be used to define a logic to decide whether
a reference should be considered as part of the retainer trace.
The callback is called for every reference (edge) in the heap snapshot.

For concrete examples, check out [leakFilter](core_src.IScenario.md#leakfilter).

* **Parameters**:
  * `edge` : <code>[IHeapEdge](core_src.IHeapEdge.md)</code> | the reference (edge)
     that is considered for calcualting the retainer trace
  * `snapshot`: <code>[IHeapSnapshot](core_src.IHeapSnapshot.md)</code> | the heap snapshot
     taken after all browser interactions are done.
     Check out [IHeapSnapshot](core_src.IHeapSnapshot.md) for more APIs that queries the
     heap snapshot.
  * `isReferenceUsedByDefault`: `boolean` | MemLab has its own default
     logic for whether a reference should be considered as part of the
     retainer trace, if this parameter is true, it means MemLab will
     consider this reference when calculating the retainer trace.

* **Returns**: the value indicating whether the given reference should be
considered when calculating the retainer trace. Note that when this
callback returns true, the reference will only be considered as a candidate
for retainer trace, so it may or may not be included in the retainer trace;
however, if this callback returns false, the reference will be excluded.

Note that by excluding a dominator reference of an object (i.e., an edge
that must be traveled through to reach the heap object from GC roots),
the object will be considered as unreachable in the heap graph; and
therefore, the reference and heap object will not be included in the
retainer trace detection and retainer size calculation.

* **Examples**:
```javascript
// save as leak-filter.js
module.exports = {
  retainerReferenceFilter(edge, _snapshot, _leakedNodeIds) {
    // exclude react fiber references
    if (edge.name_or_index.toString().startsWith('__reactFiber$')) {
      return false;
    }
    return true;
  }
};
```

 * **Source**:
    * core/src/lib/Types.ts:1046

___

### <a id="setup" name="setup"></a> `Optional` **setup**: [`InteractionsCallback`](../modules/core_src.md#interactionscallback)

`setup` is the callback function that will be called only once
after the initial page load. This callback can be used to log in
if you have to (we recommend using [cookies](core_src.IScenario.md#cookies))
or to prepare data before the [action](core_src.IScenario.md#action) call.

* **Parameters**:
  * `page`: <code>[Page](../modules/core_src.md#page)</code> | the puppeteer
    [`Page`](https://pptr.dev/api/puppeteer.page)
    object, which provides APIs to interact with the web browser. To import
    this type, check out [Page](../modules/core_src.md#page).

* **Examples**:
```typescript
const scenario = {
  url: () => 'https://www.npmjs.com/',
  setup: async (page) => {
    // log in or prepare data for the interaction
  },
  action: async (page) => {
    await page.click('a[href="/link"]');
  },
  back: async (page) => {
    await page.click('a[href="/back"]');
  },
}

module.exports = scenario;
```

 * **Source**:
    * core/src/lib/Types.ts:794

## Methods

### <a id="cookies"></a>`Optional` **cookies**()

If the page you are running memlab against requires authentication or
specific cookie(s) to be set, you can pass them as
a list of `<name, value, domain>` tuples.

**Note**: please make sure that you provide the correct `domain` field for
the cookies tuples. If no `domain` field is specified, memlab will try
to fill in a domain based on the `url` callback.
For example, when the `domain` field is absent,
memlab will auto fill in `.facebook.com` as domain base
on the initial page load's url: `https://www.facebook.com/`.

 * **Returns**: [`Cookies`](../modules/core_src.md#cookies) | cookie list
* **Examples**:
```typescript
const scenario = {
  url: () => 'https://www.facebook.com/',
  cookies: () => [
    {name:'cm_j', value: 'none', domain: '.facebook.com'},
    {name:'datr', value: 'yJvIY...', domain: '.facebook.com'},
    {name:'c_user', value: '8917...', domain: '.facebook.com'},
    {name:'xs', value: '95:9WQ...', domain: '.facebook.com'},
    // ...
  ],
};

module.exports = scenario;
```

 * **Source**:
    * core/src/lib/Types.ts:715

___

### <a id="repeat"></a>`Optional` **repeat**()

Specifies how many **extra** `action` and `back` actions performed
by memlab.

* **Returns**: a number value specifies the number of extra actions.

* **Examples**:
```typescript
module.exports = {
  url: () => ... ,
  action: async (page) => ... ,
  back: async (page) => ... ,
  // browser interaction: two additional [ action -> back ]
  // init-load -> action -> back -> action -> back -> action -> back
  repeat: () => 2,
};
```

 * **Returns**: `number`
 * **Source**:
    * core/src/lib/Types.ts:888

___

### <a id="url"></a>**url**()

String value of the initial url of the page.

 * **Returns**: `string` | the string value of the initial url
* **Examples**:
```typescript
const scenario = {
  url: () => 'https://www.npmjs.com/',
};

module.exports = scenario;
```
If a test scenario only specifies the `url` callback (without the `action`
callback), memlab will try to detect memory leaks from the initial page
load. All objects allocated by the initial page load will be candidates
for memory leak filtering.

 * **Source**:
    * core/src/lib/Types.ts:763
