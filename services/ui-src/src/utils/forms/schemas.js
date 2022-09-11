"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFormatRegex = exports.nested = exports.dynamicOptional = exports.dynamic = exports.radioOptional = exports.radio = exports.checkboxSingle = exports.checkboxOptional = exports.checkbox = exports.dropdown = exports.endDate = exports.dateOptional = exports.date = exports.urlOptional = exports.url = exports.emailOptional = exports.email = exports.ratio = exports.numberOptional = exports.number = exports.textOptional = exports.text = void 0;
var yup_1 = require("yup");
var errors_1 = require("verbiage/errors");
// TEXT
var text = function () {
    return (0, yup_1.string)().typeError(errors_1.schemaValidationErrors.INVALID_GENERIC).required(errors_1.schemaValidationErrors.REQUIRED_GENERIC);
};
exports.text = text;
var textOptional = function () { return (0, exports.text)().notRequired(); };
exports.textOptional = textOptional;
// NUMBER - Helpers
var validNAValues = ["N/A", "Data not available"];
var ignoreCharsForSchema = function (value, charsToReplace) {
    return (0, yup_1.number)().transform(function (_value) {
        return Number(value.replace(charsToReplace, ""));
    });
};
// NUMBER - Number or Valid Strings
var number = function () {
    return (0, yup_1.mixed)()
        .test({
        message: errors_1.schemaValidationErrors.REQUIRED_GENERIC,
        test: function (val) { return val != ""; },
    })
        .required(errors_1.schemaValidationErrors.REQUIRED_GENERIC)
        .test({
        message: errors_1.schemaValidationErrors.INVALID_NUMBER_OR_NA,
        test: function (val) {
            var replaceCharsRegex = /[,.]/g;
            return (ignoreCharsForSchema(val, replaceCharsRegex).isValidSync(val) ||
                validNAValues.includes(val));
        },
    });
};
exports.number = number;
var numberOptional = function () { return (0, exports.number)().notRequired(); };
exports.numberOptional = numberOptional;
// Number - Ratio
var ratio = function () {
    return (0, yup_1.mixed)()
        .test({
        message: errors_1.schemaValidationErrors.REQUIRED_GENERIC,
        test: function (val) { return val != ""; },
    })
        .required(errors_1.schemaValidationErrors.REQUIRED_GENERIC)
        .test({
        message: errors_1.schemaValidationErrors.INVALID_RATIO,
        test: function (val) {
            var replaceCharsRegex = /[,.:]/g;
            var ratio = val.split(":");
            // Double check and make sure that a ratio contains numbers on both sides
            if (ratio.length != 2 ||
                ratio[0].trim().length == 0 ||
                ratio[1].trim().length == 0) {
                return false;
            }
            // Check if the left side of the ratio is a valid number
            var firstTest = ignoreCharsForSchema(ratio[0], replaceCharsRegex).isValidSync(val);
            // Check if the right side of the ratio is a valid number
            var secondTest = ignoreCharsForSchema(ratio[1], replaceCharsRegex).isValidSync(val);
            // If both sides are valid numbers, return true!
            return firstTest && secondTest;
        },
    });
};
exports.ratio = ratio;
// EMAIL
var email = function () { return (0, exports.text)().email(errors_1.schemaValidationErrors.INVALID_EMAIL); };
exports.email = email;
var emailOptional = function () { return (0, exports.email)().notRequired(); };
exports.emailOptional = emailOptional;
// URL
var url = function () { return (0, exports.text)().url(errors_1.schemaValidationErrors.INVALID_URL); };
exports.url = url;
var urlOptional = function () { return (0, exports.url)().notRequired(); };
exports.urlOptional = urlOptional;
// DATE
var date = function () {
    return (0, yup_1.string)()
        .required(errors_1.schemaValidationErrors.REQUIRED_GENERIC)
        .matches(exports.dateFormatRegex, errors_1.schemaValidationErrors.INVALID_DATE);
};
exports.date = date;
var dateOptional = function () { return (0, exports.date)().notRequired(); };
exports.dateOptional = dateOptional;
var endDate = function (startDateField) {
    return (0, exports.date)().test("is-after-start-date", errors_1.schemaValidationErrors.INVALID_END_DATE, function (endDateString, context) {
        var startDateString = context.parent[startDateField];
        var startDate = new Date(startDateString);
        var endDate = new Date(endDateString);
        return endDate >= startDate;
    });
};
exports.endDate = endDate;
// DROPDOWN
var dropdown = function () {
    return (0, yup_1.string)().typeError(errors_1.schemaValidationErrors.INVALID_GENERIC).required(errors_1.schemaValidationErrors.REQUIRED_GENERIC);
};
exports.dropdown = dropdown;
// CHECKBOX
var checkbox = function () {
    return (0, yup_1.array)()
        .min(1, errors_1.schemaValidationErrors.REQUIRED_CHECKBOX)
        .of((0, exports.text)())
        .required(errors_1.schemaValidationErrors.REQUIRED_CHECKBOX);
};
exports.checkbox = checkbox;
var checkboxOptional = function () { return (0, exports.checkbox)().notRequired(); };
exports.checkboxOptional = checkboxOptional;
var checkboxSingle = function () { return (0, yup_1.array)(); };
exports.checkboxSingle = checkboxSingle;
// RADIO
var radio = function () {
    return (0, yup_1.array)().min(1).of((0, exports.text)()).required(errors_1.schemaValidationErrors.REQUIRED_GENERIC);
};
exports.radio = radio;
var radioOptional = function () { return (0, exports.radio)().notRequired(); };
exports.radioOptional = radioOptional;
// DYNAMIC
var dynamic = function () {
    return (0, yup_1.array)().min(1).of((0, exports.text)()).required(errors_1.schemaValidationErrors.REQUIRED_GENERIC);
};
exports.dynamic = dynamic;
var dynamicOptional = function () { return (0, exports.dynamic)().notRequired(); };
exports.dynamicOptional = dynamicOptional;
// NESTED
var nested = function (fieldSchema, parentFieldName, parentOptionValue) {
    var fieldTypeMap = {
        array: (0, yup_1.array)(),
        mixed: (0, exports.number)(),
        string: (0, yup_1.string)(),
        date: (0, exports.date)(),
    };
    var fieldType = fieldSchema().type;
    var baseSchema = fieldTypeMap[fieldType];
    return baseSchema.when(parentFieldName, {
        is: function (value) { return value && value.indexOf(parentOptionValue) != -1; },
        then: function () { return fieldSchema(); },
    });
};
exports.nested = nested;
// REGEX
exports.dateFormatRegex = /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;
//# sourceMappingURL=schemas.js.map