# Edge worker page hydrate

## Overview 

This is a minimal example of using Cloudflare edge workers to hydrate a static page with data fetched from an API. The website and API serverless function are hosted by Netlify.

Though the example shows a statically generated page being hydrated, the same technique could be used on a dynamically generated page, which might make sense in situations where you don’t have the possibility to run fetch requests on the web server, e.g. a website hosted on Squarespace.

## Description

A request for the index page from a browser will get intercepted by the Cloudflare edge worker, which will fetch both the static page and the API data, update the static page with the data, then return the updated static page to the browser. The page will be useable as soon as the page loads.

Worth noting that the website must use the Cloudflare nameservers in order to be able to route the requests via the edge workers.

## Discussion

This architecture is very useful in Jamstack style sites, where the pages are pre-rendered when the site is built. Cloudflare edge workers make it possible to insert live data into the page dynamically at request time.

Page render times are generally much faster than equivalent client-side data hydration architectures because the data fetch happens on very fast internet backbone connections with low latency, as opposed to using the user’s connection, the quality of which varies significantly. The page is ready to use immediately, with no waiting for the client javascript code to fetch and update the page.

Another benefit is security because there is no need to store API tokens in the browser, they can all be stored on Cloudflare in encrypted environment variables.

Additionally it’s possible to move the entire API code directly into the worker so all data fetching is done on the edge, which has the potential to speed things up even more. 

The example uses a separate API because that’s generally a good way to start, because if, for whatever reason, the Cloudflare edge worker solution doesn’t workout, it’s relatively easy to move back to a client-side data hydration architecture.

## Setup

### Website and API

1. Create a Netlify free account
2. Create a new site on Netlify and connect it to your Github account, selecting the repo
3. Automatic deploys should now be setup, your site and API function should be live after a few moments, deploys happen when you push to the main branch
4. Configure a custom domain / subdomain for your website
5. Test that the website page loads
6. Test that the API is returning data

### Edge workers

1. Create a Cloudflare account for the edge workers
2. Configure the website domain Registrar to use Cloudflare’s nameservers
3. Add the following variables as Github secrets (see environment variables section)
4. Automatic deploy of your worker code to Cloudflare should now be setup, whenever you push to the main branch, the repo’s GitHub Action will deploy to Cloudflare
5. Check the Actions tab in your Github repo to see / re-run the deploys

When you load the website page in a browser it should return a page with the API data inserted as an h1 in the page. Congratulations your page was hydrated with data from the API using Cloudflare edge workers!

If you don’t want to give Netlify access to your GitHub account (requires full access currently), then you can either create a separate account, or you could write a Github Action to deploy to Netlify via their CLI tool.

## Environment variables

You will need to set the following environment variables in your Github repo as secrets:

### Worker

- **CLOUDFLARE_DEPLOY_ENABLED** - Deploy to Cloudflare using CLI (yes|no)
- **CF_ACCOUNT_ID** - Found at the bottom of the main page of you Cloudflare account
- **CF_ZONE_ID** - Found at the bottom of the main page of you Cloudflare account
- **CF_ROUTE** - The route to your index page, i.e example.com
- **CF_API_TOKEN** - Found on you Cloudflare account, you will need to create a token that grants you access to the workers 
- **API_URL** - The path to your Netlify function used for data fetch, i.e https://example.com/.netlify/functions/hello

### Deploy to Netlify via CLI

These are only necessary if you decide to deploy to Netlify using their CLI tool rather than via the Netlify integration with your Github account. First set these:

- **NETLIFY_AUTH_TOKEN** - Netlify auth token
- **NETLIFY_TEAM** - Name of your Netlify team

Then use the manually triggered netlifyCreateEmptyProject GitHub Action to create an empty Netlify project. Then set the following:

- **NETLIFY_DEPLOY_ENABLED** - Deploy to Netlify using CLI (yes|no)
- **NETLIFY_SITE_ID** - ID of your Netlify site
