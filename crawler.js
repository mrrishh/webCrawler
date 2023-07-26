const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const port = 8080;

const htmlDOM = {
    glassDoor : 
        {
          _parent: 'div.gdReview',
          title: '.mb-xxsm',
          author_info: '.common__EiReviewDetailsStyle__newUiJobLine .middle.common__EiReviewDetailsStyle__newGrey',
          rating: 'span.ratingNumber',
          pros: 'span[data-test=pros]',
          cons: 'span[data-test=cons]',
          helpful: 'div.common__EiReviewDetailsStyle__socialHelpfulcontainer'
        },  
      yelp: 
        {
          _parentID: 'reviews',
          author_info: 'fs-block.css-ux5mu6',
          date_info: 'span[css-chan6m]',
          rating: '',
          comment: 'div#expander-link-content-:rf: span[raw__09f24__T4Ezm]'
        }
      }
    

async function crawlURLGlassDoor(payload) {
  try {
    //Replace the executable chrome path. This is my mac's path
    const browser = await puppeteer.launch({ headless: "new", executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome' });

    const page = await browser.newPage();

    let pageStatus = await page.goto(payload.url, { timeout: 0 });

    pageStatus = pageStatus.status();
    if (pageStatus != 404) {
      console.log(`HTTP response status code 200 OK.`);
    };

    // Listen for console messages in the browser context
    page.on('console', (message) => {
      console.log('Console Message:', message.text());
    });

    // Wait for the review elements to load
    await page.waitForSelector(payload.htmlDom._parent, { timeout: 5000 });
    const reviews = await page.evaluate((parse) => {
      const reviewElements = document.querySelectorAll(parse._parent);
      const reviews = [];
      for (const element of reviewElements) {
        const review = {};
        for (const key in parse) {
          if (key === '_parent') continue;
          const selector = parse[key];
          review[key] = element.querySelector(selector) ? element.querySelector(selector).textContent.trim() : '';
        }
          reviews.push(review);
      }

      return reviews;
    }, payload.htmlDom);

    await browser.close();

    //Filter reviews based on filter date
    if (payload.filterDate !==null) {
      let filteredReviews = reviews.filter(review => isReviewDateAfterFilterDate(review.author_info, payload.filterDate))
      return {
        review_count: filteredReviews.length,
        aggregated_reviews: filteredReviews
      };
    }

    return {
      review_count: reviews.length,
      aggregated_reviews: reviews
    };

  } catch (error) {
    throw error;
  }

}

async function crawlURLYelp(payload) {
  try {
    const browser = await puppeteer.launch({ headless: "new", executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome' });
    console.log("Browser Launched Yelp");

    const page = await browser.newPage();
    let pageStatus = await page.goto(payload.url, { timeout: 0 });

    pageStatus = pageStatus.status();
    if (pageStatus !== 404) {
      console.log(`HTTP response status code 200 OK.`);
    }

    // Listen for console messages in the browser context
    page.on('console', (message) => {
      console.log('Console Message:', message.text());
    });

    // Wait for the review elements to load
    await page.waitForSelector('div.border-color--default__09f24__NPAKY#reviews', { timeout: 10000 });

    const reviews = await page.evaluate((payload) => {
      function extractDataFromSelector(selector) {
        const element = document.querySelector(selector);
        if (element) {
          return element.textContent.trim();
        }
        return '';
      }

      const reviewElements = document.querySelectorAll(`#${payload._parentID}`);
      const reviews = [];

      for (const element of reviewElements) {
        const review = {};
        for (const key in payload) {
          if (key === '_parentID') continue;
          const selector = payload[key];
          review[key] = extractDataFromSelector(selector);
        }

        reviews.push(review);
      }

      return reviews;
    }, payload.htmlDom);

    await browser.close();
    return reviews;

  } catch (error) {
    throw error;
  }
}


function extractDateFromDateText(dateText) {
  const dateRegex = /(\w{3}\s\d{1,2},\s\d{4})/;
  const match = dateText.match(dateRegex);

  if (match) {
    const dateString = match[1];
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC
    return date.toISOString();
  }

  return null;
}

function isReviewDateAfterFilterDate(authorInfo, filterDate) {
  const reviewDate = extractDateFromDateText(authorInfo);
  if (!reviewDate || !filterDate) {
    return false;
  }

  const reviewDateUTC = new Date(reviewDate);
  const filterDateUTC = new Date(filterDate);
  filterDateUTC.setUTCHours(0, 0, 0, 0);
  return reviewDateUTC >= filterDateUTC;
}




app.get('/crawl', async (req, res) => {
  try {
    if(req.query.source === "glassdoor"){
      let payload = {
        url : req.query.url,
        htmlDom : htmlDOM.glassDoor,
        filterDate : req.query.filter_date ? req.query.filter_date : null
      }
      let reviews = await crawlURLGlassDoor(payload);
      res.json({ result: reviews });
    }else if(req.query.source === "yelp"){
      let payload = {
        url : req.query.url,
        htmlDom : htmlDOM.yelp,
        filterDate : req.query.filter_date ? req.query.filter_date : null
      }
      let reviews = await crawlURLYelp(payload);
      res.json({ result: reviews });
    }else{
      res.status(400).json({ error: 'Invalid Souce Provided'});
    }
    
  } catch (error) {
    console.error('Error crawling the URL:', error.message);
    res.status(500).json({ error: 'Error crawling the URL', message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

