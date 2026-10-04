# instagram-scraper

Scrapes your Instagram following, post likes &amp; more for stats. Node.js backend coupled with React frontend.

## Scraping

The scraper drives your installed Google Chrome with a separate profile. On the first run Chrome opens on the Instagram login page; log in there and the scrape continues. Later runs reuse that session.

Start a scrape from the Scrape button in the web UI, or from the command line:

```bash
cd server && npm run scrape -- <username>
```

Scraping uses the Instagram web app's own endpoints and breaks Instagram's terms of use. Requests are spaced 2 to 5 seconds apart to keep volume close to manual browsing. Followers and following lists are only visible for public accounts and private accounts you follow.
