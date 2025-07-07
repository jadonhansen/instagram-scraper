# instagram-scraper

Scrapes your Instagram following, post likes &amp; more for stats. Node.js backend coupled with React frontend, booted with Docker.

### TODO

-   Add turbo to repo - consider removing docker
-   Fix docker compose (comms between containers?)
-   Fix mounting db folder contents as db volume
-   Code scraper
-   Make scraper run as node express app with POST request
-   Writes scrape data to mounted db volume
-   Web app modal which takes your username, post scrape count (e.g. top 10 posts) & calls scraper express app (on finish it must reload whole app data from server)
-   Web app saves scraped username and post count to local storage
