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

#Sample Output 

{
    "result": {
        "review_count": 4,
        "aggregated_reviews": [
            {
                "title": "Employee Experience starting to suffer",
                "author_info": "Jul 20, 2023 - Enterprise Support Office Employee",
                "rating": "2.0",
                "pros": "Good work/life balance most of the time Excellent team Good FTE PTO depending on tenure",
                "cons": "BAYADA continues to drift from its self-professed key values. Compassion, Excellence, and Reliability are values that all companies should uphold. In the past years BAYADA has drifted from these values, hiring and internally promoting individuals who do not exhibit the BAYADA Way core values. It's not uncommon to be talked down to or thrown under the bus by new hires in positions or power or individuals with known behavioral issues who have been somehow fast-tracked up the management track. BAYADA seems to cry poor mouth when it comes to COLAs for employees or providing half-way decent benefits and yet somehow finds the money to pay its executive teams over $10,000,000 annually. BAYADA is constantly expanding while tightening budgets. It isn't uncommon to have a Division Director who has no idea who you are, what you do, or how critical your job functions are, with them instead delegating those responsibilities to an ever-growing army of middle management while raking in multiple hundreds of thousands of dollars annually. The culture was one of the few things that made BAYADA a competitive employer. Without it, what's the point?",
                "helpful": "Be the first to find this review helpful"
            },
            {
                "title": "Office directors have lost confidence in CEO’s leadership",
                "author_info": "Jul 19, 2023 - Director",
                "rating": "3.0",
                "pros": "I love running my local office but corporate puts many restrictions on us from improving.",
                "cons": "The local office and the corporate office is suppose to share the same beliefs but this isn’t the case. No matter how much the local offices try to change for the better, the corporate office will not allow it. Local offices are at a breaking point staffing wise. Corporate office’s only concern is money. Our office has had to furlough several office positions due to costs but the CEO’s salary has increased hundreds of thousands of dollars a year for the past several years straight. CEO has received over a million dollar pay increase in past two years. Meanwhile, Bayada morale is at its lowest I’ve ever seen in my decade of working for Bayada. We need new leadership! One that lives by the Bayada beliefs that “Our employees are our greatest asset.” We need a leader with more qualifications than just sharing the same last name as the company founder.",
                "helpful": "1 person found this review helpful"
            },
            {
                "title": "One of the best",
                "author_info": "Jul 21, 2023 - Accounting Associate III",
                "rating": "4.0",
                "pros": "Bayada goes out of its way to treat both its clients and employees with compassion. I love my job and continue to look forward to working with Bayada every day.",
                "cons": "Several software platforms used to complete different tasks and retrieve information",
                "helpful": "Be the first to find this review helpful"
            },
            {
                "title": "Good company",
                "author_info": "Jul 23, 2023 - Registered Nurse",
                "rating": "4.0",
                "pros": "Flexible schedule, great kids, not as stressful as hospitals or nursing homes.",
                "cons": "Sometimes not enough hours, some days too much down time.",
                "helpful": "Be the first to find this review helpful"
            }
        ]
    }
}
