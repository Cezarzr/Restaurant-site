import { test, expect } from '@playwright/test';

test('booking form submits', async ({ page }) => {
  await page.goto('/book');
  await page.getByLabel('name').fill('Playwright User');
  await page.getByLabel('email').fill('pw@example.com');
  await page.getByLabel('phone').fill('1234567890');
  await page.getByLabel('eventDate').fill('2026-04-01T12:00');
  await page.getByLabel('address').fill('1 Main St');
  await page.getByRole('button', { name: 'Submit booking' }).click();
  await expect(page.getByText(/Booking submitted|conflict warning/i)).toBeVisible();
});
