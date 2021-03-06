;(function () {
  'use strict'

  angular.module('arkclient.services')
    .service('storageService', [StorageService])

  /**
   * StorageService
   *
   * The storage service is responsible for storing/retrieving persistant values within the application, typically related to the network context.
   *
   * The service itself will not save any data until a 10s timer has passed.
   *
   * @constructor
   */
  function StorageService () {
    let storage = {}
    let context = window.localStorage.getItem('context')
    if (!context) {
      context = 'techshop'
      window.localStorage.setItem('context', context)
    } else {
      switchContext(context)
    }

    /**
     * Retrieves the current network context
     */
    function getContext () {
      return context
    }

    /**
     * Switches the network context.
     *
     * @param {string} contextname
     *
     * @return {string} The supplied context.
     */
    function switchContext (contextname) {
      const temp = window.localStorage.getItem('storage-' + contextname)
      saveState()
      context = contextname
      window.localStorage.setItem('context', context)
      if (!temp) {
        storage = {}
      } else {
        storage = JSON.parse(temp)
      }
      saveState()
      return context
    }

    /**
     * Retrieve the value for the supplied key name, from the given context.
     *
     * @param {string} key - The key name to retrieve.
     * @return {any} The stored value.
     */
    function get (key) {
      return storage[key]
    }

    /**
     * Retrieve the value for the supplied global key name.
     *
     * @param {string} key - The key name to retrieve.
     * @return {any} The stored value.
     */
    function getGlobal (key) {
      return JSON.parse(window.localStorage.getItem('global-' + key))
    }

    /**
     * Stores the key/value for persistant storage. Will save the data every 10s by default.
     *
     * @param {string} key - The key to set.
     * @param {any} value - The value to store.
     * @param {boolean} forceSave - (optional) Override the default save interval, and save immediately.
     * @return {any} The value supplied.
     */
    function set (key, value, forcesave) {
      if (!value) {
        delete storage[key]
      } else {
        storage[key] = value
      }
      if (forcesave) {
        saveState()
      }
      return value
    }

    /**
     * Saves a global value, if supplied, otherwise removes the global value.
     * @param {string} key - The key that is associated to the stored value.
     * @param {any} value - The value to be stored.
     * @return {any} The supplied value.
     */
    function setGlobal (key, value) {
      if (!value) {
        window.localStorage.removeItem('global-' + key)
      } else {
        window.localStorage.setItem('global-' + key, JSON.stringify(value))
      }
      return value
    }

    /**
     * Saves the current storage context state, and updates the lastsaved timestamp.
     */
    function saveState () {
      window.localStorage.setItem('storage-' + context, JSON.stringify(storage))
      window.localStorage.setItem('lastsaved', JSON.stringify(new Date()))
    }

    function deleteState () {
      storage = {}
      window.localStorage.removeItem('storage-' + context)
    }

    /**
     * Will empty all keys/values from storage
     */
    function clearData () {
      storage = {}
      window.localStorage.clear()
    }

    /**
     * Interval to save the current app data state, every 10s.
     */
    setInterval(() => saveState(), 10000)

    return {
      switchContext,
      getContext,
      clearData,
      get,
      set,
      getGlobal,
      setGlobal,
      saveState,
      deleteState
    }
  }
})()
