---
layout: default
---
# How the site works

The SimpliCity frontend lives in AWS (Amazon Web Services). It deploys to an Amplify application, with environments built from various branches in this repo (development, production, and temporary feature branches).  https for the [production environment](https://simplicity.ashevillenc.gov/) is enabled through a CloudFront distribution pointing to the production Amplify environment. The production domain is managed in AWS Route 53. The https certificate provided by the AWS certificate manager.

## Updates / Deployment

Updates to the site content require:
* Push new code to Github
  * NOTE: Amplify watches certain branches in the repo and deployments are triggered by new commits to those branches (development and production, plus any temporary feature branch environments)   
* Invalidate the files in Cloudfront (Optional, only needed if deployed changes are not visible)
  * Go to the Cloudfront distribution in the AWS console. Click on the "Invalidations" tab. "Create Invalidation" and invalidate /* as the Object Paths.