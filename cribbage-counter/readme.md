# Introduction

A package to score cribbage hands

## API Spec

<https://dkackman.github.io/CribbageCounter/>

## Test Front End

<https://cribbagecounter.kackman.net/>

## Example

```javascript
const cribbageCounter = require('cribbage-counter');

const explanation = cribbageCounter.scoreHand('9D,9C,4H,8S,5S', false);
console.log(explanation.score); 
// 2

console.log(explanation); 
// {"points":[{"name":"Pair","cards":["9D","9C"],"points":2}],"score":2}
```

## REST Examples

<https://cribbagecounter.kackman.net/api/score?hand=5D,5C,5H,JS,5S&isCrib=false>

<https://cribbagecounter.kackman.net/api/explain?hand=5D,5C,5H,JS,5S&isCrib=false>
