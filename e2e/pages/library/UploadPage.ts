import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: UploadPage represents /en/library/upload — a dedicated full page (not a modal).
// It is reached by clicking Add New > Media in the Library page.
// Supports drag-and-drop zone and a "Choose File" button for file selection.
// The Upload button is disabled until a file is staged.
export class UploadPage extends BasePage {
  // --- Page heading ---
  readonly pageHeading: Locator;

  // --- Navigation ---
  readonly goBackButton: Locator;

  // --- Upload form elements ---
  // AIDEV-NOTE: The drag-drop zone is a button; its accessible name includes the allowed file types
  readonly dropZone: Locator;

  // AIDEV-NOTE: "or click to browse" is a nested button inside the drop zone
  readonly browseButton: Locator;

  // AIDEV-NOTE: "Choose File" is a separate button below the drop zone (alternative file picker)
  readonly chooseFileButton: Locator;

  // AIDEV-NOTE: Upload button is disabled until a file has been staged in the drop zone
  readonly uploadButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: 'Media Upload', level: 1 });

    this.goBackButton = page.getByRole('button', { name: 'Go back' });

    // AIDEV-NOTE: The drop zone button accessible name starts with "Drag and drop here..."
    this.dropZone = page.getByRole('button', {
      name: 'Drag and drop here to add your file Allowed file types: .png, .jpg, .jpeg, .mp4, .mov or click to browse',
    });

    this.browseButton = page.getByRole('button', { name: 'or click to browse' });

    this.chooseFileButton = page.getByRole('button', { name: 'Choose File' });

    this.uploadButton = page.getByRole('button', { name: 'Upload' });
  }

  // --- Navigation ---

  async goto(): Promise<void> {
    await this.navigate('/en/library/upload');
    await this.waitForLoadAndElement(this.pageHeading);
  }

  // Navigate back to Library using the Go back button
  async goBack(): Promise<void> {
    await this.goBackButton.click();
    // AIDEV-NOTE: SPA nav — waitForLoad fires before route change; waitForURL polls until arrival
    await this.page.waitForURL((url) => url.pathname.includes('/en/library'), { timeout: 10000 });
  }

  // --- Upload actions ---

  // AIDEV-NOTE: setInputFiles requires the hidden file input element.
  // The drop zone button does not expose a file input directly; use the page-level
  // file input locator which is triggered when the drop zone or browse button is clicked.
  async uploadFile(filePath: string): Promise<void> {
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
  }

  async clickUpload(): Promise<void> {
    await this.uploadButton.click();
  }

  async clickChooseFile(): Promise<void> {
    await this.chooseFileButton.click();
  }

  async clickBrowse(): Promise<void> {
    await this.browseButton.click();
  }

  // --- Verify methods ---

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.dropZone).toBeVisible();
    // AIDEV-NOTE: DIFF-06 — chooseFileButton absent on pre-prod; not asserted
  }

  async verifyUploadButtonDisabled(): Promise<void> {
    await expect(this.uploadButton).toBeDisabled();
  }

  async verifyUploadButtonEnabled(): Promise<void> {
    await expect(this.uploadButton).toBeEnabled();
  }

  async verifyGoBackButtonVisible(): Promise<void> {
    await expect(this.goBackButton).toBeVisible();
  }

  async verifyAllowedFileTypesText(): Promise<void> {
    await expect(
      this.page.getByText('Allowed file types: .png, .jpg, .jpeg, .mp4, .mov')
    ).toBeVisible();
  }
}
