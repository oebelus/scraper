import puppeteer, { Page } from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";

class Scraper {
  public async scrape(
    category: string,
    url: string,
    pages: number,
    n?: number
  ) {
    puppeteerExtra.use(Stealth());

    const browser = await puppeteer.launch({
      headless: true,
    });

    try {
      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      );

      await page.goto(url, { waitUntil: "networkidle0" });

      let currentPage = 1;
      let allProducts: Product[] = [];

      while (currentPage <= pages) {
        await this.autoScroll(page);
        console.log("Scraping started...");

        const pageProducts: Product[] = await page.evaluate((cat) => {
          const productElements = Array.from(
            document.querySelectorAll(".search-item-card-wrapper-gallery")
          );

          return productElements.map((product) => ({
            name: product.querySelector("h3")?.textContent?.trim() || "",
            url: product.querySelector("a")?.href || "",
            image: product.querySelector("img")?.src || "",
            category: cat,
            offers: [
              {
                storeName:
                  product
                    .querySelector(
                      "div.store-detail--storeNameWrap--Z45gRHH span.store-detail--storeName--Lk2FVZ4"
                    )
                    ?.textContent?.trim() || "",
                price:
                  product
                    .querySelector(
                      "div.price--current--I3Zeidd span.price--currentPriceText--V8_y_b5"
                    )
                    ?.textContent?.trim() || "",
                availability:
                  product
                    .querySelector(
                      ".div.comet-v2-input-number.quantity--picker--OaDgLYT"
                    )
                    ?.textContent?.trim() || "In Stock",
              },
            ],
            shipping: [
              {
                type:
                  product
                    .querySelector(".multi--serviceContainer--3vRdzWN")
                    ?.textContent?.trim() || "Not specified",
                cost:
                  product
                    .querySelector(".multi--serviceContainer--3vRdzWN")
                    ?.textContent?.trim() || "",
                duration:
                  product
                    .querySelector(
                      "div.dynamic-shipping-line.dynamic-shipping-contentLayout span"
                    )
                    ?.textContent?.trim() || "N/A",
              },
            ],
            rating: {
              rate:
                document
                  .querySelector(".rating--wrap--jg9uoRp")
                  ?.textContent?.trim() || "N/A",
              reviews:
                document
                  .querySelector(".reviewer--reviews--cx7Zs_V")
                  ?.textContent?.trim() || "N/A",
              sold:
                document
                  .querySelector(".reviewer--sold--ytPeoEy")
                  ?.textContent?.trim() || "N/A",
            },
          }));
        }, category);

        for (const product of pageProducts) {
          if (n && allProducts.length >= n) break;

          if (product.url) {
            const additionalData = await this.getProductDetails(
              page,
              product.url
            );

            Object.assign(product, additionalData);
          }

          allProducts.push(product);
        }

        if (n && allProducts.length >= n) break;

        allProducts.push(...pageProducts);

        if (n && allProducts.length >= n) break;

        if (currentPage < pages) {
          try {
            // Dynamic pagination selector
            const nextPageSelector = `.comet-pagination-item:not(.comet-pagination-item-active) a`;
            console.log(
              `Attempting to navigate with selector: ${nextPageSelector}`
            );

            // Wait for pagination elements
            await page.waitForSelector(".comet-pagination", { timeout: 5000 });

            // Evaluate pagination dynamically
            const canNavigate = await page.evaluate((selector) => {
              const nextPageElement = document.querySelector(selector);
              const paginationContainer =
                document.querySelector(".comet-pagination");

              // Log pagination context for debugging
              console.log("Pagination HTML:", paginationContainer?.innerHTML);

              return !!nextPageElement;
            }, nextPageSelector);

            if (!canNavigate) {
              console.log("No more pages available");
              break;
            }

            // Scroll and click the next page link
            await page.evaluate((selector) => {
              const element = document.querySelector(selector);
              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "nearest",
                });
              }
            }, nextPageSelector);

            // Wait for page load
            await page.waitForSelector(".search-item-card-wrapper-gallery", {
              timeout: 5000,
            });

            console.log(`Navigated to page ${currentPage + 1}`);
            currentPage++;
          } catch (navError) {
            console.error("Detailed Navigation Error:", navError);

            // Log additional context
            const paginationHTML = await page.evaluate(() => {
              const pagination = document.querySelector(".comet-pagination");
              return pagination ? pagination.outerHTML : "No pagination found";
            });
            console.log("Pagination HTML at error:", paginationHTML);

            break;
          }
        } else {
          break;
        }
      }

      console.log(
        "Scraping completed! " + allProducts.length + " products found."
      );

      return allProducts;
    } catch (error) {
      console.error("Scraping Failed:", error);
      return [];
    } finally {
      await browser.close();
    }
  }

  private async getProductDetails(
    page: Page,
    url: string
  ): Promise<Partial<Product>> {
    try {
      await page.goto(url, { waitUntil: "networkidle0" });

      const details = await page.evaluate(() => {
        return {
          shipping: [
            {
              type:
                document
                  .querySelector(".dynamic-shipping-titleLayout")
                  ?.textContent?.trim() || "Standard",
              cost:
                document
                  .querySelector(
                    ".dynamic-shipping .dynamic-shipping-titleLayout span strong"
                  )
                  ?.textContent?.trim() || "N/A",
              duration:
                document
                  .querySelector(
                    ".dynamic-shipping .dynamic-shipping-contentLayout span strong"
                  )
                  ?.textContent?.trim() || "N/A",
            },
          ],
          offers: [
            {
              storeName:
                document
                  .querySelector(".store-detail--storeName--Lk2FVZ4")
                  ?.textContent?.trim() || "N/A",
              price:
                document
                  .querySelector(".product-price-current")
                  ?.textContent?.trim() || "N/A",
              availability:
                document
                  .querySelector(".quantity--info--jnoo_pD div div")
                  ?.textContent?.trim() || "In Stock",
            },
          ],
          rating: {
            rate:
              document
                .querySelector(".rating--wrap--jg9uoRp")
                ?.textContent?.trim() || "N/A",
            reviews:
              document
                .querySelector(".reviewer--reviews--cx7Zs_V")
                ?.textContent?.trim() || "N/A",
            sold:
              document
                .querySelector(".reviewer--sold--ytPeoEy")
                ?.textContent?.trim() || "N/A",
          },
        };
      });

      return details;
    } catch (error) {
      console.error(`Error fetching details for ${url}:`, error);
      return {};
    }
  }

  private async autoScroll(page: Page) {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
}

export default Scraper;
