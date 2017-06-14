/**
 * This module is a simple look-up for known mongodb commands and returns the right part of the Mongo query.
 *
 * For example, a simple Mongo query could be:
 *
 *        Left           Right
 * { documentProperty: condition }
 *
 * The supported operations include (again, we return the right part of the query):
 *     =       => value
 *     !=      => { $ne: value }
 *     >>[]    => { $in: array }
 *     >>![]   => { $nin: value }
 *     >       => { $gt: value }
 *     >=      => { $gte: value }
 *     <       => { $lt: value }
 *     <=      => { $lte: value }
 *     exists  => { $exists: value }
 *     pattern => { $regex: value }
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
    if (condition.op === '=') {
        return condition.value
    } else if (condition.op === '!=') {
        return {$ne: condition.value}
    } else if (condition.op === '>>[]') {
        return {$in: condition.value}
    } else if (condition.op === '>>![]') {
        return {$nin: condition.value}
    }else if (condition.op === '>') {
        return {$gt: condition.value}
    } else if (condition.op === '>=') {
        return {$gte: condition.value}
    } else if (condition.op === '<') {
        return {$lt: condition.value}
    } else if (condition.op === '<=') {
        return {$lte: condition.value}
    } else if (condition.op === 'exists') {
        return {$exists: condition.value}
    } else if (condition.op === '<=') {
        return {$regex: condition.value}
    }
}
