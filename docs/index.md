---
layout: default
title: Simplicity II
---
# SimpliCity II

## Table of Contents

- [Requirements](./requirements/principles)
- [Resources](./development-resources/readme)
- [Testing](./testing/readme)

## Overview

TBD

## Features that we have in mind


* Search is still a central feature
  * Search by place, topic, topic category, and ID
* Places
  * Find a place with a map: more map layers to provide context
  * Place Details
* Citywide Topic Pages
  * Citywide Topics filterable by place and category 
  * Drill down into Topic Details
* Role-Based Topic Pages
  * Log In (Google/Facebook)
  * Monitoring and Performance Dashboards
* My SimpliCity
  * Save Bookmarks
  * Find your Role-based Topic Dashboards

## Deploying to Firebase

Install Firebase tools on your local machine with

    npm install -g firebase-tools

Then log into firebase with

    firebase login

Make sure the production version is built by running

  npm run build

Then run

  firebase deploy

The project is defined in .firebaserc - change the data there to use a different project (there may be a faster way to do it - I haven't read all the documentation).

There
