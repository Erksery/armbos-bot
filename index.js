const puppeteer = require("puppeteer");

const login = `532310-000011${59}`; //логин: поменять 59
const password = `${353621}`; //пароль: поменять 353621
const browserPath = "C:/Program Files/Google/Chrome/Application/chrome.exe"; //путь до браузера(другие браузеры могут не работать, не проверял)
const searchUrl = `https://53.armbos.ru/test_passages/58372`; //ссылка на сайт

const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: false,
  });

  const page = await browser.newPage();

  page.on("console", (msg) => {
    console.log(`Message from page: ${msg.text()}`);
  });

  try {
    await page.goto(searchUrl, { waitUntil: "networkidle0", timeout: 60000 });

    const loginInput = "#test_user_login";
    const passwordInput = "#test_user_password";
    const submitButton = "button.btn.btn-primary.btn-block";
    const startTestLink = "a.btn.btn-primary.start-test-btn";
    const beginSurveyLink = "a.btn.btn-primary.w-100";
    const answerButtonSelector =
      "button.btn.btn-outline-primary.test-passage-answer-variant-btn";
    const confirmButtonSelector =
      "button[data-bind='click: confirmAnswer, enabled: answerSelected']";

    await page.waitForSelector(loginInput);
    await page.type(loginInput, login, { delay: 100 });

    await waitFor(200);

    await page.waitForSelector(passwordInput);
    await page.type(passwordInput, password, { delay: 100 });

    await page.waitForSelector(submitButton);
    await page.click(submitButton);

    await waitFor(1000);

    await page.waitForSelector(startTestLink);
    await page.click(startTestLink);

    await waitFor(1000);

    if (await page.$(beginSurveyLink)) {
      await page.waitForSelector(beginSurveyLink);
      await page.click(beginSurveyLink);
      await waitFor(1000);
    }

    while (true) {
      await page.waitForSelector(answerButtonSelector);
      const buttons = await page.$$(answerButtonSelector);

      if (buttons.length > 0) {
        const randomIndex = Math.floor(Math.random() * buttons.length);
        const randomButton = buttons[randomIndex];

        await randomButton.click();

        await waitFor(100);

        await page.waitForSelector(confirmButtonSelector);
        await page.click(confirmButtonSelector);

        console.log("Ответ подтвержден");

        await waitFor(100);
      } else {
        console.log("Кнопки для выбора ответа не найдены.");
        break;
      }
    }
  } catch (error) {
    console.error("Произошла ошибка:", error);
  }

  // await browser.close();
})();
