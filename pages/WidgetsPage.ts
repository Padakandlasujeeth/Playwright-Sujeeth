import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '../lib/WebActions';

let webActions: WebActions;

export class WidgetsPage {
  readonly page: Page;
  readonly context: BrowserContext;
  readonly progressBar: Locator;
  readonly startStopButton: Locator;
  readonly resetButton: Locator;
  readonly TOOLTIP_BUTTON;
  readonly TOOLTIP_TEXT;

  
  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    this.progressBar = page.locator('#progressBar');
    this.startStopButton = page.locator('#startStopButton');
    this.resetButton = page.locator('#resetButton');
    this.TOOLTIP_BUTTON = "#toolTipButton"
    this.TOOLTIP_TEXT = ".tooltip-inner"
    webActions = new WebActions(this.page, this.context);
  }

  async verifyInitialState() {
    await this.progressBar.isVisible();
    const progressBarText = await this.progressBar.locator('div').innerText();
    expect(progressBarText === "" || progressBarText === "0%").toBe(true); // Initial state should be 0%
    await this.startStopButton.isVisible(); // Start button should be visible
    expect(await this.startStopButton.textContent()).toBe("Start")
    expect(await this.resetButton.isVisible()).toBeFalsy()
  }


  async testProgressBar() {
    // Verify initial state
    await this.verifyInitialState();

    // Click Start button
    await this.startStopButton.click();
    
    // Wait for the progress to start
    await this.page.waitForTimeout(5000); // Adjust the timeout if needed

    // Get progress percentage
    const progressPercentage = await this.progressBar.locator('div').innerText();

    //Check if progress is not in initial state
    await expect(progressPercentage !== "" && progressPercentage !== "0%").toBe(true);

    // Click Stop button
    await this.startStopButton.isVisible();
    expect(await this.startStopButton.textContent()).toBe("Stop")
    await this.startStopButton.click();

    // Click Start button again
    await this.page.waitForTimeout(2000)
    expect(await this.startStopButton.textContent()).toBe("Start")
    await this.startStopButton.click();
    await this.page.waitForSelector('div[style="width: 100%;"]'); // Wait for the progress to reach 100%


    // Get progress percentage
    const progress2= await this.progressBar.locator('div').innerText();

    //Check if progress reached end
    expect(progress2).toBe("100%")

    // Click Reset button
    await this.resetButton.isVisible();
    expect(await this.resetButton.textContent()).toBe("Reset")
    await this.resetButton.click()

    // Verify progress is reset
    await this.verifyInitialState();
  }

  async verifyTooltip(expectedToolTipText){
    webActions.hoverOverElement(this.page,this.TOOLTIP_BUTTON)
    const isTooltipVisible = await this.page.waitForSelector(this.TOOLTIP_TEXT);
    expect(isTooltipVisible).toBeTruthy()
    const tooltipText = await webActions.getTooltipText(this.page, this.TOOLTIP_TEXT);
    console.log('Tooltip text:', tooltipText);
    expect(tooltipText).toBe(expectedToolTipText)
  }
}
