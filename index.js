// Check the rest of the docs for documentation //
// ASYNC METHOD - RETURNS A PROMISE //
const queryEngine = require('./lib/engine')
const validate = require('./lib/validation/index')
module.exports = (expressions, conditions) => {
    return validate(expressions, conditions).then(() => {
        return queryEngine(expressions, conditions)
    })
}
