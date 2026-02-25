import { test, expect } from '@playwright/test';
import { PlannersPage } from '../pages/planners/PlannersPage';
import { PlannerEditPage } from '../pages/planners/PlannerEditPage';

const PLANNER_NAME = `AutoTest Planner ${Date.now()}`;
const PLANNER_UPDATED_NAME = `AutoTest Planner Updated ${Date.now()}`;

// ---------------------------------------------------------------------------
// Planners — List
// ---------------------------------------------------------------------------

test.describe('Planners — list page', () => {
  test('should display page heading', async ({ page }) => {
    const plannersPage = new PlannersPage(page);
    await plannersPage.goto();
    await plannersPage.verifyOnPlannersPage();
  });

  test('should display Add New link', async ({ page }) => {
    const plannersPage = new PlannersPage(page);
    await plannersPage.goto();
    await plannersPage.verifyAddNewLinkVisible();
  });

  test('should navigate to Add New planner page', async ({ page }) => {
    const plannersPage = new PlannersPage(page);
    await plannersPage.goto();
    await plannersPage.clickAddNew();
    await expect(page).toHaveURL('/en/planners/add');
  });
});

// ---------------------------------------------------------------------------
// Planners — CRUD
// ---------------------------------------------------------------------------

test.describe('Planners — CRUD', () => {
  test('create: should create a new planner', async ({ page }) => {
    const plannerEditPage = new PlannerEditPage(page);
    await plannerEditPage.gotoAddNew();
    await plannerEditPage.verifyOnAddNewPage();
    await plannerEditPage.setPlannerName(PLANNER_NAME);
    await plannerEditPage.save();
    expect(page.url()).toContain('/en/planners');
  });

  test('create: new planner page should display calendar and Manage Playlists button', async ({ page }) => {
    const plannerEditPage = new PlannerEditPage(page);
    await plannerEditPage.gotoAddNew();
    await plannerEditPage.verifyManagePlaylistsVisible();
    await plannerEditPage.verifySaveButtonVisible();
    await plannerEditPage.verifyNoPlaylistsText();
  });

  test('edit: should rename the created planner', async ({ page }) => {
    const plannersPage = new PlannersPage(page);
    const plannerEditPage = new PlannerEditPage(page);
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
    await plannersPage.goto();
    const optionsBtn = plannersPage.getOptionsButtonForPlanner(PLANNER_UPDATED_NAME);
    await optionsBtn.click();
    const deleteOption = page.getByRole('menuitem', { name: 'Delete' }).or(
      page.getByRole('button', { name: 'Delete' })
    );
    await deleteOption.click();
    const confirmButton = page.getByRole('button', { name: 'Delete' }).last();
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    await expect(page.getByRole('heading', { name: PLANNER_UPDATED_NAME, level: 5 })).not.toBeVisible({ timeout: 10000 });
  });
});
