(function(GLOBAL, undefined, define) {
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

	var _import = __webpack_require__(2);

	var mod0 = _interopRequireWildcard(_import);

	var _import2 = __webpack_require__(3);

	var mod1 = _interopRequireWildcard(_import2);

	var _import3 = __webpack_require__(4);

	var mod2 = _interopRequireWildcard(_import3);

	var _import4 = __webpack_require__(5);

	var mod3 = _interopRequireWildcard(_import4);

	var _import5 = __webpack_require__(6);

	var mod4 = _interopRequireWildcard(_import5);

	var _import6 = __webpack_require__(12);

	var mod5 = _interopRequireWildcard(_import6);

	var _import7 = __webpack_require__(7);

	var mod6 = _interopRequireWildcard(_import7);

	var _import8 = __webpack_require__(8);

	var mod7 = _interopRequireWildcard(_import8);

	var _import9 = __webpack_require__(9);

	var mod8 = _interopRequireWildcard(_import9);

	var _import10 = __webpack_require__(10);

	var mod9 = _interopRequireWildcard(_import10);

	var _import11 = __webpack_require__(13);

	var mod10 = _interopRequireWildcard(_import11);

	var _import12 = __webpack_require__(11);

	var mod11 = _interopRequireWildcard(_import12);

	var _import13 = __webpack_require__(1);

	var mod12 = _interopRequireWildcard(_import13);

	wrm.defineModule("wrm/comp/ViewComponentService", mod0);

	wrm.defineModule("wrm/comp/DetailsService", mod1);

	wrm.defineModule("wrm/comp/ListService", mod2);

	wrm.defineModule("wrm/comp/MessageService", mod3);

	wrm.defineModule("wrm/comp/FormService", mod4);

	wrm.defineModule("wrm/comp/SelectorService", mod5);

	wrm.defineModule("wrm/comp/SwitchService", mod6);

	wrm.defineModule("wrm/comp/CreateService", mod7);

	wrm.defineModule("wrm/comp/DeleteService", mod8);

	wrm.defineModule("wrm/comp/UpdateService", mod9);

	wrm.defineModule("wrm/comp/BarcodeOperationService", mod10);

	wrm.defineModule("wrm/comp/RestfulRequestResponseService", mod11);

	wrm.defineModule("testLocaleComponent/ChangeLocaleService", mod12);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for ChangeLocale operations.
	 */
	exports.default = wrm.defineService(wrm.core.AbstractOperationService, {

	    initialize: function (descr) {},

	    executeOperation: function (context) {
	        var input = context.getInput();
	        var locale = this._computeLocale(input);

	        return this.getManager().getPlatform().overrideLocale(locale).then(function () {
	            return new wrm.nav.Output("success");
	        });
	    },

	    _computeLocale: function (input) {
	        var locale = "";
	        if (!input["languageISO"]) {
	            return locale;
	        }
	        locale = locale.concat(input["languageISO"]);
	        if (input["countryISO"]) {
	            locale = locale.concat("_").concat(input["countryISO"]);
	        }
	        return locale;
	    } });
	module.exports = exports.default;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for View Component view components.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractCachedViewComponentService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractCachedViewComponentService, {

	    /** @override */
	    createResult: function (context) {
	        return {};
	    }

	});
	module.exports = exports.default;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for Details view components.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractCachedViewComponentService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractCachedViewComponentService, {

	    /** @override */
	    initialize: function (descr) {
	        var thisService = this;

	        /**
	         * @private
	         * @type {!string}
	         */
	        this._entityId = descr["entity"];

	        /**
	         * @private
	         * @type {!Object}
	         */
	        this._output; // init'd below

	        /**
	         * @private
	         * @type {!Object}
	         */
	        this._toBind; // init'd below

	        // TODO cache query instead
	        /**
	         * @private
	         * @type {!Object}
	         */
	        this._condExpr; // init'd below

	        /**
	         * @private
	         * @type {!wrm.data.DataService}
	         */
	        this._dataService; // init'd below

	        return this.getManager().getDataService().then(function (dataService) {
	            thisService._dataService = dataService;
	            thisService._condExpr = descr["condExprs"];
	            var output = descr["output"];
	            thisService._output = {};
	            thisService._toBind = {};
	            if (output.length !== 0) {
	                output.forEach(function (column) {
	                    thisService._output[column["viewName"]] = column["ref"];
	                    thisService._toBind[column["viewName"]] = column["bindName"];
	                });
	            }
	        });
	    },

	    /** @override */
	    createResult: function (context) {
	        var thisService = this;
	        var input = context.getInput();

	        var resultsPromise = this._dataService.execute(function (d) {
	            var options = {
	                output: thisService._output,
	                outputConfig: {
	                    useNames: true
	                },
	                filter: thisService._condExpr
	            };
	            return d.selectOne(thisService._entityId, options, input);
	        });

	        return resultsPromise.then(function (row) {
	            return {
	                "data": row
	            };
	        }, function (e) {
	            thisService.getLog().error(e);
	        });
	    },

	    /** @override */
	    isStaleResult: function (context, result) {
	        return !result["data"];
	    },

	    /** @override */
	    computeOutputFromResult: function (context, result) {
	        return this._createOutput(result["data"]);
	    },

	    /** @override */
	    submitView: function (context) {
	        return this._createOutput(context.getView()["data"]);
	    },

	    /**
	     * @private
	     * @param {!Object} data
	     * @returns {!Object}
	     */
	    _createOutput: function (data) {
	        var output = {};
	        if (data === null) {
	            output["dataSize"] = 0;
	        } else {
	            var toBind = this._toBind;
	            var outputData = {};
	            Object.keys(this._output).forEach(function (key) {
	                outputData[toBind[key]] = data[key];
	            });
	            output["data"] = outputData;
	            output["dataSize"] = 1;
	        }
	        return output;
	    } });
	module.exports = exports.default;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for List view components.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractCachedViewComponentService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractCachedViewComponentService, {

	    /** @override */
	    initialize: function (descr) {
	        var thisService = this;

	        /**
	         * @private
	         * @type {!wrm.data.meta.Entity}
	         */
	        this._entity; // init'd below

	        // TODO cache query instead
	        /**
	         * @private
	         * @type {!Object}
	         */
	        this._condExpr; // init'd below

	        /**
	         * @private
	         * @type {!boolean}
	         */
	        this._checkable = descr["checkable"] || false;

	        /**
	         * @private
	         * @type {boolean}
	         */
	        this._hasPreCondExpr = descr["preCondExprs"] !== undefined ? true : false;

	        // TODO cache query instead
	        /**
	         * @private
	         * @type {!Object}
	         */
	        this._preCondExpr; // init'd below

	        /**
	         * @private
	         * @type {!number}
	         */
	        this._maxResults = descr["maxResults"];

	        /**
	         * @private
	         * @type {!boolean}
	         */
	        this._distinct = descr["distinct"] || false;

	        /**
	         * @private
	         * @type {!Object}
	         */
	        this._output; // init'd below

	        /**
	         * @private
	         * @type {!Object}
	         */
	        this._toBind; // init'd below

	        /**
	         * @private
	         * @type {!Array}
	         */
	        this._order = descr["order"];

	        /**
	         * @private
	         * @type {!wrm.data.DataService}
	         */
	        this._dataService; // init'd below

	        return this.getManager().getDataService().then(function (dataService) {
	            thisService._dataService = dataService;
	            thisService._entity = dataService.getMetadata().getEntity(descr["entity"]);
	            thisService._condExpr = descr["condExprs"];
	            var keyAttr = thisService._entity.getKeyAttribute();
	            var output = descr["output"];
	            thisService._output = {};
	            thisService._toBind = {};
	            if (output.length !== 0) {
	                output.forEach(function (column) {
	                    thisService._output[column["viewName"]] = column["ref"];
	                    thisService._toBind[column["viewName"]] = column["bindName"];
	                });
	            }
	            if (!thisService._distinct) {
	                thisService._output["__key"] = keyAttr.getId(); // for row tracking
	            }

	            if (thisService._checkable) {
	                thisService._output[keyAttr.getName()] = keyAttr.getId();
	                thisService._toBind[keyAttr.getName()] = keyAttr.getId();
	                thisService._preCondExpr = descr["preCondExprs"];
	            }
	        });
	    },

	    /** @override */
	    createResult: function (context) {
	        var thisService = this;
	        var input = context.getInput();

	        var options = {
	            output: this._output,
	            outputConfig: {
	                useNames: true
	            },
	            distinct: this._distinct,
	            filter: this._condExpr,
	            order: this._order
	        };
	        var resultsLength = input["maxResults"] || thisService._maxResults;
	        if (resultsLength > 0) {
	            var limit = {
	                count: resultsLength
	            };
	            options["limit"] = limit;
	        }

	        var promises = [];

	        promises.push(this._retrieveData(input, options));
	        if (this._checkable) {
	            var keyAttributeId = this._entity.getKeyAttribute().getId();
	            if (!this._refreshCheckedObjects(context)) {
	                var checkedObj = [];
	                var checkedRows = context.getView()["checkedRows"];
	                Object.keys(checkedRows).forEach(function (rowKey) {
	                    if (checkedRows[rowKey]) {
	                        checkedObj.push(rowKey);
	                    }
	                });
	                promises.push(checkedObj);
	            } else if (this._hasPreCondExpr) {
	                var preCheckOptions = {
	                    output: keyAttributeId,
	                    outputConfig: {
	                        useNames: true
	                    },
	                    filter: this._preCondExpr
	                };
	                promises.push(this._retrieveData(input, preCheckOptions));
	            }
	        }

	        return Promise.all(promises).then(function (results) {
	            var dataRows = results[0];
	            var preChecked = results[1] || [];
	            var checkedRows = {};

	            thisService._markDataRows(dataRows, context);
	            if (thisService._checkable) {
	                preChecked.forEach(function (objKey) {
	                    checkedRows[objKey] = true;
	                });
	            }

	            return {
	                "data": dataRows,
	                "checkedRows": checkedRows
	            };
	        }, function (e) {
	            thisService.getLog().error(e);
	        });
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @param {!Object=} options
	     * @return {!Promise<!Array<!Object>>}
	     */
	    _retrieveData: function (input, options) {
	        var thisService = this;
	        return this._dataService.execute(function (d) {
	            return d.select(thisService._entity.getId(), options, input);
	        });
	    },

	    /**
	     * @private
	     * @param {!Array<!Object>} rows
	     * @param {!wrm.core.ViewComponentContext} context
	     */
	    _markDataRows: function (rows, context) {
	        if (!this._distinct) {
	            rows.forEach(function (row) {
	                context.markForViewTracking(row, row["__key"]);
	                delete row["__key"];
	            }, this);
	        } else {
	            rows.forEach(function (row, index) {
	                context.markForViewTracking(row, index);
	            }, this);
	        }
	    },

	    /** @override */
	    isStaleResult: function (context, result) {
	        return !result["data"] || result["data"].length === 0;
	    },

	    /** @override */
	    catchEvent: function (context, event) {
	        var rowIndex = event.getParameters()["position"];
	        var view = context.getView();
	        view["current"] = rowIndex;
	    },

	    /** @override */
	    computeOutputFromResult: function (context, result) {
	        return this._createOutput(result);
	    },

	    /** @override */
	    submitView: function (context) {
	        var view = context.getView();
	        return this._createOutput(view);
	    },

	    /**
	     * @param {!Object} view
	     * @return {!Object}
	     */
	    _createOutput: function (view) {
	        var output = {};
	        var data = view["data"];
	        var current = view["current"] || 0;
	        var dataSize = data.length;
	        if (dataSize > 0) {
	            if (current === dataSize) {
	                current--;
	            }
	            if (this._checkable) {
	                output["checkedKeys"] = [];
	                var checkedRows = view["checkedRows"];
	                Object.keys(checkedRows).forEach(function (row) {
	                    if (checkedRows[row] == true) {
	                        output["checkedKeys"].push(row);
	                    }
	                });
	            }

	            var toBind = this._toBind;
	            var currentRow = data[current];
	            var outputData = {};
	            Object.keys(this._output).forEach(function (key) {
	                outputData[toBind[key]] = currentRow[key];
	            });

	            output["data"] = outputData;
	        }
	        output["dataSize"] = dataSize;
	        return output;
	    },

	    /**
	     * @private
	     * @param {!wrm.core.ViewComponentContext} context
	     * @return {boolean}
	     */
	    _refreshCheckedObjects: function (context) {
	        var RefreshMode = wrm.core.RefreshMode;
	        var refreshMode = context.getFormRefreshMode();
	        if (refreshMode === RefreshMode.PRESERVE) {
	            return false;
	        } else {
	            return true;
	        }
	    } });
	module.exports = exports.default;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for Message view components.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractCachedViewComponentService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractCachedViewComponentService, {

	    /** @override */
	    initialize: function (descr) {

	        /**
	         * @private
	         * @type {?string}
	         */
	        this._defaultMessage = descr["defaultMessage"] || null;

	        /**
	         * @private
	         * @type {?Array}
	         */
	        this._placeholders = descr["placeholders"];
	    },

	    /** @override */
	    createResult: function (context) {
	        var input = context.getInput();

	        /* Get messages from input, or use the default one */
	        var messages = input["messages"];
	        if (messages === undefined) {
	            messages = this._defaultMessage;
	        }

	        /* Get placeholders values and replace in messages */
	        var placeholder = {};
	        for (placeholder in this._placeholders) {
	            var value = "";
	            placeholder = this._placeholders[placeholder];
	            if (input[placeholder["name"]] !== undefined) {
	                value = input[placeholder["name"]];
	            }
	            var exp = new RegExp("\\$\\$" + placeholder["label"] + "\\$\\$", "g");
	            if (angular.isArray(messages)) {
	                var message = null;
	                for (message in messages) {
	                    messages[message] = messages[message].replace(exp, value);
	                }
	            } else {
	                messages = messages.replace(exp, value);
	            }
	        }

	        return {
	            "messages": wrm.data.toStringArray(messages)
	        };
	    } });
	module.exports = exports.default;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var RefreshMode = wrm.core.RefreshMode;

	/**
	 * Service for Form view components.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractViewComponentService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractViewComponentService, {

	    /** @override */
	    initialize: function (descr) {

	        /**
	         * @private
	         * @type {!Array.<Object>}
	         */
	        this._fields = descr["fields"];
	    },

	    /** @override */
	    computeOutput: function (context) {
	        var thisService = this;
	        var refreshMode = context.getFormRefreshMode();
	        var output = {};

	        var view = context.getView();

	        view["form"] = view["form"] || {};
	        view["options"] = view["options"] || {};
	        view["fields"] = view["fields"] || {};
	        view["sFields"] = view["sFields"] || {};

	        this._fields.forEach(function (field) {
	            var fieldId = field["id"];
	            var type = wrm.util.obj.getEnumName(wrm.data.Type, field["type"]);
	            switch (field["fieldType"]) {
	                case "Field":
	                    var simpleField = {};
	                    if (refreshMode === RefreshMode.PRESERVE) {
	                        simpleField = view["form"][fieldId];
	                    } else {
	                        simpleField = thisService._computeFieldValue(context, field, refreshMode, wrm.data.Type[type]);
	                    }
	                    view["fields"][fieldId] = simpleField;
	                    output[fieldId] = simpleField;
	                    break;
	                case "SelectionField":
	                    var sField = {};
	                    var sFieldLabels = [];
	                    var sFieldOutputs = [];
	                    var options = [];
	                    var preselection;
	                    if (refreshMode === RefreshMode.PRESERVE) {
	                        sFieldLabels = view["sFields"][fieldId][Tags.LABEL.SUFFIX];
	                        sFieldOutputs = view["sFields"][fieldId][Tags.OUTPUT.SUFFIX];
	                        options = view["options"][fieldId];
	                        preselection = view["form"][fieldId] ? view["form"][fieldId]["value"] : "";
	                    } else {
	                        var hasFreshOptionsInputs = thisService._hasFreshOptionsInputs(context, field);
	                        sFieldLabels = thisService._computeSelectionFieldLabels(context, field, refreshMode, hasFreshOptionsInputs);
	                        sFieldOutputs = thisService._computeSelectionFieldOutputs(context, field, refreshMode, hasFreshOptionsInputs);
	                        options = thisService._computeSelectionFieldOptions(context, field, refreshMode, hasFreshOptionsInputs, sFieldLabels, sFieldOutputs);
	                        preselection = thisService._computeSelectionFieldPreselection(context, field, refreshMode);
	                    }
	                    sField[Tags.LABEL.SUFFIX] = sFieldLabels;
	                    sField[Tags.OUTPUT.SUFFIX] = sFieldOutputs;
	                    sField[Tags.PRESEL.SUFFIX] = preselection;
	                    view["sFields"][fieldId] = sField;

	                    var toBeOutput = undefined;
	                    if (preselection !== undefined) {
	                        var preselectionIndex = thisService._retrievePreselectionIndex(field, options, preselection);
	                        if (preselectionIndex >= 0) {
	                            toBeOutput = options[preselectionIndex]["value"];
	                        }
	                    }
	                    if (toBeOutput === undefined) {
	                        break;
	                    }

	                    if (!field[Tags.SPLITOUTPUT.LABEL]) {
	                        output[fieldId] = wrm.data.toSingle(wrm.data.Type[type], toBeOutput);
	                    } else if (toBeOutput !== undefined) {
	                        toBeOutput.forEach(function (value) {
	                            Object.keys(value).forEach(function (name) {

	                                /* by construction this object always has only one key */
	                                /* If there is only one slot it's possible to convert the type */
	                                if (toBeOutput.length === 1) {
	                                    output[name] = wrm.data.toSingle(wrm.data.Type[type], value[name]);
	                                } else {
	                                    output[name] = value[name];
	                                }
	                            });
	                        });
	                    }
	                    break;
	            }
	        });
	        return this._normalizeMissingOutputs(output);
	    },

	    /** @override */
	    updateView: function (context) {
	        var thisService = this;
	        var view = context.getView();
	        var refreshMode = context.getFormRefreshMode();

	        view["form"] = view["form"] || {};
	        view["options"] = view["options"] || {};
	        view["fields"] = view["fields"] || {};
	        view["sFields"] = view["sFields"] || {};

	        this._fields.forEach(function (field) {
	            var fieldId = field["id"];
	            var type = wrm.util.obj.getEnumName(wrm.data.Type, field["type"]);
	            switch (field["fieldType"]) {
	                case "Field":
	                    var simpleField = {};
	                    if (refreshMode === RefreshMode.PRESERVE) {
	                        simpleField = view["form"][fieldId];
	                    } else {
	                        simpleField = thisService._computeFieldValue(context, field, refreshMode, wrm.data.Type[type]);
	                    }
	                    view["fields"][fieldId] = simpleField;
	                    view["form"][fieldId] = simpleField;
	                    break;
	                case "SelectionField":
	                    var sField = {};
	                    var sFieldLabels = [];
	                    var sFieldOutputs = [];
	                    var options = [];
	                    var preselection;
	                    if (refreshMode === RefreshMode.PRESERVE) {
	                        sFieldLabels = view["sFields"][fieldId][Tags.LABEL.SUFFIX];
	                        sFieldOutputs = view["sFields"][fieldId][Tags.OUTPUT.SUFFIX];
	                        options = view["options"][fieldId];
	                        preselection = view["form"][fieldId] ? view["form"][fieldId]["value"] : "";
	                    } else {
	                        var hasFreshOptionsInputs = thisService._hasFreshOptionsInputs(context, field);
	                        sFieldLabels = thisService._computeSelectionFieldLabels(context, field, refreshMode, hasFreshOptionsInputs);
	                        sFieldOutputs = thisService._computeSelectionFieldOutputs(context, field, refreshMode, hasFreshOptionsInputs);
	                        options = thisService._computeSelectionFieldOptions(context, field, refreshMode, hasFreshOptionsInputs, sFieldLabels, sFieldOutputs);
	                        preselection = thisService._computeSelectionFieldPreselection(context, field, refreshMode);
	                    }

	                    sField[Tags.LABEL.SUFFIX] = sFieldLabels;
	                    sField[Tags.OUTPUT.SUFFIX] = sFieldOutputs;
	                    sField[Tags.PRESEL.SUFFIX] = preselection;
	                    view["sFields"][fieldId] = sField;

	                    if (preselection !== undefined) {
	                        var preselectionIndex = thisService._retrievePreselectionIndex(field, options, preselection);
	                        if (preselectionIndex >= 0) {
	                            view["form"][fieldId] = options[preselectionIndex];
	                        } else {
	                            view["form"][fieldId] = undefined;
	                        }
	                    }
	                    view["options"][fieldId] = options;
	                    break;
	            }
	        });
	        return view;
	    },

	    /** @override */
	    submitView: function (context) {
	        var output = {};
	        var form = context.getView()["form"] || {};
	        this._fields.forEach(function (field) {
	            var fieldId = field["id"];
	            var type = wrm.util.obj.getEnumName(wrm.data.Type, field["type"]);
	            switch (field["fieldType"]) {
	                case "Field":
	                    output[fieldId] = form[fieldId] !== "" ? wrm.data.toSingle(wrm.data.Type[type], form[fieldId]) : undefined;
	                    break;
	                case "SelectionField":
	                    if (!field[Tags.SPLITOUTPUT.LABEL]) {
	                        output[fieldId] = form[fieldId] ? wrm.data.toSingle(wrm.data.Type[type], form[fieldId].value) : undefined;
	                    } else {
	                        if (form[fieldId] !== undefined && form[fieldId] !== null) {
	                            form[fieldId]["value"].forEach(function (value) {
	                                Object.keys(value).forEach(function (name) {

	                                    /* by construction this object always has only one key */
	                                    /* If there is only one slot it's possible to convert the type */
	                                    if (form[fieldId]["value"].length === 1) {
	                                        output[name] = wrm.data.toSingle(wrm.data.Type[type], value[name]);
	                                    } else {
	                                        output[name] = value[name];
	                                    }
	                                });
	                            });
	                        } else {
	                            field[Tags.OUTPUT.SLOT].forEach(function (slotDescr) {
	                                output[slotDescr["id"]] = undefined;
	                            });
	                        }
	                    }
	                    break;
	            }
	        });
	        return this._normalizeMissingOutputs(output);
	    },

	    /**
	     * @private
	     * @param {!wrm.core.ViewComponentContext} context
	     * @param {!Object} field
	     * @param {!wrm.core.RefreshMode} refreshMode
	     * @param {!wrm.data.Type} type
	     * @return {*|undefined}
	     */
	    _computeFieldValue: function (context, field, refreshMode, type) {
	        var fieldId = field["id"];
	        if (RefreshMode.REFRESH === refreshMode && !context.isFreshInput(fieldId + Tags.PRELOAD.SUFFIX)) {
	            return context.getView()["form"][fieldId];
	        }
	        var input = context.getInput();
	        var preloadedValue = input[fieldId + Tags.PRELOAD.SUFFIX];
	        if (preloadedValue === undefined) {
	            field[Tags.LABEL.SLOT].forEach(function (slot) {
	                var val = input[slot["id"]] || slot["value"];
	                if (preloadedValue === undefined) {
	                    preloadedValue = val;
	                } else {
	                    preloadedValue += " " + val;
	                }
	            });
	        }
	        return wrm.data.toSingle(type, preloadedValue);
	    },

	    /**
	     * @private
	     * @param {!wrm.core.ViewComponentContext} context
	     * @param {!Object} field
	     * @param {!wrm.core.RefreshMode} refreshMode
	     * @param {boolean} hasFreshOptionsInputs
	     * @return {!Array.<string>}
	     */
	    _computeSelectionFieldLabels: function (context, field, refreshMode, hasFreshOptionsInputs) {
	        return this._computeSelectionFieldSlot(Tags.LABEL, context, field, refreshMode, hasFreshOptionsInputs);
	    },

	    /**
	     * @private
	     * @param {!wrm.core.ViewComponentContext} context
	     * @param {!Object} field
	     * @param {!wrm.core.RefreshMode} refreshMode
	     * @param {boolean} hasFreshOptionsInputs
	     * @return {!Array.<string|!Object>}
	     */
	    _computeSelectionFieldOutputs: function (context, field, refreshMode, hasFreshOptionsInputs) {
	        return this._computeSelectionFieldSlot(Tags.OUTPUT, context, field, refreshMode, hasFreshOptionsInputs);
	    },

	    /**
	     * @private
	     * @param {!Object} slot
	     * @param {!wrm.core.ViewComponentContext} context
	     * @param {!Object} field
	     * @param {!wrm.core.RefreshMode} refreshMode
	     * @param {boolean} hasFreshOptionsInputs
	     * @return {!Array.<string|!Object>}
	     */
	    _computeSelectionFieldSlot: function (slot, context, field, refreshMode, hasFreshOptionsInputs) {
	        var fieldId = field["id"];
	        if (RefreshMode.REFRESH === refreshMode && !hasFreshOptionsInputs) {
	            return context.getView()["sFields"][fieldId] ? context.getView()["sFields"][fieldId][slot.SUFFIX] : undefined;
	        }
	        var result = [];
	        var input = context.getInput();
	        var inputValues = input[fieldId + slot.SUFFIX];
	        if (inputValues !== undefined) {
	            // if there are no slots
	            inputValues = wrm.data.toAnyArray(inputValues);
	            return this._normalizeInput(inputValues);
	        } else {
	            // if there are slots
	            var thisService = this;
	            var tmpResult = [];

	            /* take all values for labels (both labels and output) from input or from descriptor */
	            field[slot.SLOT].forEach(function (slot) {
	                var slotId = slot["id"];
	                var inputSlotValues = input[slotId] || slot["value"];
	                if (inputSlotValues) {
	                    inputSlotValues = wrm.data.toAnyArray(inputSlotValues);
	                }
	                tmpResult.push(thisService._normalizeInput(inputSlotValues));
	            });
	            var tmpSize = tmpResult.length;
	            var maxSize = this._maxSize(tmpResult);
	            var i = 0;
	            var j = 0;
	            var concatString;
	            if (!field[Tags.SPLITOUTPUT.LABEL] || slot.SLOT === Tags.LABEL.SLOT) {
	                /* make join for label values, if sizes are different it uses empty string */
	                for (i = 0; i < maxSize; i++) {
	                    concatString = "";
	                    for (j = 0; j < tmpSize; j++) {
	                        if (tmpResult[j].length === 1) {
	                            concatString += tmpResult[j][0];
	                        } else {
	                            concatString += tmpResult[j][i] || "";
	                        }
	                    }
	                    result.push(concatString);
	                }
	            } else {
	                var outputObj;
	                // keep output separated, if sizes are different it uses empty string
	                for (i = 0; i < maxSize; i++) {
	                    outputObj = [];
	                    for (j = 0; j < tmpSize; j++) {
	                        var slotobj = {};
	                        slotobj[field[Tags.OUTPUT.SLOT][j]["id"]] = tmpResult[j][i] || "";
	                        outputObj.push(slotobj);
	                    }
	                    result.push(outputObj);
	                }
	            }
	        }
	        return result;
	    },

	    /**
	     * @private
	     * @param {!wrm.core.ViewComponentContext} context
	     * @param {!Object} field
	     * @param {!wrm.core.RefreshMode} refreshMode
	     * @param {boolean} hasFreshOptionsInputs
	     * @param {!Array.<string>} labels
	     * @param {!Array.<string>} outputs
	     * @return {!Array.<!Object>}
	     */
	    _computeSelectionFieldOptions: function (context, field, refreshMode, hasFreshOptionsInputs, labels, outputs) {
	        var fieldId = field["id"];
	        if (RefreshMode.REFRESH === refreshMode && !hasFreshOptionsInputs) {
	            return context.getView()["options"][fieldId];
	        }
	        var options = [];
	        var i = 0;

	        if (labels.length > outputs.length) {
	            for (i = 0; i < labels.length; i++) {
	                var option = {};
	                option["label"] = labels[i];
	                option["value"] = outputs[i] || "";
	                options.push(option);
	            }
	        } else {
	            for (i = 0; i < outputs.length; i++) {
	                var option = {};
	                option["value"] = outputs[i];
	                option["label"] = labels[i] || "";
	                options.push(option);
	            }
	        }

	        return options;
	    },

	    /**
	     * @private
	     * @param {!wrm.core.ViewComponentContext} context
	     * @param {!Object} field
	     * @return {string|!Object}
	     */
	    _computeSelectionFieldPreselection: function (context, field, refreshMode) {
	        var fieldId = field["id"];

	        if (RefreshMode.REFRESH === refreshMode && !this._hasFreshPreselInputs(context, field)) {
	            return context.getView()["form"][fieldId] ? context.getView()["form"][fieldId]["value"] : undefined;
	        }

	        var input = context.getInput();

	        if (!field[Tags.SPLITOUTPUT.LABEL]) {
	            // splitOutput == false means that value property of option object is
	            // exactly what I'm looking for
	            return input[fieldId + Tags.PRESEL.SUFFIX] || field["preselectValue"];
	        } else {
	            // splitOutput == true means that value property of option object is an object
	            var preselectValue = field["preselectValue"].split("|");
	            var preselection = {};
	            field[Tags.OUTPUT.SLOT].forEach(function (slot, index) {
	                preselection[slot["id"]] = input[slot["id"] + Tags.PRESEL.SUFFIX] || preselectValue[index];
	            });
	            return preselection;
	        }
	    },

	    /**
	     * @private
	     * @param {!Object} field
	     * @param {!Object} options
	     * @param {string|!Object} preSelection
	     * @return {number}
	     */
	    _retrievePreselectionIndex: function (field, options, preSelection) {
	        var thisService = this;
	        var found = false;
	        var index = 0;
	        var foundIndex = 0;
	        var currentOption;

	        if (Array.isArray(preSelection)) {
	            var presel = {};
	            preSelection.forEach(function (obj) {
	                Object.keys(obj).forEach(function (key) {
	                    presel[key] = obj[key];
	                });
	            });
	            preSelection = presel;
	        }

	        for (index = 0; index < options.length; index++) {
	            currentOption = options[index]["value"];
	            if (!field[Tags.SPLITOUTPUT.LABEL]) {
	                if (wrm.data.equal(currentOption, preSelection)) {
	                    found = true;
	                    foundIndex = index;
	                    break;
	                }
	            } else {
	                currentOption = thisService._normalizeOptions(currentOption);
	                Object.keys(currentOption).forEach(function (slotId) {
	                    if (!preSelection[slotId]) {
	                        found = false;
	                        return;
	                    } else {
	                        if (wrm.data.equal(currentOption[slotId], preSelection[slotId])) {
	                            found = true;
	                            foundIndex = index;
	                            return;
	                        }
	                    }
	                });
	            }
	        }
	        if (!found) {
	            return -1;
	        }
	        return foundIndex;
	    },

	    /**
	     * @private
	     * @param {!Array.<!Object>} arrayValues
	     * @returns {!Object}
	     */
	    _normalizeOptions: function (arrayValues) {
	        var result = {};
	        arrayValues.forEach(function (option) {
	            Object.keys(option).forEach(function (key) {
	                result[key] = option[key];
	            });
	        });
	        return result;
	    },

	    /**
	     * @private
	     * @param {!wrm.core.ViewComponentContext} context
	     * @param {!Object} field
	     * @return {boolean}
	     */
	    _hasFreshOptionsInputs: function (context, field) {
	        var formTags = Tags;

	        /* Check if input 'label' is fresh */
	        if (context.isFreshInput(field["id"]) || context.isFreshInput(field["id"] + formTags.LABEL.SUFFIX)) {
	            return true;
	        }

	        /* Check if input 'output' is fresh */
	        if (context.isFreshInput(field["id"]) || context.isFreshInput(field["id"] + formTags.OUTPUT.SUFFIX)) {
	            return true;
	        }

	        var hasFreshOptionsInputs = false;

	        /* Check if input 'label' slots are fresh */
	        field[Tags.LABEL.SLOT].forEach(function (slot) {
	            if (context.isFreshInput(slot["id"]) || context.isFreshInput(slot["id"] + formTags.LABEL.SUFFIX)) {
	                hasFreshOptionsInputs = true;
	                return;
	            }
	        });

	        /* Check if input 'output' slots are fresh */
	        field[Tags.OUTPUT.SLOT].forEach(function (slot) {
	            if (context.isFreshInput(slot["id"]) || context.isFreshInput(slot["id"] + formTags.OUTPUT.SUFFIX)) {
	                hasFreshOptionsInputs = true;
	                return;
	            }
	        });

	        return hasFreshOptionsInputs;
	    },

	    /**
	     * @private
	     * @param {!wrm.core.ViewComponentContext} context
	     * @param {!Object} field
	     * @return {boolean}
	     */
	    _hasFreshPreselInputs: function (context, field) {
	        var preselSuffix = Tags.PRESEL.SUFFIX;

	        /* Check if presel is fresh */
	        if (context.isFreshInput(field["id"] + preselSuffix)) {
	            return true;
	        }

	        var hasFreshPreselInputs = false;

	        /* Check if input 'label' slots are fresh */
	        field[Tags.LABEL.SLOT].forEach(function (slot) {
	            if (context.isFreshInput(slot["id"] + preselSuffix)) {
	                hasFreshPreselInputs = true;
	                return;
	            }
	        });

	        /* Check if input 'output' slots are fresh */
	        field[Tags.OUTPUT.SLOT].forEach(function (slot) {
	            if (context.isFreshInput(slot["id"] + preselSuffix)) {
	                hasFreshPreselInputs = true;
	                return;
	            }
	        });

	        return hasFreshPreselInputs;
	    },

	    /**
	     * @private
	     * @param {!Array.<*>} input
	     * @return {!Array.<*>}
	     */
	    _normalizeInput: function (input) {
	        if (input.length === 1) {
	            input = wrm.data.toString(input[0]).split("|");
	        }
	        return input;
	    },

	    /**
	     * @private
	     * @param {!Object} outputs
	     * @return {!Object}
	     */
	    _normalizeMissingOutputs: function (outputs) {
	        for (var key in outputs) {
	            if (!outputs.hasOwnProperty(key)) {
	                continue;
	            }
	            if (outputs[key] === undefined) {
	                outputs[key] = null;
	            }
	        }
	        return outputs;
	    },

	    /**
	     * @private
	     * @param {Array.<Array>} inputArray
	     * @return {number}
	     */
	    _maxSize: function (inputArray) {
	        var result = 0;
	        inputArray.forEach(function (input) {
	            if (input.length > result) {
	                result = input.length;
	            }
	        });
	        return result;
	    } });

	/** @private */
	var Tags = {
	    LABEL: {
	        SLOT: "labelSlots",
	        SUFFIX: "_label"
	    },
	    OUTPUT: {
	        SLOT: "outputSlots",
	        SUFFIX: "_output"
	    },
	    SPLITOUTPUT: {
	        LABEL: "splitOutput"
	    },
	    PRESEL: {
	        SUFFIX: "_presel"
	    },
	    PRELOAD: {
	        SUFFIX: "_preload"
	    }
	};
	module.exports = exports.default;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for Switch operations.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractOperationService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractOperationService, {

	    /** @override */
	    initialize: function (descr) {

	        /** @private {?Object<string,boolean>} */
	        this._codes = null;

	        /* Map codes (if configured) */
	        if (descr["codes"].length > 0) {
	            this._codes = {};
	            descr["codes"].forEach(function (code) {
	                this._codes[code] = true;
	            }, this);
	        }
	    },

	    /** @override */
	    executeOperation: function (context) {
	        var switchValue = context.getInput()["switch"];
	        var matchingCase = this._findMatchingCase(switchValue);
	        var result = !!matchingCase ? "success." + matchingCase : "success";
	        return new wrm.nav.Output(result, {
	            "switch": switchValue
	        });
	    },

	    /**
	     * @private
	     * @param {*} switchValue
	     * @return {?string}
	     */
	    _findMatchingCase: function (switchValue) {

	        /* With no codes, perform an "is not null" check, with special support for arrays */
	        if (!this._codes) {
	            if (Array.isArray(switchValue)) {
	                if (switchValue.length <= 0 || switchValue.every(this._isEmptyValue, this)) {
	                    return "<EMPTY>";
	                }
	                return null; // default
	            }
	            if (this._isEmptyValue(switchValue)) {
	                return "<EMPTY>";
	            }
	            return null; // default
	        }

	        /* Convert to a scalar value */
	        if (Array.isArray(switchValue)) {
	            switchValue = switchValue[0];
	        }
	        switchValue = wrm.data.toString(switchValue);

	        /* Find a matching code (or empty) */
	        if (this._isEmptyValue(switchValue)) {
	            return "<EMPTY>";
	        }
	        if (this._codes[switchValue] === true) {
	            return switchValue; // a known code
	        }
	        return null; // default
	    },

	    /**
	     * @private
	     * @param {*} value
	     * @return {boolean}
	     */
	    _isEmptyValue: function (value) {
	        return value === undefined || value === null || value === "";
	    }

	});
	module.exports = exports.default;
	/** @type {string} */

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for Create operations.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractOperationService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractOperationService, {

	    /** @override */
	    initialize: function (descr) {
	        var thisService = this;

	        /**
	         * @private
	         * @type {!wrm.data.meta.Entity}
	         */
	        this._entity; // init'd below

	        /**
	         * @private
	         * @type {boolean}
	         */
	        this._bulk = descr["bulk"] || false;

	        /**
	         * @private
	         * @type {!wrm.data.DataService}
	         */
	        this._dataService; // init'd below

	        return this.getManager().getDataService().then(function (dataService) {
	            thisService._entity = dataService.getMetadata().getEntity(descr["entity"]);
	            thisService._dataService = dataService;
	        });
	    },

	    /** @override */
	    executeOperation: function (context) {
	        var input = context.getInput();

	        /* Create the creation promise */
	        var createPromise = this._executeCreate(input);

	        /* Output the created attribute values */
	        return createPromise.then(function (createdValues) {
	            return new wrm.nav.Output("success", createdValues);
	        });
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @return {!Promise.<!wrm.nav.Output>}
	     */
	    _executeCreate: function (input) {
	        var entityId = this._entity.getId();
	        var keyAttrId = this._entity.getKeyAttribute().getId();
	        var dataService = this._dataService;

	        /* Prepare new object(s) */
	        var newValues;
	        if (!this._bulk) {
	            newValues = [this._computeInsertValues(input)];
	        } else {
	            newValues = this._computeInsertValuesFromBulk(input);
	        }

	        /* Insert in database */
	        return this._dataService.execute(function (d) {
	            return d.insert(entityId, newValues);
	        }).then(function (insertedKeys) {

	            /* Add inserted keys to all new objects that were inserted */
	            for (var i = 0; i < insertedKeys.length; i++) {
	                newValues[i][keyAttrId] = insertedKeys[i];
	            }

	            return dataService.extractPropertyValuesById(newValues, entityId);
	        });
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @return {!Object}
	     */
	    _computeInsertValues: function (input) {
	        var result = {};
	        this._entity.getProperties().forEach(function (property) {
	            var propertyId = property.getId();
	            if (input[propertyId] !== undefined) {
	                result[propertyId] = input[propertyId];
	            }
	        });
	        return result;
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @return {!Array<Object>}
	     */
	    _computeInsertValuesFromBulk: function (input) {
	        var properties = this._entity.getProperties();

	        var result = [];

	        /* Normalize input values, turning them in arrays of the same length */
	        var normalizedInput = {};
	        var maxLength = 1;
	        for (var i = 0; i < properties.length; i++) {
	            var property = properties[i];
	            var propertyInput = input[property.getId()];
	            if (propertyInput !== undefined) {
	                if (angular.isArray(propertyInput)) {
	                    if (propertyInput.length !== 1) {
	                        if (maxLength === 1) {
	                            maxLength = propertyInput.length;
	                        } else if (maxLength !== propertyInput.length) {
	                            throw new Error("Lengths of input arrays differ");
	                        }
	                    }
	                } else {
	                    propertyInput = [propertyInput];
	                }
	                normalizedInput[property.getId()] = propertyInput;
	            }
	        }

	        /* Collect properties at the same indexes into separate value-holding objects */
	        for (var k = 0; k < maxLength; k++) {
	            var tmpObj = {};
	            Object.keys(normalizedInput).forEach(function (propertyId) {
	                if (normalizedInput[propertyId].length === 1) {
	                    tmpObj[propertyId] = normalizedInput[propertyId][0];
	                } else {
	                    tmpObj[propertyId] = normalizedInput[propertyId][k];
	                }
	            });
	            result.push(tmpObj);
	        }

	        return result;
	    } });
	module.exports = exports.default;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for Delete operations.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractOperationService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractOperationService, {

	    /** @override */
	    initialize: function (descr) {
	        var thisService = this;

	        /**
	         * @private
	         * @type {!string}
	         */
	        this._entityId = descr["entity"];

	        // TODO cache query instead
	        /**
	         * @private
	         * @type {!Object}
	         */
	        this._condExpr; // init'd below

	        /**
	         * @private
	         * @type {!wrm.data.DataService}
	         */
	        this._dataService; // init'd below

	        return this.getManager().getDataService().then(function (dataService) {
	            thisService._dataService = dataService;
	            thisService._condExpr = descr["condExprs"];
	        });
	    },

	    /** @override */
	    executeOperation: function (context) {
	        var thisService = this;
	        var input = context.getInput();

	        var resultsPromise = this._dataService.execute(function (d) {

	            var options = {
	                filter: thisService._condExpr
	            };

	            return d.deleteGetCount(thisService._entityId, options, input);
	        });

	        return resultsPromise.then(function (numberDeletedObj) {
	            var code = numberDeletedObj === 0 ? "success.Not Found" : "success";
	            return new wrm.nav.Output(code);
	        }, function (e) {
	            thisService.getLog().error(e);
	            return new wrm.nav.Output("error");
	        });
	    } });
	module.exports = exports.default;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for Update operations.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractOperationService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractOperationService, {

	    /** @override */
	    initialize: function (descr) {
	        var thisService = this;

	        /**
	         * @private
	         * @type {!wrm.data.meta.Entity}
	         */
	        this._entity; // init'd below

	        /**
	         * @private
	         * @type {boolean}
	         */
	        this._userServiceMode = descr["userService"] || false;

	        /**
	         * @private
	         * @type {boolean}
	         */
	        this._bulk = descr["bulk"] || false;

	        /**
	         * @private
	         * @type {!wrm.data.Condition}
	         */
	        this._condition; // init'd below

	        /**
	         * @private
	         * @type {!wrm.data.Condition}
	         */
	        this._keyCondition; // init'd below

	        /**
	         * @private
	         * @type {!wrm.data.DataService}
	         */
	        this._dataService; // init'd below

	        /** @private {!Array<string>} */
	        this._conditionInputKeys; // init'd below

	        /** @private {!Array<string>} */
	        this._updateInputKeys; // init'd below

	        return this.getManager().getDataService().then(function (dataService) {
	            thisService._entity = dataService.getMetadata().getEntity(descr["entity"]);
	            thisService._condition = dataService.prepareCondition(thisService._entity.getId(), descr["condExprs"]);
	            var keyId = thisService._entity.getKeyAttribute().getId();
	            thisService._keyCondition = dataService.prepareCondition(thisService._entity.getId(), {
	                "property": keyId,
	                "operator": "eq",
	                "valueInput": "keyId",
	                "config": {
	                    "oneImpliedInputRequired": false
	                }
	            });
	            thisService._dataService = dataService;

	            /* Compute the parameter keys expected as inputs */
	            thisService._conditionInputKeys = thisService._condition.getExplicitInputNames().slice(); // clone
	            thisService._updateInputKeys = thisService._entity.getProperties().map(function (property) {
	                return property.getId();
	            });
	        });
	    },

	    /** @override */
	    executeOperation: function (context) {
	        var input = context.getInput();

	        /* Update in a different way for User and other entities */
	        var updatePromise;
	        if (this._userServiceMode) {
	            updatePromise = this._executeUserUpdate(input);
	        } else {
	            updatePromise = this._executeOtherUpdate(input);
	        }

	        /* Output the updated keys */
	        var keyAttrId = this._entity.getKeyAttribute().getId();
	        return updatePromise.then(function (updatedKeys) {
	            var output = {};
	            output[keyAttrId] = updatedKeys;
	            var code = updatedKeys.length === 0 ? "success.Not Found" : "success";
	            return new wrm.nav.Output(code, output);
	        });
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @return {!Promise<!Array>}
	     */
	    _executeUserUpdate: function (input) {
	        var manager = this.getManager();

	        /* Update through the security service (will also update on database) */
	        var oldPassword = wrm.data.toString(input["oldPassword"]) || null;
	        var newPassword = wrm.data.toString(input["newPassword"]) || null;
	        var newValues = this._extractInputObject(input, this._updateInputKeys, 0);
	        return manager.getSecurityService().then(function (securityService) {
	            return securityService.updateUserInfo(newValues, oldPassword, newPassword);
	        }).then(function (newUserInfo) {
	            var key = newUserInfo.getKey();
	            return key !== undefined ? [key] : [];
	        });
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @return {!Promise<!Array>}
	     */
	    _executeOtherUpdate: function (input) {
	        if (this._bulk) {
	            return this._updateBulk(input);
	        } else {
	            return this._updateSingle(input);
	        }
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @return {!Promise<!Array>}
	     */
	    _updateSingle: function (input) {
	        var condition = this._condition;
	        var entityId = this._entity.getId();

	        /* Update on database */
	        var newObject = this._extractInputObject(input, this._updateInputKeys, 0);
	        return this._dataService.execute(function (d) {
	            return d.update(entityId, {
	                filter: condition,
	                update: newObject
	            }, input);
	        });
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @return {!Promise<!Array>}
	     */
	    _updateBulk: function (input) {
	        var thisService = this;
	        var condition = this._condition;
	        var entityId = this._entity.getId();

	        /* Determine the number of updates and check input consistency */
	        var valuesCount = this._computeObjectsCount(input, this._updateInputKeys);
	        var updateCount = this._computeObjectsCount(input, this._conditionInputKeys);
	        if (valuesCount > 1 && valuesCount < updateCount) {
	            throw new Error("Invalid number of inputs for bulk update");
	        }

	        return this._dataService.execute(function (d) {
	            var results = [];
	            var promise = Promise.resolve();

	            for (var index = 0; index < updateCount; index++) {
	                (function () {
	                    var newObject = thisService._extractInputObject(input, thisService._updateInputKeys, index);
	                    var bulkInput = thisService._extractInputObject(input, thisService._conditionInputKeys, index);
	                    promise = promise.then(function () {
	                        return d.update(entityId, {
	                            filter: condition,
	                            update: newObject
	                        }, bulkInput).then(function (result) {
	                            results.push(result);
	                        });
	                    });
	                })();
	            }

	            return promise.then(function () {
	                var updatedObjectsKeys = [];
	                results.forEach(function (updatedObj) {
	                    updatedObj.forEach(function (key) {
	                        updatedObjectsKeys.push(key);
	                    });
	                });
	                return updatedObjectsKeys;
	            });
	        });
	    },

	    /**
	     * @private
	     * @param {!Object} newObject
	     * @param {!Object} input
	     * @return {!Promise}
	     */
	    _execUpdate: function (newObject, input) {
	        var thisService = this;
	        var entityId = this._entity.getId();
	        return this._dataService.execute(function (d) {
	            return d.update(entityId, {
	                output: entityId,
	                filter: thisService._keyCondition,
	                update: newObject
	            }, input);
	        });
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @param {!Array<string>} keys
	     * @return {number}
	     */
	    _computeObjectsCount: function (input, keys) {
	        var arrayLen = 0;
	        var foundScalars = false;
	        keys.forEach(function (key) {
	            var value = input[key];
	            if (value !== undefined) {
	                var valueLen = Array.isArray(value) ? value.length : 1;
	                if (valueLen === 1) {
	                    foundScalars = true;
	                } else if (arrayLen === 0) {
	                    arrayLen = valueLen;
	                } else if (arrayLen !== valueLen) {
	                    throw new Error("Lengths of input arrays differ");
	                }
	            }
	        });
	        if (arrayLen <= 0 && !foundScalars) {
	            return 0;
	        }
	        return arrayLen > 0 ? arrayLen : 1; // foundScalar true here
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @param {!Array<string>} keys
	     * @param {number} index
	     * @return {!Object}
	     */
	    _extractInputObject: function (input, keys, index) {
	        var result = {};
	        keys.forEach(function (key) {
	            var value = input[key];
	            if (value !== undefined) {
	                if (!Array.isArray(value)) {
	                    result[key] = value;
	                } else if (value.length === 1) {
	                    result[key] = value[0];
	                } else {
	                    result[key] = value[index];
	                }
	            }
	        });
	        return result;
	    } });
	module.exports = exports.default;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for Restful Request Response operations.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractOperationService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractOperationService, {

	    /** @override */
	    initialize: function (descr) {

	        /** @private */
	        this._requestInputs = this._createDataParameterInfos(descr["requestInputs"]);

	        /** @private */
	        this._responseOutputs = this._createDataParameterInfos(descr["responseOutputs"]);

	        /** @private */
	        this._requestHeaderInputs = this._createHeaderParameterInfos(descr["requestHeaderInputs"]);

	        /** @private */
	        this._responseHeaderOutputs = this._createHeaderParameterInfos(descr["responseHeaderOutputs"]);

	        /**
	         * @private
	         * @type {!string}
	         */
	        this._method = descr["method"];

	        /**
	         * @private
	         * @type {!string}
	         */
	        this._url = descr["url"];

	        /**
	         * @private
	         * @type {?{username:string, password:string}}
	         */
	        this._httpAuthentication = descr["httpAuthentication"] || null;

	        /**
	         * @private
	         * @type {?RequestType}
	         */
	        this._requestType = descr["requestType"] ? wrm.util.obj.castEnumValue(RequestType, descr["requestType"]) : null;

	        /**
	         * @private
	         * @type {!ResponseType}
	         */
	        this._responseType = wrm.util.obj.castEnumValue(ResponseType, descr["responseType"]);

	        /**
	         * @private
	         * @type {number}
	         */
	        this._timeout = descr["timeout"];

	        /* Check some descriptor consistency */
	        if (!this._url) {
	            throw new Error("Unspecified endpoint URL");
	        }
	    },

	    /**
	     * @private
	     * @param {!Array<!Object>} paramsDescr
	     * @return {!Array<{name:string, path:string, arrayPath:?string}>}
	     */
	    _createDataParameterInfos: function (paramsDescr) {
	        return paramsDescr.map(function (paramDescr) {
	            return {
	                name: paramDescr["name"],
	                path: paramDescr["path"],
	                arrayPath: paramDescr["array"] || null
	            };
	        });
	    },

	    /**
	     * @private
	     * @param {!Array<!Object>} paramsDescr
	     * @return {!Array<{name:string, header:string, value:string}>}
	     */
	    _createHeaderParameterInfos: function (paramsDescr) {
	        return paramsDescr.map(function (paramDescr) {
	            return {
	                name: paramDescr["name"],
	                header: paramDescr["header"],
	                value: paramDescr["value"]
	            };
	        });
	    },

	    /** @override */
	    executeOperation: function (context) {
	        var thisService = this;
	        return this._sendRequest(context.getInput()).then(function (response) {
	            var outputs = thisService._processResponse(response);
	            return new wrm.nav.Output("success", outputs);
	        })["catch"](function (e) {
	            return new wrm.nav.Output("error", {
	                "errorMessage": "Unexpected error"
	            });
	        });
	    },

	    /*
	     * Request
	     */

	    /**
	     * @param {!wrm.nav.Input} input
	     * @return {!Promise<!angular.$http.Response>}
	     */
	    _sendRequest: function (input) {
	        var platform = this.getManager().getPlatform();

	        /* Prepare the URL to invoke, also replacing parameters */
	        var currentUrl = this._url.replace(/\{(.+?)\}/g, function (m, placeholderName) {
	            return input["path." + placeholderName];
	        });

	        /* Prepare the data to send in the query and in the body */
	        var requestData = this._prepareRequestData(input);
	        var requestHeaders = this._prepareRequestHeaders(input);
	        var queryParams = this._preapreQueryParams(requestData, requestHeaders, input);
	        var bodyDataPromise = this._preapreBodyData(requestData, requestHeaders, input);

	        return bodyDataPromise.then((function (bodyData) {
	            return platform.makeHttpRequest({
	                method: this._method,
	                url: currentUrl,
	                headers: requestHeaders,
	                params: queryParams,
	                data: bodyData,
	                responseType: this._responseType,
	                timeout: this._timeout
	            });
	        }).bind(this));
	    },

	    /**
	     * @private
	     * @param {!Object} data
	     * @param {!Object<string,string>} headers
	     * @param {!wrm.nav.Input} input
	     * @return {!Object}
	     */
	    _preapreQueryParams: function (data, headers, input) {
	        if (!(this._method === "GET" || this._method === "DELETE")) {
	            return {}; // no query for other methods
	        }
	        return data;
	    },

	    /**
	     * @private
	     * @param {!Object} data
	     * @param {!Object<string,string>} headers
	     * @param {!wrm.nav.Input} input
	     * @return {!Promise<!Object>}
	     */
	    _preapreBodyData: function (data, headers, input) {
	        if (this._method === "GET" || this._method === "DELETE") {
	            return Promise.resolve({}); // no body for these methods
	        }

	        var attachedBlobs = wrm.data.toBlobArray(input["attachmentBlobs"]);
	        if (attachedBlobs.length <= 0) {
	            return Promise.resolve(this._prepareBodySimple(data, headers));
	        } else {
	            return this._prepareBodyWithAttachments(data, headers, attachedBlobs);
	        }
	    },

	    /**
	     * @private
	     * @param {!Object} data
	     * @param {!Object<string,string>} headers
	     * @return {!Object}
	     */
	    _prepareBodySimple: function (data, headers) {
	        switch (this._requestType) {
	            case RequestType.JSON:
	                return data;
	            case RequestType.FORM_DATA:
	                var fd = new FormData();
	                Object.keys(data).forEach(function (key) {
	                    fd.append(key, data[key]);
	                });
	                return fd;
	            default:
	                throw new Error("Unknown request type");
	        }
	    },

	    /**
	     * @private
	     * @param {!Object} data
	     * @param {!Object<string,?string|undefined>} headers
	     * @param {!Array<!wrm.data.Blob>} attachedBlobs
	     * @return {!Promise<!Object>}
	     */
	    _prepareBodyWithAttachments: function (data, headers, attachedBlobs) {
	        headers["Content-Type"] = undefined;

	        /** @type {!Array<!Promise<{id:string, blob:!Blob}>>} */
	        var attachmentPromises = attachedBlobs.map(function (blob) {
	            return blob.readBlob().then(function (nativeBlob) {
	                return {
	                    id: blob.getUniqueId(),
	                    blob: nativeBlob
	                };
	            });
	        });

	        return Promise.all(attachmentPromises).then((function (attachments) {
	            var fd = new FormData();

	            switch (this._requestType) {
	                case RequestType.JSON:
	                    fd.append("data", JSON.stringify(data));
	                    break;
	                case RequestType.FORM_DATA:
	                    Object.keys(data).forEach(function (key) {
	                        fd.append(key, data[key]);
	                    });
	                    break;
	                default:
	                    throw new Error("Unknown request type");
	            }

	            attachments.forEach(function (attachment) {
	                fd.append(attachment.id, attachment.blob);
	            });

	            return fd;
	        }).bind(this));
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @return {!Object}
	     */
	    _prepareRequestData: function (input) {
	        var om = new wrm.util.ObjectMapper();

	        /** @type {!Object<string,!Array<{elementPath:string, value:!Array<*>}>>} */
	        var arrayElementInfos = {};

	        /* Fill inputs that do not contribute to arrays; store away all others in order to build ARRAYS later */
	        this._requestInputs.forEach(function (info) {

	            /* Retrieve and convert the input value */
	            var value = input[info.name];
	            if (value === undefined) {
	                return; // continue to next input
	            }
	            value = this._formatInput(value);

	            /* Set value according to path; for empty paths, replace the entire object; skip and store array values */
	            var path = info.path;
	            var arrayPath = info.arrayPath;
	            if (arrayPath) {
	                var elementInfos = arrayElementInfos[arrayPath];
	                if (!elementInfos) {
	                    arrayElementInfos[arrayPath] = elementInfos = [];
	                }
	                elementInfos.push({
	                    elementPath: path.length > arrayPath.length ? path.substring(arrayPath.length + ".".length) : "",
	                    value: wrm.data.toAnyArray(value)
	                });
	            } else {
	                if (path === "") {
	                    om = new wrm.util.ObjectMapper(value);
	                } else {
	                    om.setValue(path, value);
	                }
	            }
	        }, this);

	        /* Build array inputs from their partial inputs */
	        Object.keys(arrayElementInfos).forEach(function (arrayPath) {
	            var arrayValue = this._buildArrayValue(arrayElementInfos[arrayPath], arrayPath);
	            om.setValue(arrayPath, arrayValue);
	        }, this);

	        return om.getObject();
	    },

	    /**
	     * @private
	     * @param {!Array<{elementPath:string, value:!Array<*>}>} elementInfos
	     * @param {string} arrayPath
	     * @return {!Array<*>}
	     */
	    _buildArrayValue: function (elementInfos, arrayPath) {
	        var result = [];

	        /* Normalize values, turning them into arrays of the same length */
	        var normalizedValues = {};
	        var maxLength = 1;
	        for (var i = 0; i < elementInfos.length; i++) {
	            var elementInfo = elementInfos[i];
	            var elementValue = elementInfo.value;
	            if (elementValue.length > 1) {
	                if (maxLength === 1) {
	                    maxLength = elementValue.length;
	                } else if (maxLength !== elementValue.length) {
	                    throw new Error("Input array lengths for '" + arrayPath + "' do not match");
	                }
	            }
	            normalizedValues[elementInfo.elementPath] = elementValue;
	        }

	        /* Condense elements at the same indexes into separate objects */
	        for (var i = 0; i < maxLength; i++) {
	            var om = new wrm.util.ObjectMapper();
	            Object.keys(normalizedValues).forEach(function (elementPath) {
	                var valueArray = normalizedValues[elementPath];
	                var valueElement = valueArray.length === 1 ? valueArray[0] : valueArray[i];
	                if (elementPath === "") {
	                    om = new wrm.util.ObjectMapper(valueElement);
	                } else {
	                    om.setValue(elementPath, valueElement);
	                }
	            });
	            result[i] = om.getObject();
	        }

	        return result;
	    },

	    /**
	     * @param {!wrm.nav.Input} input
	     * @return {!Object<string,string>}
	     */
	    _prepareRequestHeaders: function (input) {
	        var headers = {};

	        /* Include the HTTP authentication header */
	        this._addBasicAuthenticationHeader(headers, input);

	        /* Add other headers */
	        this._requestHeaderInputs.forEach(function (info) {

	            /* Retrieve and convert the input value */
	            var value = input[info.name];
	            if (value === undefined) {
	                value = info.value;
	            }
	            value = this._formatInput(value);

	            headers[info.header] = value;
	        }, this);

	        return headers;
	    },

	    /**
	     * @private
	     * @param {!Object<string,string>} headers
	     * @param {!wrm.nav.Input} input
	     */
	    _addBasicAuthenticationHeader: function (headers, input) {
	        var authentication = this._httpAuthentication;
	        if (!authentication) {
	            return; // authentication not used
	        }

	        var username = input["httpUsername"] || authentication.username;
	        var password = input["httpPassword"] || authentication.password;

	        var authorization = "Basic " + this._convertToBase64("" + username + ":" + password);
	        headers["Authorization"] = authorization;
	    },

	    /**
	     * @private
	     * @param {!Array<*>|*} valueOrArray
	     * @return {!Array<*>|*}
	     */
	    _formatInput: function (valueOrArray) {
	        // TODO implement a better type conversion with information from generation
	        if (Array.isArray(valueOrArray)) {
	            return valueOrArray.map(this._formatInputValue, this);
	        }
	        return this._formatInputValue(valueOrArray);
	    },

	    /**
	     * @private
	     * @param {*} value
	     * @return {*}
	     */
	    _formatInputValue: function (value) {

	        /* Handle native dates as timestamps */
	        if (value instanceof Date) {
	            value = wrm.data.DateTime.fromDate(value);
	        }

	        /* Convert to a JSON-compatible value */
	        var type = typeof value;
	        if (type !== "string" && type !== "number" && type !== "boolean") {
	            value = wrm.data.toString(value);
	        }
	        return value;
	    },

	    /**
	     * @private
	     * @param {!string} stringToConvert
	     * @return {!string}
	     */
	    _convertToBase64: function (stringToConvert) {
	        // TODO delete and use native base64 conversion!
	        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	        var output = "";
	        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	        var i = 0;
	        stringToConvert = this._utf8_encode(stringToConvert);
	        while (i < stringToConvert.length) {
	            chr1 = stringToConvert.charCodeAt(i++);
	            chr2 = stringToConvert.charCodeAt(i++);
	            chr3 = stringToConvert.charCodeAt(i++);
	            enc1 = chr1 >> 2;
	            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
	            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
	            enc4 = chr3 & 63;
	            if (isNaN(chr2)) {
	                enc3 = enc4 = 64;
	            } else if (isNaN(chr3)) {
	                enc4 = 64;
	            }
	            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
	        }
	        return output;
	    },

	    /**
	     * @private
	     * @param {!string} stringToConvert
	     * @return {!string}
	     */
	    _utf8_encode: function (stringToConvert) {
	        stringToConvert = stringToConvert.replace(/\r\n/g, "\n");
	        var utftext = "";
	        for (var n = 0; n < stringToConvert.length; n++) {
	            var c = stringToConvert.charCodeAt(n);
	            if (c < 128) {
	                utftext += String.fromCharCode(c);
	            } else if (c > 127 && c < 2048) {
	                utftext += String.fromCharCode(c >> 6 | 192);
	                utftext += String.fromCharCode(c & 63 | 128);
	            } else {
	                utftext += String.fromCharCode(c >> 12 | 224);
	                utftext += String.fromCharCode(c >> 6 & 63 | 128);
	                utftext += String.fromCharCode(c & 63 | 128);
	            }
	        }
	        return utftext;
	    },

	    /*
	     * Response
	     */

	    /**
	     * @private
	     * @param {!angular.$http.Response} response
	     * @return {!Object<string,*>}
	     */
	    _processResponse: function (response) {
	        var data = response.data;
	        var outputs = {};

	        /* Extract response data as outputs */
	        switch (this._responseType) {
	            case ResponseType.JSON:
	                this._extractResponseData(outputs, response.data);
	                outputs["json"] = JSON.stringify(response.data);
	                break;
	            case ResponseType.TEXT:
	                outputs["text"] = String(data);
	                break;
	        }

	        /* Extract response headers */
	        this._extractResponseHeaders(outputs, response);

	        return outputs;
	    },

	    /**
	     * @param {!Object<string,*>} outputs
	     * @param {!Object} responseData
	     */
	    _extractResponseData: function (outputs, responseData) {
	        var om = new wrm.util.ObjectMapper(responseData);
	        om.setFlattenArrays(true);
	        this._responseOutputs.forEach(function (info) {

	            /* Get value according to path; for empty value, retrieve the entire object */
	            var value;
	            if (info.path === "") {
	                if (info.arrayPath) {
	                    value = wrm.data.toAnyArray(om.getObject());
	                } else {
	                    value = wrm.data.toAnySingle(om.getObject());
	                }
	            } else {
	                if (info.arrayPath) {
	                    value = om.getValues(info.path);
	                } else {
	                    value = om.getValue(info.path);
	                }
	            }

	            if (value !== undefined) {
	                outputs[info.name] = value;
	            }
	        }, this);
	    },

	    /**
	     * @param {!Object<string,*>} outputs
	     * @param {!angular.$http.Response} response
	     */
	    _extractResponseHeaders: function (outputs, response) {
	        var headers = response.headers();
	        this._responseHeaderOutputs.forEach(function (info) {
	            outputs[info.name] = headers[info.header.toLowerCase()];
	        });
	    } });

	/**
	 * @private
	 * @enum {string}
	 */
	var RequestType = {
	    JSON: "JSON",
	    FORM_DATA: "FORM_DATA"
	};

	/**
	 * @private
	 * @enum {string}
	 */
	var ResponseType = { // values used in HTTP request config
	    JSON: "json",
	    TEXT: "text"
	};
	module.exports = exports.default;
	/** @type {!Object} */

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for Selector view components and operations.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractCachedViewComponentService
	 * @implements wrm.OperationService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractCachedViewComponentService, {

	    /** @override */
	    initialize: function (descr) {
	        var thisService = this;

	        /**
	         * @private
	         * @type {!wrm.data.meta.Entity}
	         */
	        this._entity; // init'd below

	        /**
	         * @private
	         * @type {string}
	         */
	        this._entityId; // init'd below

	        // TODO cache query instead
	        /**
	         * @private
	         * @type {!Object}
	         */
	        this._condExpr; // init'd below

	        /**
	         * @private
	         * @type {!number}
	         */
	        this._maxResults = descr["maxResults"];

	        /**
	         * @private
	         * @type {!boolean}
	         */
	        this._distinct = descr["distinct"] || false;

	        /**
	         * @private
	         * @type {!Object}
	         */
	        this._output; // init'd below

	        /**
	         * @private
	         * @type {!Object}
	         */
	        this._toBind; // init'd below

	        /**
	         * @private
	         * @type {!Array}
	         */
	        this._order = descr["order"];

	        /**
	         * @private
	         * @type {!wrm.data.DataService}
	         */
	        this._dataService; // init'd below

	        return this.getManager().getDataService().then(function (dataService) {
	            thisService._dataService = dataService;
	            thisService._entity = dataService.getMetadata().getEntity(descr["entity"]);
	            thisService._entityid = thisService._entity.getId();
	            thisService._condExpr = descr["condExprs"];
	            var output = descr["output"];
	            thisService._output = {};
	            thisService._toBind = {};
	            if (output.length !== 0) {
	                output.forEach(function (column) {
	                    thisService._output[column["viewName"]] = column["ref"];
	                    thisService._toBind[column["viewName"]] = column["bindName"];
	                });
	            } else {
	                var keyAtt = thisService._entity.getKeyAttribute();
	                thisService._output[keyAtt.getName()] = keyAtt.getId();
	                thisService._toBind[keyAtt.getName()] = keyAtt.getId();
	            }
	        });
	    },

	    /** @override */
	    executeOperation: function (context) {
	        var resultsPromise = this._askResult(context.getInput());
	        var thisService = this;

	        return resultsPromise.then(function (rows) {

	            var outputResult = [];
	            var toBind = thisService._toBind;
	            var outputLabels = thisService._output;

	            rows.forEach(function (currentRow) {
	                var outputData = {};
	                Object.keys(outputLabels).forEach(function (key) {
	                    outputData[toBind[key]] = currentRow[key];
	                });
	                outputResult.push(outputData);
	            });

	            var output = {
	                "data": wrm.util.obj.extractPropertyValues(outputResult),
	                "dataSize": rows.length
	            };

	            var code = output["dataSize"] === 0 ? "success.Not Found" : "success";
	            return new wrm.nav.Output(code, output);
	        }, function (e) {
	            return new wrm.nav.Output("error");
	        });
	    },

	    /** @override */
	    createResult: function (context) {
	        var input = context.getInput();
	        var thisService = this;
	        var resultsPromise = this._askResult(input);

	        return resultsPromise.then(function (rows) {

	            var outputResult = [];
	            var toBind = thisService._toBind;
	            var outputLabels = thisService._output;

	            rows.forEach(function (currentRow) {
	                var outputData = {};
	                Object.keys(outputLabels).forEach(function (key) {
	                    outputData[toBind[key]] = currentRow[key];
	                });
	                outputResult.push(outputData);
	            });

	            var output = {
	                "data": wrm.util.obj.extractPropertyValues(outputResult),
	                "dataSize": rows.length
	            };

	            return output;
	        }, function (e) {
	            thisService.getLog().error(e);
	        });
	    },

	    /** @override */
	    isStaleResult: function (context, result) {
	        return result["dataSize"] === 0;
	    },

	    /** @override */
	    computeOutputFromResult: function (context, result) {
	        var output = {
	            "data": result["data"],
	            "dataSize": result["dataSize"]
	        };
	        return output;
	    },

	    /**
	     * @private
	     * @param {!wrm.nav.Input} input
	     * @returns {Promise|Array.<Object>}
	     */
	    _askResult: function (input) {
	        var thisService = this;
	        return this._dataService.execute(function (d) {
	            var options = {
	                output: thisService._output,
	                outputConfig: {
	                    useNames: true
	                },
	                distinct: thisService._distinct,
	                filter: thisService._condExpr,
	                order: thisService._order
	            };

	            var resultsLength = input["maxResults"] || thisService._maxResults;
	            if (resultsLength > 0) {
	                var limit = {
	                    count: resultsLength
	                };
	                options["limit"] = limit;
	            }

	            return d.select(thisService._entityid, options, input);
	        });
	    } });
	module.exports = exports.default;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Service for Barcode Operation operations.
	 * 
	 * @constructor
	 * @extends wrm.core.AbstractOperationService
	 * @param {string} id
	 * @param {!Object} descr
	 * @param {!wrm.core.Manager} manager
	 */
	exports.default = wrm.defineService(wrm.core.AbstractOperationService, {

	    /**
	     * @private
	     * @const
	     */
	    ISO_BARCODE_NAMES: {
	        "QR_CODE": "QR Code",
	        "DATA_MATRIX": "Data Matrix",
	        "UPC_A": "UPC-A",
	        "UPC_E": "UPC-E",
	        "EAN_8": "EAN-8",
	        "EAN_13": "EAN-13",
	        "CODE_128": "Code 128",
	        "CODE_39": "Code 39",
	        "CODE_93": "Code 93",
	        "CODABAR": "Codabar",
	        "RSS_EXPANDED": "RSS Expanded"
	    },

	    /** @override */
	    executeOperation: function (context) {
	        var thisService = this;

	        var scanPromise = new Promise(function (resolve, reject) {
	            cordova.plugins.barcodeScanner.scan(function (scanResult) {
	                resolve(scanResult);
	            }, function (error) {
	                reject(error);
	            }, []);
	        });

	        return scanPromise.then(function (scanResult) {
	            if (scanResult["cancelled"]) {
	                return new wrm.nav.Output("success.Cancel");
	            } else {
	                var output = {};
	                var value = scanResult["text"];
	                var outputFormat = scanResult["format"];
	                output["format"] = thisService.ISO_BARCODE_NAMES[outputFormat] ? thisService.ISO_BARCODE_NAMES[outputFormat] : outputFormat;
	                output["valueType"] = thisService._getValueType(value);
	                output["value"] = value;
	                return new wrm.nav.Output("success", output);
	            }
	        }, function (e) {
	            return new wrm.nav.Output("error", {
	                "errorMessage": e
	            });
	        });
	    },

	    /**
	     * @private
	     * @param {!String} value
	     * @return {!string}
	     */
	    _getValueType: function (value) {
	        if (value.indexOf("http://") === 0 || value.indexOf("https://") === 0) {
	            return "url";
	        }
	        if (value.indexOf("SMSTO:") === 0) {
	            return "sms";
	        }
	        if (value.indexOf("MATMSG:") === 0) {
	            return "email";
	        }
	        if (value.indexOf("tel:") === 0) {
	            return "phone";
	        }
	        if (value.indexOf("geo:") === 0) {
	            return "geo";
	        }
	        if (value.indexOf("MECARD:") === 0) {
	            return "phoneContact";
	        }
	        return "text";
	    }
	});
	module.exports = exports.default;

/***/ }
/******/ ]);
})(this);