/**
 * This module is a simple look-up for known mongodb commands and returns the right part of the Mongo query.
 *
 * For example, a simple Mongo query could be:
 *
 *        Left           Right
 * { documentProperty: condition }
 *
 * The supported operations include (again, we return the right part of the query):
 *     equals         => value
 *     different      => { $ne: value }
 *     is_one_of      => { $in: array }
 *     is_not_one_of  => { $nin: value }
 *     greater_than   => { $gt: value }
 *     greater_equal  => { $gte: value }
 *     less_than      => { $lt: value }
 *     less_equal     => { $lte: value }
 *     exists         => { $exists: value }
 *     pattern        => { $regex: value }
 *
 * The format of a common condition is:
 * {
 *     prop: 'country',  // the document's property that we wish to evaluate
 *     op: 'equals',     // the operation that will construct the query
 *     value: 'UK'       // the desired value (may be an array in case of the "inside" operation
 *     isDate: false     // determines whether the value contains a date string. It is optional
 * }
 * @param condition
 * @returns {*}
 */
module.exports = (condition) => {
    if (condition.isDate === true) {
        condition.value = new Date(condition.value)
    }
    if (condition.op === 'equals') {
        return condition.value
    } else if (condition.op === 'different') {
        return {$ne: condition.value}
    } else if (condition.op === 'is_one_of') {
        return {$in: condition.value}
    } else if (condition.op === 'is_not_one_of') {
        return {$nin: condition.value}
    }else if (condition.op === 'greater_than') {
        return {$gt: condition.value}
    } else if (condition.op === 'greater_equal') {
        return {$gte: condition.value}
    } else if (condition.op === 'less_than') {
        return {$lt: condition.value}
    } else if (condition.op === 'less_equal') {
        return {$lte: condition.value}
    } else if (condition.op === 'exists') {
        return {$exists: condition.value}
    } else if (condition.op === 'pattern') {
        return {$regex: condition.value}
    }
}
