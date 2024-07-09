# instagram-scraper

Scrapes your Instagram following, post likes &amp; more for stats. Node.js backend coupled with React frontend.

### TODO

-   Fix docker compose (comms between containers?)
-   Fix mounting db folder contents as db volume
-   Code scraper
-   Make scraper run as node express app
-   Writes scrape data to mounted db volume
-   Web app modal which takes your username, post scrape count & calls scraper express app (on finish it must reload whole app data from server)
-   Web app saves scraped username and post count to local storage
