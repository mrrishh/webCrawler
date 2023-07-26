# webCrawler
crawling application to efficiently access review data from below given business profile

# Install package dependecies
Use node version 18 to latest
run: node crawler.js

# API CURL to crawl reviews: 
curl --location 'http://localhost:8080/crawl?url=https%3A%2F%2Fwww.glassdoor.com%2FReviews%2FBAYADA-Home-Health12-Care-Reviews-E153924.htm&source=glassdoor&filter_date=2023-07-17'

  # Query Params
    1. URL: Provide the URL to crawl
    2. source: Domain name to specify the crawl. If not present throws an error.
    3. filter_date: (optional field: if provided, aggregate reviews till review date >= filter date)
