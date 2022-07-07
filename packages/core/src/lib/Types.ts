/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+ws_labs
 * @format
 */

import {ParsedArgs} from 'minimist';
import type {LaunchOptions, Page} from 'puppeteer';
import type {ErrorHandling, MemLabConfig} from './Config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/** @internal */
export type AnyValue = any;

/** @internal */
export type RecordValue =
  | string
  | number
  | boolean
  | null
  | RecordValue[]
  | {[key: string]: RecordValue};

/** @internal */
export type Nullable<T> = T | null;
/** @internal */
export type Optional<T> = Nullable<T> | undefined;
/** @internal */
export type AnyRecord = Record<string, RecordValue>;
/** @internal */
export type AnyAyncFunction = (...args: AnyValue[]) => Promise<AnyValue>;
/** @internal */
export type AnyFunction = (...args: AnyValue[]) => AnyValue;
/** @internal */
export type AnyOptions = Record<string, unknown>;
/** @internal */
export type UnusedOptions = Record<string, never>;
/** @internal */
export type Command = [string, string[], AnyOptions];

export type Predicator<T> = (node: T) => boolean;
/** @internal */
export type HeapNodeIdSet = Set<number>;

/** @internal */
export type HaltOrThrowOptions = {
  printErrorBeforeHalting?: boolean;
  errorHandling?: ErrorHandling;
  primaryMessageToPrint?: string;
  secondaryMessageToPrint?: string;
  printCallback?: () => void;
};

/** @internal */
export type CLIOptions = {
  cliArgs: ParsedArgs;
  configFromOptions?: AnyRecord;
};

/** @internal */
export type XvfbType = {
  start: (callback: (error: Error) => AnyValue | null) => void;
  stop: (callback: (error: Error) => AnyValue | null) => void;
  startSync: () => void;
  stopSync: () => void;
  display: () => string;
};

/** @internal */
export type CLIArgs = {
  verbose: boolean;
  app: string;
  interaction: string;
  full: boolean;
  qe: string;
  sc: boolean;
  snapshot: boolean;
  engine: string;
  browser: string;
  device: string;
  debug: boolean;
  baseline: string;
  target: string;
  final: string;
  scenario: string;
  'reset-gk': boolean;
  'gk-on': string;
  'gk-off': string;
  'skip-snapshot': boolean;
  'skip-screenshot': boolean;
  'skip-gc': boolean;
  'skip-scroll': boolean;
  'skip-extra-ops': boolean;
  'skip-extra-op': boolean;
  'run-mode': string;
  'local-puppeteer': boolean;
  'snapshot-dir': string;
};

export type Cookies = Array<{
  name: string;
  value: string;
}>;

/** @internal */
export interface IE2EScenarioSynthesizer {
  getAppName(): string;
  getOrigin(): Nullable<string>;
  getDomain(): string;
  getDomainPrefixes(): string[];
  getCookieFile(visitPlan: IE2EScenarioVisitPlan): string | null;
  getAvailableSteps(): IE2EStepBasic[];
  getNodeNameBlocklist(): string[];
  getEdgeNameBlocklist(): string[];
  getDefaultStartStepName(): string;
  injectPlan(stepName: string, scenario: IScenario): void;
  synthesisForTarget(stepName: string): IE2EScenarioVisitPlan;
  getAvailableVisitPlans(): IE2EScenarioVisitPlan[];
  getAvailableTargetNames(
    options: AnyOptions & {
      filterCb?: (node: IE2EScenarioVisitPlan) => boolean;
    },
  ): string[];
  getNumberOfWarmup(): number;
  getBaseURL(options: AnyOptions): string;
  getURLParameters(options: AnyOptions): string;
  getDevice(): string;
  getExtraOperationsForStep(_stepInfo: E2EStepInfo): E2EOperation[];
  synthesis(
    baseline: string,
    target: string,
    intermediates: string[],
    options: E2ESynthesizerOptions,
  ): IE2EScenarioVisitPlan;
}

/** @internal */
export interface E2EScenarioSynthesizerConstructor {
  new (config: Config): IE2EScenarioSynthesizer;
}

/** @internal */
export interface IRunningMode {
  setConfig(config: Config): void;
  beforeRunning(visitPlan: IE2EScenarioVisitPlan): void;
  shouldGC(tabInfo?: E2EStepInfo): boolean;
  shouldScroll(tabInfo?: E2EStepInfo): boolean;
  shouldGetMetrics(tabInfo?: E2EStepInfo): boolean;
  shouldUseConciseConsole(tabInfo?: E2EStepInfo): boolean;
  shouldTakeScreenShot(_tabInfo?: E2EStepInfo): boolean;
  shouldTakeHeapSnapshot(tabInfo?: E2EStepInfo): boolean;
  shouldExtraWaitForTarget(tabInfo?: E2EStepInfo): boolean;
  shouldExtraWaitForFinal(tabInfo?: E2EStepInfo): boolean;
  shouldRunExtraTargetOperations(tabInfo?: E2EStepInfo): boolean;
  getAdditionalMetrics(
    page: Page,
    tabInfo?: E2EStepInfo,
  ): Promise<E2EStepInfo['metrics']>;
  postProcessData(visitPlan: IE2EScenarioVisitPlan): void;
}

/** @internal */
export type Config = MemLabConfig;

/** @internal */
export type QuickExperiment = {
  universe: string;
  experiment: string;
  group: string;
};

/**
 * The type for defining custom leak-filtering logic.
 * * **Examples**:
 * ```typescript
 *
 * let map = Object.create(null);
 * const beforeLeakFilter = (snapshot: IHeapSnapshot, _leakedNodeIds: HeapNodeIdSet): void => {
 *   map = initializeMapUsingSnapshot(snapshot);
 * };
 *
 * // duplicated string with size > 1KB as memory leak
 * const leakFilter = (node: IHeapNode): boolean => {
 *   if (node.type !== 'string' || node.retainedSize < 1000) {
 *     return false;
 *   }
 *   const str = utils.getStringNodeValue(node);
 *   return map[str] > 1;
 * };
 *
 * export default {beforeLeakFilter, leakFilter};
 * ```
 */
export interface ILeakFilter {
  beforeLeakFilter?: InitLeakFilterCallback;
  leakFilter: LeakFilterCallback;
}

/**
 * Lifecycle function callback that is invoked initially once before calling any
 * leak filter function.
 *
 * @param snaphost - heap snapshot see {@link IHeapSnapshot}
 * @param leakedNodeIds - the set of leaked object (node) ids.
 */
export type InitLeakFilterCallback = (
  snapshot: IHeapSnapshot,
  leakedNodeIds: HeapNodeIdSet,
) => void;

/**
 * Callback that can be used to define a logic to filter the
 * leaked objects. The callback is only called for every node
 * allocated but not released from the target interaction
 * in the heap snapshot.
 *
 * @param node - the node that is kept alive in the memory in the heap snapshot
 * @param snapshot - the snapshot of target interaction
 * @param leakedNodeIds - the set of leaked node ids
 *
 * @returns the value indicating whether the given node in the snapshot
 * should be considered as leaked.
 * * **Examples**:
 * ```javascript
 * // any node in the heap snapshot that is greater than 1MB
 * function leakFilter(node, _snapshot, _leakedNodeIds) {
 *  return node.retainedSize > 1000000;
 * };
 * ```
 */
export type LeakFilterCallback = (
  node: IHeapNode,
  snapshot: IHeapSnapshot,
  leakedNodeIds: HeapNodeIdSet,
) => boolean;

/**
 * This callback is used to define interactions about how `memlab` should interact with your app.
 */
export type InteractionsCallback = (
  page: Page,
  args?: OperationArgs,
) => Promise<void>;

/**
 * This is the type definition for the test scenario file that you pass in to
 * the `memlab run --scenario` command. The test scenario instance can also be
 * passed to the [`run` API](docs/api/modules/api_src#run) exported by `@memlab/api`.
 */
export interface IScenario {
  /** @internal */
  name?: () => string;
  /** @internal */
  app?: () => string;
  /**
   * If the page you are running memlab against requires authentication or
   * specific cookie(s) to be set, you can pass them as
   * a list of <name, value> pairs.
   */
  cookies?: () => Cookies;
  /**
   * String value of the initial url of the page.
   *
   * * **Examples**:
   * ```typescript
   * const scenario = {
   *   url: () => 'https://www.youtube.com',
   *   // ...
   * }
   * ```
   */
  url: () => string;
  /**
   * `action` is callback function to define how the interactions should take place.
   * `memlab` will interact with the page following what's described in the body
   * of this function right before taking a heap snapshot for the target page.
   *
   * * **Examples**:
   * ```typescript
   * async function action(page) {
   *   const [button] = await page.$x("//button[contains(., 'Create detached DOMs')]");
   *   if (button) {
   *     await button.click();
   *   }
   * }
   ```
   */
  action?: InteractionsCallback;
  /**
   * `back` is callback function to define how memlab should back/revert the action
   * performed before. Think of it as undo action.
   *
   * Example:
   * ```typescript
   * async function back(page) {
   *   await page.click('a[href="/"]')
   * }
   ```
   */
  back?: InteractionsCallback;
  /**
   * Specifies how many times `memlab` should repeat the `action` and `back`.
   */
  repeat?: () => number;
  /**
   * Callback function to provide if the page is loaded.
   * @param page - puppeteer's [Page](https://pptr.dev/api/puppeteer.page/) object.
   */
  isPageLoaded?: CheckPageLoadCallback;
  /**
   * Lifecycle function callback that is invoked initially once before calling any
   * leak filter function.
   *
   * @param snaphost - heap snapshot see {@link IHeapSnapshot}
   * @param leakedNodeIds - the set of leaked object (node) ids.
   */
  beforeLeakFilter?: InitLeakFilterCallback;
  /**
   * Callback that can be used to define a logic to filter the
   * leaked objects. The callback is only called for every node
   * allocated but not released from the target interaction
   * in the heap snapshot.
   *
   * @param node - the node that is kept alive in the memory in the heap snapshot
   * @param snapshot - the snapshot of target interaction
   * @param leakedNodeIds - the set of leaked node ids
   *
   * @returns the value indicating whether the given node in the snapshot
   * should be considered as leaked.
   * * **Examples**:
   * ```javascript
   * // any node in the heap snapshot that is greater than 1MB
   * function leakFilter(node, _snapshot, _leakedNodeIds) {
   *  return node.retainedSize > 1000000;
   * };
   * ```
   */
  leakFilter?: LeakFilterCallback;
}

/** @internal */
export type LeakTracePathItem = {
  node?: IHeapNode;
  edge?: IHeapEdge;
  next?: LeakTracePathItem;
  edgeRetainSize?: number;
};

/** @internal */
export type TraceCluster = {
  // id is assigned when saving unique trace clusters to Ent in PHP
  id?: number;
  path: LeakTracePathItem;
  count?: number;
  snapshot?: IHeapSnapshot;
  retainedSize?: number;
  leakedNodeIds?: HeapNodeIdSet;
  clusterMetaInfo?: TraceClusterMetaInfo;
};

/** @internal */
export type TraceClusterDiff = {
  staleClusters: TraceCluster[];
  clustersToAdd: TraceCluster[];
  allClusters: TraceCluster[][];
};

/** @internal */
export type LeakTraceElement = {
  kind: string; // element kind
  id?: number; // node id if exists
  name?: string;
  name_or_index?: string | number;
  type: string; // object or reference type from JS engine
};

/** @internal */
export type LeakTrace = LeakTraceElement[];

/** @internal */
export type TraceDiff = {
  staleClusters: LeakTrace[];
  clustersToAdd: LeakTrace[];
  allClusters: LeakTrace[][];
};

/** @internal */
export type TraceClusterMetaInfo = {
  cluster_id: number;
  creation_time: number;
  task?: string;
  app: string;
  num_duplicates?: number;
  retained_size?: number;
  interaction_vector?: string[];
  interaction: string;
  interaction_summary: string;
  leak_trace_summary: string;
  leak_trace_handle?: string;
  meta_data: string;
};

/** @internal */
export interface E2EInteraction {
  kind: string;
  timeout?: number;
}

/** @internal */
export type E2EOperation = E2EInteraction & {
  selector: string;
  act(page: Page, opArgs?: OperationArgs): Promise<void>;
};

/** @internal */
export type E2ESynthesizerOptions = {
  name?: string;
  type?: string;
  start?: string;
  final?: string;
  setupSteps?: string[];
  warmupSteps?: string[];
  cleanupSteps?: string[];
  repeat?: number;
  repeatSteps?: string[];
  dataBuilder?: IDataBuilder;
  newTestUser?: boolean;
  gk_enable?: string[];
  gk_disable?: string[];
};

/** @internal */
export interface IDataBuilder {
  className: string;
  state: Record<string, AnyValue>;
}

/**
 * Callback function to provide if the page is loaded.
 * @param page - puppeteer's [Page](https://pptr.dev/api/puppeteer.page/) object.
 */
export type CheckPageLoadCallback = (page: Page) => Promise<boolean>;

/** @internal */
export interface IE2EScenarioVisitPlan {
  name: string;
  appName: string;
  type: string;
  newTestUser: boolean;
  device: string;
  baseURL: string;
  URLParameters: string;
  tabsOrder: E2EStepInfo[];
  numOfWarmup: number;
  dataBuilder: Optional<IDataBuilder>;
  isPageLoaded?: CheckPageLoadCallback;
}

/** @internal */
export type OperationArgs = {
  isPageLoaded?: CheckPageLoadCallback;
  showProgress?: boolean;
  failedURLs?: AnyRecord;
  pageHistoryLength?: number[];
  delay?: number;
  mute?: boolean;
  warmup?: boolean;
  noWaitAfterPageLoad?: boolean;
};

/** @internal */
export interface IE2EStepBasic {
  name: string;
  url: string;
  urlParams?: Array<{name: string; value: string}>;
  type?: string;
  delay?: number;
  interactions: E2EOperation | Array<E2EOperation | InteractionsCallback>;
  postInteractions?: E2EOperation | Array<E2EOperation | InteractionsCallback>;
}

/** @internal */
export type E2EStepInfo = IE2EStepBasic & {
  snapshot: boolean;
  screenshot: boolean;
  idx: number;
  JSHeapUsedSize: number;
  delay?: number;
  metrics: Record<string, number>;
};

/** @internal */
export interface IBrowserInfo {
  _browserVersion: string;
  _puppeteerConfig: LaunchOptions;
  _consoleMessages: string[];
}

export type RunMetaInfo = {
  app: string;
  interaction: string;
  type: string;
  browserInfo: IBrowserInfo;
};

export interface IHeapSnapshot {
  snapshot: RawHeapSnapshot;
  nodes: IHeapNodes;
  edges: IHeapEdges;
  getNodeById(id: number): Nullable<IHeapNode>;
  clearShortestPathInfo(): void;
  // heap query APIs
  hasObjectWithClassName(className: string): boolean;
  getAnyObjectWithClassName(className: string): Nullable<IHeapNode>;
  hasObjectWithPropertyName(nameOrIndex: string | number): boolean;
  hasObjectWithTag(tag: string): boolean;
}

export interface IHeapLocation {
  snapshot: IHeapSnapshot;
  script_id: number;
  line: number;
  column: number;
}

export interface IHeapEdgeBasic {
  name_or_index: number | string;
  type: string;
}

export interface IHeapEdge extends IHeapEdgeBasic {
  snapshot: IHeapSnapshot;
  edgeIndex: number;
  is_index: boolean;
  to_node: number;
  toNode: IHeapNode;
  fromNode: IHeapNode;
}

export interface IHeapEdges {
  length: number;
  get(index: number): IHeapEdge;
  forEach(callback: (edge: IHeapEdge, index: number) => void | boolean): void;
}

export interface IHeapNodeBasic {
  type: string;
  name: string;
  id: number;
}

export type EdgeIterationCallback = (
  edge: IHeapEdge,
) => Optional<{stop: boolean}>;

export interface IHeapNode extends IHeapNodeBasic {
  snapshot: IHeapSnapshot;
  is_detached: boolean;
  detachState: number;
  markAsDetached(): void;
  attributes: number;
  self_size: number;
  edge_count: number;
  trace_node_id: number;
  references: IHeapEdge[];
  referrers: IHeapEdge[];
  pathEdge: IHeapEdge | null;
  nodeIndex: number;
  retainedSize: number;
  dominatorNode: IHeapNode | null;
  location: IHeapLocation | null;
  highlight?: boolean;
  isString: boolean;
  toStringNode(): Nullable<IHeapStringNode>;
  forEachReference(callback: EdgeIterationCallback): void;
  forEachReferrer(callback: EdgeIterationCallback): void;
  findReference: (predicate: Predicator<IHeapEdge>) => Nullable<IHeapEdge>;
  findAnyReferrer: (predicate: Predicator<IHeapEdge>) => Nullable<IHeapEdge>;
  findReferrers: (predicate: Predicator<IHeapEdge>) => IHeapEdge[];
  getReference: (
    edgeName: string | number,
    edgeType?: string,
  ) => Nullable<IHeapEdge>;
  getReferenceNode: (
    edgeName: string | number,
    edgeType?: string,
  ) => Nullable<IHeapNode>;
  getAnyReferrer: (
    edgeName: string | number,
    edgeType?: string,
  ) => Nullable<IHeapEdge>;
  getAnyReferrerNode: (
    edgeName: string | number,
    edgeType?: string,
  ) => Nullable<IHeapNode>;
  getReferrers: (edgeName: string | number, edgeType?: string) => IHeapEdge[];
  getReferrerNodes: (
    edgeName: string | number,
    edgeType?: string,
  ) => IHeapNode[];
}

export interface IHeapStringNode extends IHeapNode {
  stringValue: string;
}

export interface IHeapNodes {
  length: number;
  get(index: number): IHeapNode;
  forEach(callback: (node: IHeapNode, index: number) => void | boolean): void;
  forEachTraceable(
    callback: (node: IHeapNode, index: number) => void | boolean,
  ): void;
}

/** @internal */
export type HeapNodeFields = string[];
/** @internal */
export type HeapNodeTypes = string[];
/** @internal */
export type RawHeapNodeTypes = Array<HeapNodeTypes | string>;
/** @internal */
export type HeapEdgeFields = string[];
/** @internal */
export type HeapEdgeTypes = string[] | string;
/** @internal */
export type RawHeapEdgeTypes = Array<HeapEdgeTypes | string>;
/** @internal */
export type HeapTraceFunctionInfoFields = string[];
/** @internal */
export type HeapTraceNodeFields = string[];
/** @internal */
export type HeapSampleFields = string[];
/** @internal */
export type HeapLocationFields = string[];

/** @internal */
export type HeapSnapshotMeta = {
  node_fields: HeapNodeFields;
  node_types: RawHeapNodeTypes;
  edge_fields: HeapEdgeFields;
  edge_types: RawHeapEdgeTypes;
  trace_function_info_fields: HeapTraceFunctionInfoFields;
  trace_node_fields: HeapTraceNodeFields;
  sample_fields: HeapSampleFields;
  location_fields: HeapLocationFields;
};

/** @internal */
export type HeapSnapshotInfo = {
  meta: HeapSnapshotMeta;
  node_count: number;
  edge_count: number;
  trace_function_count: number;
};

/** @internal */
export type RawHeapSnapshot = {
  snapshot: HeapSnapshotInfo;
  nodes: number[];
  edges: number[];
  trace_function_infos: number[];
  trace_tree: number;
  samples: number[];
  locations: number[];
  strings: string[];
};

/** @internal */
export interface ISerializedInfo {
  [key: string]: string | number | boolean | ISerializedInfo;
}

/** @internal */
export type NumericDictionary = {[index: number]: number};

/** @internal */
export interface IOveralHeapInfo {
  fiberNodeSize: number;
  regularFiberNodeSize: number;
  detachedFiberNodeSize: number;
  alternateFiberNodeSize: number;
  error: number;
}

/** @internal */
export interface IOveralLeakInfo extends Partial<IOveralHeapInfo> {
  leakedSize: number;
  leakedFiberNodeSize: number;
  leakedAlternateFiberNodeSize: number;
}

/** @internal */
export interface IMemoryAnalystOptions {
  snapshotDir?: string;
  minSnapshots?: number;
}

/** @internal */
export interface IMemoryAnalystSnapshotDiff {
  leakedHeapNodeIdSet: HeapNodeIdSet;
  snapshot: IHeapSnapshot;
  listOfLeakedHeapNodeIdSet: Array<HeapNodeIdSet>;
}

/** @internal */
export interface IMemoryAnalystHeapNodeLeakSummary
  extends Pick<IHeapNode, 'name' | 'type' | 'retainedSize'> {
  count: number;
}

/** @internal */
export interface IMemoryAnalystHeapNodeReferrenceStat {
  numberOfEdgesToNode: number;
  source: IHeapNode;
  edge: IHeapEdge;
}

/** @internal */
export interface IClusterStrategy {
  diffTraces: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    newLeakTraces: LeakTrace[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    existingLeakTraces: LeakTrace[],
  ) => TraceDiff;
}

/** @internal */
export type ErrorWithMessage = Pick<Error, 'message'>;