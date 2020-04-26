const dotenv = require('dotenv');
const fs = require('fs').promises;
const logger = require('pino')({ level: process.env.LOG_LEVEL || 'info' });
const puppeteer = require('puppeteer');
const _ = require('underscore');

dotenv.config();

(async () => {
    const username = process.env.ESSELUNGA_USERNAME;
    const password = process.env.ESSELUNGA_PASSWORD;

    const homeUrl = 'https://www.esselungaacasa.it/';
    const loginSelector = 'esselunga-welcome-header a[ng-click="$ctrl.login()"]';
    const usernameSelector = '#loginForm #gw_username';
    const passwordSelector = '#loginForm #gw_password';
    const loginButtonSelector = '#loginForm button[type="submit"]';
    const checkoutSelector = 'esselunga-checkout-widget #cassa';
    //const modalDialogOpenSelector = '#remodalDialog.remodal-is-opened';
    const modalDialogClosedSelector = '#remodalDialog.remodal-is-closed';
    const checkoutNextStepSelector = 'esselunga-checkout-wizard-navigator #checkoutNextStep';
    const selectSlotSelector = 'esselunga-slots input[type="radio"]';
    const selectAvailableSlotSelector = 'esselunga-slots input[type="radio"].disponibile';
    const nextSlotSelector = 'esselunga-slots .selezione a[ng-click="slotCtrl.next()"]';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(homeUrl);
    logger.debug(homeUrl);

    await page.waitForSelector(loginSelector);
    await page.click(loginSelector);
    logger.debug(loginSelector);

    await page.waitForSelector(usernameSelector);
    await page.waitForSelector(passwordSelector);
    await page.waitForSelector(loginButtonSelector);
    await page.type(usernameSelector, username);
    await page.type(passwordSelector, password);
    await page.click(loginButtonSelector);
    logger.debug(loginButtonSelector);

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitForSelector(checkoutSelector);
    await page.click(checkoutSelector);
    logger.debug(checkoutSelector);

    //await page.waitForSelector(modalDialogOpenSelector);
    //logger.debug(modalDialogOpenSelector);
    await page.waitForSelector(modalDialogClosedSelector);
    logger.debug(modalDialogClosedSelector);
    await page.waitForSelector(checkoutNextStepSelector);
    await page.click(checkoutNextStepSelector);
    logger.debug('step 1: %s', page.url());

    //await page.waitForSelector(modalDialogOpenSelector);
    //logger.debug(modalDialogOpenSelector);
    await page.waitForSelector(modalDialogClosedSelector);
    logger.debug(modalDialogClosedSelector);
    await page.waitForSelector(nextSlotSelector);
    for (let i = 0; i < 7; i++) {
        await page.click(nextSlotSelector);
    }
    await page.waitForSelector(selectSlotSelector);
    let classNames = await page.$$eval(selectSlotSelector, inputs => inputs.map(input => input.className));
    let countByClassName = _.countBy(classNames, _.identity);
    logger.info(countByClassName);
    logger.debug('step 2: %s', page.url());

    if (countByClassName['disponibile']) {
        let pageContent = await page.content();
        await fs.writeFile('content-' + new Date().toISOString(), pageContent);
        await page.waitForSelector(selectAvailableSlotSelector);
        await page.click(selectAvailableSlotSelector);
        await page.waitForSelector(checkoutNextStepSelector);
        await page.click(checkoutNextStepSelector);

        //await page.waitForSelector(modalDialogOpenSelector);
        //logger.debug(modalDialogOpenSelector);
        await page.waitForSelector(modalDialogClosedSelector);
        logger.debug(modalDialogClosedSelector);
        logger.debug('step 3: %s', page.url());

        await page.waitForSelector('a.btn.fast-checkout');
        await page.click('a.btn.fast-checkout');
        logger.debug('click a.btn.fast-checkout');

        //await page.waitForSelector(modalDialogOpenSelector);
        //logger.debug(modalDialogOpenSelector);
        await page.waitForSelector(modalDialogClosedSelector);
        logger.debug(modalDialogClosedSelector);
        logger.debug('step 4: %s', page.url());
    }

    await browser.close();
})().catch(reason => {
    logger.error(reason);
});
