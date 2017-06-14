/**
 * This module is a simple look-up for known mongodb commands and returns the right part of the Mongo query.
 *
 * For example, a simple Mongo query could be:
 *
 *        Left           Right
 * { documentProperty: condition }
 *
 * The supported operations include (again, we return the right part of the query):
 *     equal  => value
 *     nequal => { $ne: value }
 *     inside => { $in: array }
 *     gt     => { $gt: value }
 *     lt     => { $lt: value }
 *
 * The format of a common condition is:
 * {
 *     prop: 'country',  // the document's property that we wish to evaluate
 *     op: 'equal',      // the operation that will construct the query
 *     value: 'UK'       // the desired value (may be an array in case of the "inside" operatio
 * }
 * @param condition
 * @returns {*}
 */
module.exports = (condition) => {
    if (condition.op === 'equal') {
        return condition.value
    } else if (condition.op === 'nequal') {
        return {$ne: condition.value}
    } else if (condition.op === 'inside') {
        return {$in: condition.value}
    } else if (condition.op === 'gt') {
        return {$gt: condition.value}
    } else if (condition.op === 'lt') {
        return {$lt: condition.value}
    }
}
