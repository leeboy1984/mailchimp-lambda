# MailChimp Lambda

A Lambda function for creating MailChimp subscriptions. Subscription list is configurable via API

##  Configuration

Set your MailChimp data center, API key, status, and username in the `.env` file. Copy the
sample to get started:

```
$ cp .env.sample .env
```
Status only supports this values: subscribed, unsubscribed, cleaned, pending

Additional details about authenticating with the MailChimp API is available [here](http://developer.mailchimp.com/documentation/mailchimp/guides/get-started-with-mailchimp-api-3/).

## Deployment

First you need to get dependencies

```
$ npm update
```

There's a handy script included to create your zip archive:

```
$ npm run-script zip
```

Upload zip to your lambda function

Integrate with the
[AWS API Gateway](http://docs.aws.amazon.com/lambda/latest/dg/gs-amazon-gateway-integration.html)
to access the function via HTTP POST:

```
$ curl -X POST -H "Content-Type: application/json" \
-d '{ "email": "name@email.com", "list": "LIST_ID" }' \
YOUR_API_GATEWAY_URL
```
