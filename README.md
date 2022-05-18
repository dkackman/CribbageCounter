[![CodeQL](https://github.com/dkackman/CribbageCounter/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/dkackman/CribbageCounter/actions/workflows/codeql-analysis.yml)

[![NPM](https://nodei.co/npm/cribbage-counter.png?mini=true)](https://npmjs.org/package/cribbage-counter)

# Introduction

A Node REST service to score cribbage hands (because there isn't one already)

## API Spec

<https://dkackman.github.io/CribbageCounter/>

## Test Front End

<https://cribbagecounter.kackman.net/>

<https://cribbagecounter.kackman.net/api/score?hand=5D,5C,5H,JS,5S&isCrib=false>

<https://cribbagecounter.kackman.net/api/explain?hand=5D,5C,5H,JS,5S&isCrib=false>

Counting logic adapted from [this codeproject article](https://www.codeproject.com/Articles/15468/Cribbage-Hand-Counting-Library)

# Getting Started

1. Pull the repo
2. `npm install`
3. `npm start`
4. Navigate to <http://localhost:3000>
