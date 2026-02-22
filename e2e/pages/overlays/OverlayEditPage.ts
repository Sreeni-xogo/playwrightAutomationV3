import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Overlay edit/create page — /en/overlays/:id for edit, /en/overlays/add for new
// Contains: name field, resolution picker, quick-start layout templates, and a canvas preview area
// Resolution field includes a hidden combo showing e.g. "1920 x 1080 - Full HD"
export class OverlayEditPage extends BasePage {
  readonly pageHeading: Locator;
  readonly addNewPageHeading: Locator;
  readonly goBackButton: Locator;
  readonly saveButton: Locator;
  // AIDEV-NOTE: Overlay Details section heading
  readonly overlayDetailsSectionHeading: Locator;
  readonly overlayNameInput: Locator;
  // AIDEV-NOTE: Resolution section — clicking the "Show popup" button opens a resolution picker
  readonly resolutionLabel: Locator;
  readonly resolutionPickerButton: Locator;
  readonly resolutionHelpButton: Locator;
  // AIDEV-NOTE: Quick Start Templates let the user choose a preset layout structure
  readonly quickStartSectionHeading: Locator;
  readonly fullScreenTemplateButton: Locator;
  readonly topBarTemplateButton: Locator;
  readonly bottomBarTemplateButton: Locator;
  readonly halfLeftTemplateButton: Locator;
  readonly pictureInPictureTemplateButton: Locator;
  readonly halfRightTemplateButton: Locator;
  readonly showMoreTemplatesButton: Locator;
  // AIDEV-NOTE: Canvas preview area shows aspect ratio info e.g. "Aspect Ratio: 16:9 (Landscape)"
  readonly aspectRatioInfo: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Edit Overlay', level: 1 });
    this.addNewPageHeading = page.getByRole('heading', { name: 'Add New Overlay', level: 1 });
    this.goBackButton = page.getByRole('button', { name: 'Go back' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.overlayDetailsSectionHeading = page.getByRole('heading', { name: 'Overlay Details', level: 2 });
    // AIDEV-NOTE: Name input uses placeholder "Enter overlay name"
    this.overlayNameInput = page.getByRole('textbox', { name: 'Name' });
    this.resolutionLabel = page.getByText('Resolution');
    this.resolutionPickerButton = page.getByRole('button', { name: 'Show popup' });
    this.resolutionHelpButton = page.getByRole('button', { name: 'Open resolution help' });
    this.quickStartSectionHeading = page.getByRole('heading', { name: 'Quick Start Templates', level: 3 });
    this.fullScreenTemplateButton = page.getByRole('button', { name: 'Full Screen Single full-screen surface' });
    this.topBarTemplateButton = page.getByRole('button', { name: 'Top Bar Header or notification bar' });
    this.bottomBarTemplateButton = page.getByRole('button', { name: 'Bottom Bar Footer or ticker bar' });
    this.halfLeftTemplateButton = page.getByRole('button', { name: 'Half Left Left 50% split screen' });
    this.pictureInPictureTemplateButton = page.getByRole('button', { name: 'Picture-in-Picture Main content with corner widget' });
    this.halfRightTemplateButton = page.getByRole('button', { name: 'Half Right Right 50% split screen' });
    this.showMoreTemplatesButton = page.getByRole('button', { name: 'Show More' });
    // AIDEV-NOTE: Aspect ratio text is rendered below the canvas preview
    this.aspectRatioInfo = page.getByText('Aspect Ratio:');
  }

  async goto(overlayId: string): Promise<void> {
    await this.navigate(`/en/overlays/${overlayId}`);
    await this.waitForLoad();
  }

  async gotoAddNew(): Promise<void> {
    await this.navigate('/en/overlays/add');
    await this.waitForLoad();
  }

  async goBack(): Promise<void> {
    await this.goBackButton.click();
  }

  async setOverlayName(name: string): Promise<void> {
    await this.overlayNameInput.clear();
    await this.overlayNameInput.fill(name);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async clickResolutionPicker(): Promise<void> {
    await this.resolutionPickerButton.click();
  }

  async clickFullScreenTemplate(): Promise<void> {
    await this.fullScreenTemplateButton.click();
  }

  async clickTopBarTemplate(): Promise<void> {
    await this.topBarTemplateButton.click();
  }

  async clickBottomBarTemplate(): Promise<void> {
    await this.bottomBarTemplateButton.click();
  }

  async clickShowMoreTemplates(): Promise<void> {
    await this.showMoreTemplatesButton.click();
  }

  async verifyOnEditPage(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyOnAddNewPage(): Promise<void> {
    await expect(this.addNewPageHeading).toBeVisible();
  }

  async verifyOverlayName(expectedName: string): Promise<void> {
    await expect(this.overlayNameInput).toHaveValue(expectedName);
  }

  async verifySaveButtonVisible(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
  }

  async verifyQuickStartTemplatesVisible(): Promise<void> {
    await expect(this.quickStartSectionHeading).toBeVisible();
  }

  async verifyAspectRatioInfoVisible(): Promise<void> {
    await expect(this.aspectRatioInfo).toBeVisible();
  }
}
