import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import * as cheerio from "cheerio";

async function openBrowser() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
    headless: true,
  });

  return {
    async openNewTab() {
      const page = await browser.newPage();

      return {
        async navigateTo(url: string) {
          await page.goto(url, { waitUntil: "networkidle0" });
          const html = await page.evaluate(() => document.body.innerHTML);
          const $ = cheerio.load(html);

          return {
            scrape: {
              firstMatch(selector: string) {
                return $(selector).first().text();
              },
              lastMatch(selector: string) {
                return $(selector).last().text();
              },
              allMatches(selector: string) {
                return $(selector).text();
              },
            },

            remove: {
              firstMatch(selector: string) {
                return $(selector).first().remove();
              },
              lastMatch(selector: string) {
                return $(selector).last().remove();
              },
              allMatches(selector: string) {
                return $(selector).remove();
              },
            },

            insertTextAtStartOfEachMatch(selector: string, text: string) {
              const elements = $(selector);

              elements.each((index, element) => {
                const originalText = $(element).text();
                $(element).text(`${text}${originalText}`);
              });
            },

            insertTextAtEndOfEachMatch(selector: string, text: string) {
              const elements = $(selector);

              elements.each((index, element) => {
                const originalText = $(element).text();
                $(element).text(`${originalText}${text}`);
              });
            },

            async type(selector: string, value: string) {
              await page.type(selector, value);
            },

            async click(selector: string) {
              await page.click(selector);
            },

            async waitForSelector(selector: string) {
              await page.waitForSelector(selector);
            },
          };
        },
      };
    },

    async close() {
      await browser.close();
    },
  };
}

const selectors = {
  byText(selector: string, text: string) {
    return `${selector}:contains("${text}")`;
  },
  firstChild(selector: string) {
    return `${selector}:first-child`;
  },
  lastChild(selector: string) {
    return `${selector}:last-child`;
  },
  or(...selectors: string[]) {
    return `:is(${selectors.join(", ")})`;
  },
  without(selector = null, notSelector: string) {
    if (selector == null) {
      return `:not(${notSelector})`;
    }
    return `${selector}:not(${notSelector})`;
  },
  attributeStartsWith(selector = null, attribute: string, text: string) {
    if (selector == null) {
      return `[${attribute}^="${text}"]`;
    }
    return `${selector}[${attribute}^="${text}"]`;
  },
  attributeEndsWith(selector = null, attribute: string, text: string) {
    if (selector == null) {
      return `[${attribute}$="${text}"]`;
    }
    return `${selector}[${attribute}$="${text}"]`;
  },
  attributeContains(selector = null, attribute: string, text: string) {
    if (selector == null) {
      return `[${attribute}~="${text}"]`;
    }
    return `${selector}[${attribute}~="${text}"]`;
  },
};

export const scraper = { openBrowser, selectors };