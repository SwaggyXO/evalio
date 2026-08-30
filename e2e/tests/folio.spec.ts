import { expect, test } from '@playwright/test';

const shot = { fullPage: true, animations: 'disabled' as const };

test.describe('evalio', () => {
  test('work item list', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('work-item-list')).toBeVisible();
    await expect(page).toHaveScreenshot('list.png', shot);
  });

  test('work item detail', async ({ page }) => {
    await page.goto('/items/ENG-101');
    await expect(page.getByTestId('work-item')).toBeVisible();
    await expect(page).toHaveScreenshot('work-item.png', shot);
  });

  test('ready brief', async ({ page }) => {
    await page.goto('/items/ENG-101/brief');
    await expect(page.getByTestId('brief')).toBeVisible();
    await expect(page.getByText('Agent-ready')).toBeVisible();
    await expect(page).toHaveScreenshot('brief-ready.png', shot);
  });

  test('conflict brief', async ({ page }) => {
    await page.goto('/items/ENG-102/brief');
    await expect(page.getByTestId('not-ready')).toBeVisible();
    await expect(page.getByText('Architecture pages disagree')).toBeVisible();
    await expect(page).toHaveScreenshot('brief-conflict.png', shot);
  });

  test('wrong-source brief', async ({ page }) => {
    await page.goto('/items/ENG-103/brief');
    await expect(page.getByTestId('brief')).toBeVisible();
    await expect(page.getByText('Wrong source').first()).toBeVisible();
    await expect(page).toHaveScreenshot('brief-wrong-source.png', shot);
  });

  test('empty search', async ({ page }) => {
    await page.goto('/search?q=zzzz-no-such-page');
    await expect(page.getByTestId('empty')).toBeVisible();
    await expect(page).toHaveScreenshot('empty.png', shot);
  });

  test('api down', async ({ page }) => {
    await page.route('**/api/**', (route) => route.abort());
    await page.goto('/');
    await expect(page.getByTestId('api-down')).toBeVisible();
    await expect(page).toHaveScreenshot('api-down.png', shot);
  });
});
