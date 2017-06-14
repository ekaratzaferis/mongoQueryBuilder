## Synopsis

This project converts JSON files into MongoDB queries.

It's fairly simple to use.

1) Describe the query in JSON format
2) Parse the JSON file into a JS object
3) Feed it to the mongoQueryBuilder
4) Get back the query
5) Use Mongoose on Mongo Driver: Model.find(query)

## API

Mongo queries: The simplest way to describe MongoQueries, would be

```
       LEFT           RIGHT
{ documentProperty: condition }
```

Our JSON file consists of conditions and expressions. Conditions define simple Mongo
Queries as described above, and expressions either use these conditions or combine
them using OR - AND operators.

The syntax described below should be used at all times (builder includes a JOI validator)

It's important to understand that the condition labels can be used
either to target a condition in 'use' expression, or to target a condition
in the left/right parts of the expressions.

### Conditions
```javascript
{
    prop: 'country',  // the document's property that we wish to evaluate
    op: 'equal',      // the operation that will construct the query
    value: 'UK'       // the desired value (may be an array in case of the "inside" operatio
}
```

The allowed operations are ['equal', 'nequal', 'inside', 'gt', 'lt']

equal is the simplest Mongo query to check equality
```
{ prop: value }
```
nequal uses the $ne operand to check inequality
```
{ prop: { $ne: value } }
```
inside uses the $in operand to check inside an array
```
{ prop: { $in: value } }
```
lt uses the $lt operand to compare values
```
{ prop: { $lt: value } }
```
gt uses the $gt operand to compare values
```
{ prop: { $gt: value } }
```

### Expressions
```javascript
{
    op: 'and',                      // indicates that will be adding an AND query
    left: 'COUNTRY_IS_UK'           // targets the left part of the expression (in this case a simple condition)
    right: {                        // targets the right part of the expression (in this case, another expression)
    op: 'or',                    // indicates that will be adding an OR query
        left: 'USER_IS_OLD',   // simple condition
        right: 'USER_IS_RICH'  // simple condition
    }
}
```

OR

```javascript
{
    op: 'use',                     // indicates that will be adding a simple condition in the expression
    condition: 'COUNTRY_IS_UK'     // targets the condition that we need to evaluate
}
```
OR some combination of the above.

The allowed operations are ['or', 'and', 'use']

or uses the $or operand to combine left and right expressions
```
{ $or: [left, right]
```
and uses the $and operand to combine left and right expressions
```
{ $and: [left, right]
```
use is the operation that includes a simple condition to the query

## Code Example

Start of by requiring the index file in the root folder:

```javascript
const queryBuilder = require('../index')
```

Then define your expressions and conditions:

```javascript
// A series of expressions that will build the query //
var expressions = {
    FIND_SMARTPHONE_USERS_IN_USA: {        // LABEL
        op: 'and',                         // OPERATION
        left: 'COUNTRY_IS_USA',            // LEFT PART OF THE EXPRESSION
        right: {                           // RIGHT PART OF THE EXPRESSION
            op: 'or',
            left: 'MODEL_IS_APPLE',
            right: 'MODEL_IS_SAMSUNG'
        }
    }
}
// A series of facts that you would like to evaluate //
var conditions = {
    COUNTRY_IS_USA: {                     // LABEL
        prop: 'build.country',            // DOCUMENT PROPERTY
        op: 'equal',                      // OPERATION
        value: 'USA'                      // VALUE
    },
    MODEL_IS_APPLE: {
        prop: 'build.model',
        op: 'equal',
        value: 'APPLE'
    },
    MODEL_IS_SAMSUNG: {
        prop: 'build.model',
        op: 'equal',
        value: 'SAMSUNG'
    }
}
```

Follow up by calling the builder (async method)

```javascript
return queryBuilder(expressions, conditions).then((query) => {
    // Call your database by using 'query'
})
````

The query produces from the builder, has the following format:
```javascript
{
    "$and": [
        {
            "build.country": "USA"
        },
        {
            "$or": [
                {
                    "build.model": "APPLE"
                },
                {
                    "build.model": "SAMSUNG"
                }
            ]
        }
    ]
}
```

## Motivation

This project was build in order to enable users not familiar with MongoDB, to construct complex queries,
by using a simple JSON format.

## Installation

No NPM yet, just copy the root folder into your own project, and install the dependencies from the package.json file.

## Tests

There's a mocha unit test in unit/mongoQueryBuilder_spec.js
Works also as an example!