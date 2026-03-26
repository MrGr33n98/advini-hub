// tests/e2e/login.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should allow valid user to login', async ({ page }) => {
    // Fill in credentials
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('password123');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for navigation or success state
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.locator('#email').fill('invalid@example.com');
    await page.locator('#password').fill('wrongpassword');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Wait for error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.getByText('Cadastre-se').click();
    await expect(page).toHaveURL('/signup');
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('#password');
    const toggleButton = page.locator('button').filter({ hasText: /eye/i });
    
    // Initially password should be masked
    await passwordInput.fill('password123');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click toggle to hide password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});