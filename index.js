const https = require("https");
const http = require("http");

const url = "https://time.com";
function scrapeWebsite() {
  // Make an HTTP GET request to the website
  https
    .get(url, (response) => {
      let data = "";

      // A chunk of data has been received
      response.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received
      response.on("end", () => {
        // Start the HTTP server after processing the HTML
        startServer(data);
      });
    })
    .on("error", (error) => {
      console.error("Error fetching data:", error);
    });
}

// Function to start the HTTP server
function startServer(html) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });

    // Regular expression to extract href attribute value and content
    const regex =
      /<li[^>]*class="latest-stories__item"[^>]*>\s*<a[^>]*href="([^"]*)"[^>]*>\s*<h3[^>]*>(.*?)<\/h3>/gi;
    const data = [];

    // Find all matches
    let match;
    while ((match = regex.exec(html)) !== null) {
      const link = url + match[1];
      const title = match[2];
      data.push({ title, link });
    }

    // Send the extracted data as JSON
    res.end(JSON.stringify(data));
  });
  const port = 3000;
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/getTimeStories`);
  });
}
scrapeWebsite();
