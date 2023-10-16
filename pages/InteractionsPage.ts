import { Page, BrowserContext, Locator, ElementHandle, expect } from '@playwright/test';
import { WebActions } from '../lib/WebActions';
import { exec } from 'child_process';

let webActions: WebActions;

export class InteractionsPage {
  readonly page: Page;
  readonly context: BrowserContext;
  readonly DRAGGABLE: Locator;
  readonly DROPPABLE: Locator;
  readonly DROPPABLE_HIGHLIGHTED;

  
  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    this.DRAGGABLE = page.locator('#draggable');
    this.DROPPABLE = page.locator('#droppable');
    this.DROPPABLE_HIGHLIGHTED = ".droppable-container .ui-state-highlight"
    webActions = new WebActions(this.page, this.context);
  }

  async verifyInitialState() {
    const dropText = await this.DROPPABLE.first().textContent();
    expect(dropText).toBe("Drop here")
    const isHighlightedAttached = await this.page.waitForSelector(this.DROPPABLE_HIGHLIGHTED, { state: 'attached',timeout: 1000}).catch(() => false);
    expect(isHighlightedAttached).toBe(false);
  }

  async dragAndDrop() {
    // Verify the initial state
    await this.verifyInitialState();
    // Perform the drag-and-drop action
    await this.DRAGGABLE.dragTo(this.DROPPABLE.first());
    const backgroundColor = await this.page.locator(this.DROPPABLE_HIGHLIGHTED).evaluate((el) => {
      const computedStyle = getComputedStyle(el);
      return computedStyle.getPropertyValue('background-color');
    });
    expect(backgroundColor).toBe("rgb(70, 130, 180)")
    const dropTextAfterDrop = await this.DROPPABLE.first().textContent();
    expect(dropTextAfterDrop).toBe("Dropped!");
    console.log("Droppable is highlighted and text is 'Dropped!' as expected.");
  }

  
}
