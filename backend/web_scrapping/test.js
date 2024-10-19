const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to read the URLs from alimentacion.txt
async function getNutritionLinks() {
    try {
        const data = fs.readFileSync('alimentacion.txt', 'utf8');
        const links = JSON.parse(data);  // Ensure the file is properly formatted JSON array
        return links;
    } catch (error) {
        console.error('Error reading the file:', error);
        return [];
    }
}

// Scrape the content of the page
async function scrape(url) {
    const browser = await puppeteer.launch({
        args: ['--disable-http2'],
        headless: false,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const body = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('body')).map(div => div.innerText);
    });
    let result = "";
    body.forEach((div) => {
        result += " " + div;
    });
    result = result.replace(/\s+/g, ' ');  // Normalize whitespace
    result = result.toLowerCase();  // Convert text to lowercase
    console.log(result);
    await browser.close();
    return result;
}

// Main function to scrape content from each link
async function main() {
    const links = await getNutritionLinks();  // Get links from the file
    let result = "";
    let count = 0;
    for (const link of links) {
        try {
            result += await scrape(link);
            count++;
            if (count >= 300) {  // Limit the scraping to the first 10 links (adjust as needed)
                break;
            }
        } catch (err) {
            console.error(`Error scraping ${link}:`, err);
        }
    }

    // Save the result to Output.txt
    fs.appendFile('Output.txt', result, (err) => {
        if (err) throw err;
        console.log('Content appended to file.');
    });

    return result;
}

// Express route to trigger the scraping process
app.post('/scrape', async (req, res) => {
    try {
        const result = await main();
        // Send the result to another API (optional)
        const jsonObject = {
            model: "summary",
            values: {
                prompt: result,
                category: "alimentacion saludable",
                information_context: "Promover una buena alimentación es esencial",
                user_context: "El usuario quiere aprender más sobre alimentación saludable"
            }
        };
        const apiResponse = await axios.post('http://127.0.0.1:8000/model/selection/publish/web_scraping', jsonObject);
        console.log("Response from target API:", apiResponse.data);
        res.status(200).send(apiResponse.data);
    } catch (err) {
        console.error('Error occurred while scraping:', err);
        res.status(500).send('Error occurred while scraping.');
    }
});

// Start the Express server and run the main function
app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    try {
        // Make a request to the /scrape endpoint after initial scraping
        const response = await axios.post(`http://localhost:${port}/scrape`);
        console.log('Response from /scrape endpoint:', response.data);
    } catch (err) {
        console.error('Error occurred during initial scraping:', err);
    }
});
