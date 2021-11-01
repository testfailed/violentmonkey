/* eslint-disable no-unused-vars */

/**
 * This file is used by both `injected` and `injected-web` entries.
 * `global` is used instead of WebPack's polyfill which we disable in webpack.conf.js.
 * `export` is stripped in the final output and is only used for our NodeJS test scripts.
 */

const global = (function _() {
  return this || globalThis; // eslint-disable-line no-undef
}());
/** These two are unforgeable so we extract them primarily to improve minification.
 * The document's value can change only in about:blank but we don't inject there. */
const { document, window } = global;
export const PROTO = 'prototype';
export const IS_TOP = window.top === window;
export const WINDOW_CLOSE = 'window.close';
export const WINDOW_FOCUS = 'window.focus';
export const NS_HTML = 'http://www.w3.org/1999/xhtml';
export const CALLBACK_ID = '__CBID';

export const getOwnProp = (obj, key) => (
  obj::hasOwnProperty(key)
    ? obj[key]
    : undefined
);

/** Workaround for array eavesdropping via prototype setters like '0','1',...
 * on `push` and `arr[i] = 123`, as well as via getters if you read beyond
 * its length or from an unassigned `hole`. */
export const setOwnProp = (obj, key, value) => (
  defineProperty(obj, key, {
    value,
    configurable: true,
    enumerable: true,
    writable: true,
  })
);

export const vmOwnFuncToString = () => '[Violentmonkey property]';

/** Using __proto__ because Object.create(null) may be spoofed */
export const createNullObj = () => ({ __proto__: null });

export const promiseResolve = () => (async () => {})();

export const vmOwnFunc = (func, toString) => (
  defineProperty(func, 'toString', { value: toString || vmOwnFuncToString })
);

/** @param {Window} wnd */
export const isSameOriginWindow = wnd => (
  describeProperty(wnd.location, 'href').get
);

// Avoiding the need to safe-guard a bunch of methods so we use just one
export const getUniqIdSafe = (prefix = 'VM') => `${prefix}${mathRandom()}`;

/** args is [tags?, ...rest] */
export const log = (level, ...args) => {
  let s = '[Violentmonkey]';
  if (args[0]) args[0]::forEach(tag => { s += `[${tag}]`; });
  args[0] = s;
  logging[level]::apply(logging, args);
};

/**
 * Picks into `this`
 * @param {Object} obj
 * @param {string[]} keys
 * @returns {Object} same object as `this`
 */
export function pickIntoThis(obj, keys) {
  if (obj) {
    keys::forEach(key => {
      if (obj::hasOwnProperty(key)) {
        this[key] = obj[key];
      }
    });
  }
  return this;
}