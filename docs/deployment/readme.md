---
layout: default
---
# How the site works

The SimpliCity frontend lives in AWS (Amazon Web Services). The static files are in an S3 bucket, and https is enabled through a CloudFront distribution pointing to the bucket. Domains are managed via AWS Route 53. The https certificate provided by the AWS certificate manager.

## Updates / Deployment
## AWS CodeDeploy pushes Simplicity2 Github changes to S3

```git push``` in development or master will deploy to dev or prod.


## Old deploy instructions:

Updates to the site content require two steps:
* Push the new code to the S3 bucket
  * It is possible to simply delete the old files and drag and drop new files into an S3 bucket, however using the Amazon cli is most conventient. The package.json file includes the "deploySimplicity2" command that can be used for this purpose.
    * In order to be able to run that command, you must have the Amazon cli installed on your machine, and you must set the proper profile information locally so that your machine has the appropriate permissions to carry out the commands.
    * The profile keys needed can be found/created in the IAM section of AWS under the simplicity2 user's security credentials.
    * See [this documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html) for setting the named profiles on your machine.
    * Once you have the cli and permissions set up properly, to update the S3 bucket you will need to simply:
      * Delete your "dist" folder
      * Run "npm run build"
      * Run "npm run deploySimplicity2"
      * Follow steps to invalidate in Cloudfront outlined below
* Invalidate the files in Cloudfront for immediate updates (otherwise updates will take approximately 24 hours to propagate)
  * Go to the Cloudfront distribution in the AWS console. Click on the "Invalidations" tab. "Create Invalidation" and invalidate /* as the Object Paths.