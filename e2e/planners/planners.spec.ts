import { test, expect } from '@playwright/test';
import { PlannersPage } from '../pages/planners/PlannersPage';
import { PlannerEditPage } from '../pages/planners/PlannerEditPage';
import { isFree } from '../utils/tierGuard';

// AIDEV-NOTE: Requires authenticated session — setup saves .auth/state.json, consumed here
test.use({ storageState: '.auth/state.json' });
// AIDEV-NOTE: Free tier — /en/planners redirects to /en/upgrade. Tests assert redirect; Pro runs full CRUD.

const PLANNER_NAME = `AutoTest Planner ${Date.now()}`;
const PLANNER_UPDATED_NAME = `AutoTest Planner Updated ${Date.now()}`;

// ---------------------------------------------------------------------------
// Planners — List
// ---------------------------------------------------------------------------

test.describe('Planners — list page', () => {
  test('should display page heading', async ({ page }) => {
    const plannersPage = new PlannersPage(page);
    if (isFree()) {
      await page.goto('/en/planners');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await plannersPage.goto();
    await plannersPage.verifyOnPlannersPage();
  });

  test('should display Add New link', async ({ page }) => {
    const plannersPage = new PlannersPage(page);
    if (isFree()) {
      await page.goto('/en/planners');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await plannersPage.goto();
    await plannersPage.verifyAddNewLinkVisible();
  });

  test('should navigate to Add New planner page', async ({ page }) => {
    const plannersPage = new PlannersPage(page);
    if (isFree()) {
      await page.goto('/en/planners');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await plannersPage.goto();
    await plannersPage.clickAddNew();
    await expect(page).toHaveURL('/en/planners/add');
  });
});

// ---------------------------------------------------------------------------
// Planners — CRUD
// ---------------------------------------------------------------------------

// AIDEV-NOTE: Serial required — CRUD tests share PLANNER_NAME/PLANNER_UPDATED_NAME and depend on prior test state
test.describe.serial('Planners — CRUD', () => {
  test('create: should create a new planner', async ({ page }) => {
    const plannerEditPage = new PlannerEditPage(page);
    if (isFree()) {
      await page.goto('/en/planners/add');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await plannerEditPage.gotoAddNew();
    await plannerEditPage.verifyOnAddNewPage();
    await plannerEditPage.setPlannerName(PLANNER_NAME);
    // AIDEV-NOTE: PATTERN-011 — Save disabled until a playlist is assigned; add one first
    await plannerEditPage.addOnePlaylistFromDialog();
    await plannerEditPage.save();
    // AIDEV-NOTE: Save navigates to edit page at /en/planners/:id (PATTERN-002)
    await page.waitForURL((url) => url.pathname.includes('/en/planners/') && !url.pathname.endsWith('/add'), { timeout: 10000 });
    expect(page.url()).toContain('/en/planners');
  });

  test('create: new planner page should display calendar and Manage Playlists button', async ({ page }) => {
    const plannerEditPage = new PlannerEditPage(page);
    if (isFree()) {
      await page.goto('/en/planners/add');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await plannerEditPage.gotoAddNew();
    await plannerEditPage.verifyManagePlaylistsVisible();
    await plannerEditPage.verifySaveButtonVisible();
    await plannerEditPage.verifyNoPlaylistsText();
  });

  test('edit: should rename the created planner', async ({ page }) => {
    const plannersPage = new PlannersPage(page);
    const plannerEditPage = new PlannerEditPage(page);
    if (isFree()) {
      await page.goto('/en/planners');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await plannersPage.goto();
    await plannersPage.verifyPlannerVisible(PLANNER_NAME);
    await plannersPage.clickPlanner(PLANNER_NAME);
    await plannerEditPage.verifyOnEditPage();
    await plannerEditPage.setPlannerName(PLANNER_UPDATED_NAME);
    await plannerEditPage.save();
    await plannersPage.goto();
    await plannersPage.verifyPlannerVisible(PLANNER_UPDATED_NAME);
  });

  test('edit: should toggle Select All Days checkbox', async ({ page }) => {
    const plannersPage = new PlannersPage(page);
    const plannerEditPage = new PlannerEditPage(page);
    if (isFree()) {
      await page.goto('/en/planners');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await plannersPage.goto();
    await plannersPage.clickPlanner(PLANNER_UPDATED_NAME);
    await plannerEditPage.verifyOnEditPage();
    await plannerEditPage.toggleSelectAllDays();
    await expect(plannerEditPage.selectAllDaysCheckbox).toBeChecked();
    // Toggle off
    await plannerEditPage.toggleSelectAllDays();
    await expect(plannerEditPage.selectAllDaysCheckbox).not.toBeChecked();
  });

  test('delete: should delete the planner', async ({ page }) => {
    const plannersPage = new PlannersPage(page);
    if (isFree()) {
      await page.goto('/en/planners');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await plannersPage.goto();
    await page.waitForLoadState('networkidle');
    const optionsBtn = plannersPage.getOptionsButtonForPlanner(PLANNER_UPDATED_NAME);
    await optionsBtn.click();
    // AIDEV-NOTE: Trash icon opens a dialog with "Are you sure?" — scope Delete button to dialog to avoid matching other trash buttons
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    await dialog.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('heading', { name: PLANNER_UPDATED_NAME, level: 5 })).not.toBeVisible({ timeout: 10000 });
  });
});
