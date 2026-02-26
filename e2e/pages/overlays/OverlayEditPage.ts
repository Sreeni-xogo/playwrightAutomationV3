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
  // AIDEV-NOTE: Canvas image/background button — in div.absolute.top-3.right-3 over the canvas container
  // On create page: only 1 button (background upload). On edit page: 2 buttons (zone edit + delete).
  // .first() = background upload on create page; zone image button on edit page.
  readonly canvasImageButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Edit Overlay', level: 1 });
    // AIDEV-NOTE: Add New page heading is "Create Overlay" (not "Add New Overlay")
    this.addNewPageHeading = page.getByRole('heading', { name: 'Create Overlay', level: 1 });
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
    // AIDEV-NOTE: Canvas action buttons float in div.absolute.top-3.right-3 over the canvas container
    // Create page: 1 button (background image upload). Edit page: 2 buttons (zone edit + delete).
    this.canvasImageButton = page.locator('div.absolute.top-3.right-3').locator('button').first();
  }

  async goto(overlayId: string): Promise<void> {
    await this.navigate(`/en/overlays/${overlayId}`);
    await this.waitForLoadAndElement(this.pageHeading);
  }

  async gotoAddNew(): Promise<void> {
    await this.navigate('/en/overlays/add');
    await this.waitForLoadAndElement(this.addNewPageHeading);
  }

  async goBack(): Promise<void> {
    await this.goBackButton.click();
    await this.waitForLoad();
  }

  async setOverlayName(name: string): Promise<void> {
    // AIDEV-NOTE: networkidle required before fill() — Vue v-model not updated otherwise (PATTERN-001)
    await this.page.waitForLoadState('networkidle');
    await this.overlayNameInput.clear();
    await this.overlayNameInput.fill(name);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  // AIDEV-NOTE: When a zone has no URL set, save shows "Web Surfaces Missing URLs" dialog.
  // Click "Continue Anyway" to proceed — the URL-less zone is dropped, the rest saves normally.
  async saveAndConfirm(): Promise<void> {
    await this.saveButton.click();
    const continueButton = this.page.getByRole('button', { name: 'Continue Anyway' });
    try {
      await continueButton.waitFor({ state: 'visible', timeout: 3000 });
      await continueButton.click();
    } catch {
      // No dialog appeared — save proceeded without needing confirmation
    }
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

  // AIDEV-NOTE: Overlay save requires at least one web surface or background image (PATTERN-013)
  // The canvas image button (top-right of canvas) opens a file chooser for uploading a background image.
  // This satisfies the "must contain at least one web surface or background image" validation.
  async uploadCanvasBackground(imagePath: string): Promise<void> {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.canvasImageButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(imagePath);
    // Wait for canvas to render the uploaded image
    await this.page.waitForLoadState('networkidle');
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
