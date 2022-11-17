"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var aws_sdk_1 = require("aws-sdk");
var UPDATE_ARCHIVED = false;
var UPDATE_SUBMITTED = false;
// let BAD_VALUE = "DO NOT TOUCH";
var GOOD_VALUE = "NEW PROGRAM NAME";
var thingToRemove =
  "Enter the total, unduplicated number of individuals enrolled in any type of Medicaid managed care as of the first day of the last month of the reporting year.";
var handler = function (_event, _context) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a,
      dynamoClient,
      tableName,
      scanParams,
      existingData,
      existingItems,
      itemsToChange,
      updatedItems;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          (_a = initializeDynamoDb()),
            (dynamoClient = _a.dynamoClient),
            (tableName = _a.tableName);
          scanParams = {
            TableName: tableName,
          };
          return [4 /*yield*/, dynamoClient.scan(scanParams).promise()];
        case 1:
          existingData = _b.sent();
          existingItems =
            existingData === null || existingData === void 0
              ? void 0
              : existingData.Items;
          // console.log({ existingItems });
          // for each item find which ones match the change case
          if (existingItems) {
            itemsToChange = filterReportsOnCondition(existingItems);
            // GET ITEMS TO CHANGE
            itemsToChange = filterItemsMatchingCondition(itemsToChange);
            updatedItems = itemsToChange.map(function (item) {
              item.programName = GOOD_VALUE;
              return item;
            });
            // console.log({ updatedItems });
            // UPLOAD BACK TO DYNAMODB
            writeItemsToDb(updatedItems, tableName, dynamoClient);
          }
          return [
            2 /*return*/,
            {
              statusCode: 200,
              body: JSON.stringify({
                message: "hello world",
              }),
            },
          ];
      }
    });
  });
};
exports.handler = handler;
var writeItemsToDb = function (updatedItems, tableName, dynamoClient) {
  updatedItems.forEach(function (item) {
    return __awaiter(void 0, void 0, void 0, function () {
      var params;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            params = {
              TableName: tableName,
              Item: __assign({}, item),
            };
            return [4 /*yield*/, dynamoClient.put(params).promise()];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
};
var filterItemsMatchingCondition = function (itemsToChange) {
  return itemsToChange.filter(function (item) {
    // item.programName !== BAD_VALUE
    var newTemplate = adjustObject(item.formTemplate);
    item.formTemplate = newTemplate;
    return item;
  });
};
var filterReportsOnCondition = function (itemsToChange) {
  // filter out archived reports
  if (!UPDATE_ARCHIVED) {
    itemsToChange = itemsToChange.filter(function (item) {
      return !item.archived;
    });
  }
  // filter out submitted reports
  if (!UPDATE_SUBMITTED) {
    itemsToChange = itemsToChange.filter(function (item) {
      return !item.submittedBy;
    });
  }
  return itemsToChange;
};
var initializeDynamoDb = function () {
  var dynamoPrefix;
  var dynamoConfig = {};
  var endpoint = process.env.DYNAMODB_URL;
  if (endpoint) {
    dynamoConfig.endpoint = endpoint;
    dynamoConfig.accessKeyId = "LOCAL_FAKE_KEY"; // pragma: allowlist secret
    dynamoConfig.secretAccessKey = "LOCAL_FAKE_SECRET"; // pragma: allowlist secret
    dynamoPrefix = "local";
  } else {
    dynamoConfig["region"] = "us-east-1";
    dynamoPrefix = process.env.dynamoPrefix;
  }
  var dynamoClient = new aws_sdk_1.DynamoDB.DocumentClient(dynamoConfig);
  var tableName = dynamoPrefix + "-mcpar-reports";
  return { dynamoClient: dynamoClient, tableName: tableName };
};
/****/
/****/
/****/
/****/
// adjust string
var adjustString = function (string) {
  return string.replace(thingToRemove, "HAHAHAHAHAH WIN!!!");
};
// iterates over array items, sanitizing items recursively
var adjustArray = function (array) {
  return array.map(function (entry) {
    return adjustEntry(entry);
  });
};
// iterates over object key-value pairs, sanitizing values recursively
var adjustObject = function (object) {
  if (object) {
    var entries = Object.entries(object);
    var adjustedEntries = entries.map(function (entry) {
      var key = entry[0],
        value = entry[1];
      return [key, adjustEntry(value)];
    });
    return Object.fromEntries(adjustedEntries);
  }
};
var adjusterMap = {
  string: adjustString,
  array: adjustArray,
  object: adjustObject,
};
// return adjusted entry, or if safe type, return entry
var adjustEntry = function (entry) {
  var entryType = Array.isArray(entry) ? "array" : typeof entry;
  var adjuster = adjusterMap[entryType];
  return (
    (adjuster === null || adjuster === void 0 ? void 0 : adjuster(entry)) ||
    entry
  );
};
//# sourceMappingURL=dataTransform.js.map
