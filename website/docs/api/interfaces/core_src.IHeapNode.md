---
id: "core_src.IHeapNode"
title: "Interface: IHeapNode"
sidebar_label: "IHeapNode"
custom_edit_url: null
---

## Hierarchy

- [`IHeapNodeBasic`](core_src.IHeapNodeBasic.md)

  ↳ **`IHeapNode`**

  ↳↳ [`IHeapStringNode`](core_src.IHeapStringNode.md)

## Properties

### <a id="attributes" name="attributes"></a> **attributes**: `number`

 * **Source**:
    * core/src/lib/Types.ts:565

___

### <a id="detachstate" name="detachstate"></a> **detachState**: `number`

 * **Source**:
    * core/src/lib/Types.ts:563

___

### <a id="dominatornode" name="dominatornode"></a> **dominatorNode**: ``null`` \| [`IHeapNode`](core_src.IHeapNode.md)

 * **Source**:
    * core/src/lib/Types.ts:574

___

### <a id="edge\_count" name="edge\_count"></a> **edge\_count**: `number`

 * **Source**:
    * core/src/lib/Types.ts:567

___

### <a id="highlight" name="highlight"></a> `Optional` **highlight**: `boolean`

 * **Source**:
    * core/src/lib/Types.ts:576

___

### <a id="id" name="id"></a> **id**: `number`

 * **Source**:
    * core/src/lib/Types.ts:553

___

### <a id="isstring" name="isstring"></a> **isString**: `boolean`

 * **Source**:
    * core/src/lib/Types.ts:577

___

### <a id="is\_detached" name="is\_detached"></a> **is\_detached**: `boolean`

 * **Source**:
    * core/src/lib/Types.ts:562

___

### <a id="location" name="location"></a> **location**: ``null`` \| [`IHeapLocation`](core_src.IHeapLocation.md)

 * **Source**:
    * core/src/lib/Types.ts:575

___

### <a id="name" name="name"></a> **name**: `string`

 * **Source**:
    * core/src/lib/Types.ts:552

___

### <a id="nodeindex" name="nodeindex"></a> **nodeIndex**: `number`

 * **Source**:
    * core/src/lib/Types.ts:572

___

### <a id="pathedge" name="pathedge"></a> **pathEdge**: ``null`` \| [`IHeapEdge`](core_src.IHeapEdge.md)

 * **Source**:
    * core/src/lib/Types.ts:571

___

### <a id="references" name="references"></a> **references**: [`IHeapEdge`](core_src.IHeapEdge.md)[]

 * **Source**:
    * core/src/lib/Types.ts:569

___

### <a id="referrers" name="referrers"></a> **referrers**: [`IHeapEdge`](core_src.IHeapEdge.md)[]

 * **Source**:
    * core/src/lib/Types.ts:570

___

### <a id="retainedsize" name="retainedsize"></a> **retainedSize**: `number`

 * **Source**:
    * core/src/lib/Types.ts:573

___

### <a id="self\_size" name="self\_size"></a> **self\_size**: `number`

 * **Source**:
    * core/src/lib/Types.ts:566

___

### <a id="snapshot" name="snapshot"></a> **snapshot**: [`IHeapSnapshot`](core_src.IHeapSnapshot.md)

 * **Source**:
    * core/src/lib/Types.ts:561

___

### <a id="trace\_node\_id" name="trace\_node\_id"></a> **trace\_node\_id**: `number`

 * **Source**:
    * core/src/lib/Types.ts:568

___

### <a id="type" name="type"></a> **type**: `string`

 * **Source**:
    * core/src/lib/Types.ts:551

## Methods

### <a id="findanyreferrer"></a>**findAnyReferrer**(`predicate`)

 * **Parameters**:
    * `predicate`: [`Predicator`](../modules/core_src.md#predicator)<[`IHeapEdge`](core_src.IHeapEdge.md)\>
 * **Returns**: `Nullable`<[`IHeapEdge`](core_src.IHeapEdge.md)\>
 * **Source**:
    * core/src/lib/Types.ts:582

___

### <a id="findreference"></a>**findReference**(`predicate`)

 * **Parameters**:
    * `predicate`: [`Predicator`](../modules/core_src.md#predicator)<[`IHeapEdge`](core_src.IHeapEdge.md)\>
 * **Returns**: `Nullable`<[`IHeapEdge`](core_src.IHeapEdge.md)\>
 * **Source**:
    * core/src/lib/Types.ts:581

___

### <a id="findreferrers"></a>**findReferrers**(`predicate`)

 * **Parameters**:
    * `predicate`: [`Predicator`](../modules/core_src.md#predicator)<[`IHeapEdge`](core_src.IHeapEdge.md)\>
 * **Returns**: [`IHeapEdge`](core_src.IHeapEdge.md)[]
 * **Source**:
    * core/src/lib/Types.ts:583

___

### <a id="foreachreference"></a>**forEachReference**(`callback`)

 * **Parameters**:
    * `callback`: [`EdgeIterationCallback`](../modules/core_src.md#edgeiterationcallback)
 * **Returns**: `void`
 * **Source**:
    * core/src/lib/Types.ts:579

___

### <a id="foreachreferrer"></a>**forEachReferrer**(`callback`)

 * **Parameters**:
    * `callback`: [`EdgeIterationCallback`](../modules/core_src.md#edgeiterationcallback)
 * **Returns**: `void`
 * **Source**:
    * core/src/lib/Types.ts:580

___

### <a id="getanyreferrer"></a>**getAnyReferrer**(`edgeName`, `edgeType?`)

 * **Parameters**:
    * `edgeName`: `string` \| `number`
    * `edgeType?`: `string`
 * **Returns**: `Nullable`<[`IHeapEdge`](core_src.IHeapEdge.md)\>
 * **Source**:
    * core/src/lib/Types.ts:592

___

### <a id="getanyreferrernode"></a>**getAnyReferrerNode**(`edgeName`, `edgeType?`)

 * **Parameters**:
    * `edgeName`: `string` \| `number`
    * `edgeType?`: `string`
 * **Returns**: `Nullable`<[`IHeapNode`](core_src.IHeapNode.md)\>
 * **Source**:
    * core/src/lib/Types.ts:596

___

### <a id="getreference"></a>**getReference**(`edgeName`, `edgeType?`)

 * **Parameters**:
    * `edgeName`: `string` \| `number`
    * `edgeType?`: `string`
 * **Returns**: `Nullable`<[`IHeapEdge`](core_src.IHeapEdge.md)\>
 * **Source**:
    * core/src/lib/Types.ts:584

___

### <a id="getreferencenode"></a>**getReferenceNode**(`edgeName`, `edgeType?`)

 * **Parameters**:
    * `edgeName`: `string` \| `number`
    * `edgeType?`: `string`
 * **Returns**: `Nullable`<[`IHeapNode`](core_src.IHeapNode.md)\>
 * **Source**:
    * core/src/lib/Types.ts:588

___

### <a id="getreferrernodes"></a>**getReferrerNodes**(`edgeName`, `edgeType?`)

 * **Parameters**:
    * `edgeName`: `string` \| `number`
    * `edgeType?`: `string`
 * **Returns**: [`IHeapNode`](core_src.IHeapNode.md)[]
 * **Source**:
    * core/src/lib/Types.ts:601

___

### <a id="getreferrers"></a>**getReferrers**(`edgeName`, `edgeType?`)

 * **Parameters**:
    * `edgeName`: `string` \| `number`
    * `edgeType?`: `string`
 * **Returns**: [`IHeapEdge`](core_src.IHeapEdge.md)[]
 * **Source**:
    * core/src/lib/Types.ts:600

___

### <a id="markasdetached"></a>**markAsDetached**()

 * **Returns**: `void`
 * **Source**:
    * core/src/lib/Types.ts:564

___

### <a id="tostringnode"></a>**toStringNode**()

 * **Returns**: `Nullable`<[`IHeapStringNode`](core_src.IHeapStringNode.md)\>
 * **Source**:
    * core/src/lib/Types.ts:578