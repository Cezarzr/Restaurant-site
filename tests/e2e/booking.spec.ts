import { test, expect } from '@playwright/test';

test('booking form submits', async ({ page }) => {
  await page.goto('/book');
  await page.getByPlaceholder('name').fill('Playwright User');
  await page.getByPlaceholder('email').fill('pw@example.com');
  await page.getByPlaceholder('phone').fill('1234567890');
  await page.getByPlaceholder('eventDate').fill('2026-04-01T12:00');
  await page.getByPlaceholder('address').fill('1 Main St');
  await page.getByRole('button', { name: 'Submit booking' }).click();
  await expect(page.getByText(/Booking submitted|conflict warning/i)).toBeVisible();
});
