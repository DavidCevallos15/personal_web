import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
});

test('cursor nativo en touch; punto y anillo solo con mouse', async ({ page }, info) => {
  await page.goto('/');
  if (info.project.name === 'mobile') {
    await expect(page.getByTestId('smart-cursor')).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveAttribute('data-cursor-on');
    await expect(page.getByTestId('footer-trail')).toHaveCount(0);
    await expect(page.getByTestId('head-tracker')).toHaveCount(0);
  } else {
    await expect(page.getByTestId('smart-cursor')).toHaveCount(1);
    await page.mouse.move(300, 150);
    await expect(page.locator('html')).toHaveAttribute('data-cursor-on', '');
    await page.keyboard.press('Tab');
    await expect(page.locator('html')).not.toHaveAttribute('data-cursor-on');
  }
});

test('el cursor vuelve de un input y detecta enlaces agregados con Ver más', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile');
  await page.goto('/#contact');
  await expect(page.getByTestId('smart-cursor')).toHaveCount(1);
  await page.locator('#name').hover();
  await expect(page.locator('html')).toHaveAttribute('data-cursor-native', '');
  await page.getByRole('link', { name: 'Descargar CV' }).hover();
  await expect(page.locator('html')).not.toHaveAttribute('data-cursor-native');
  await page.getByRole('button', { name: /Ver \d+ proyectos más/i }).click();
  await page.locator('#works article').last().hover();
  await expect(page.locator('.cursor-label')).toHaveText('Ver');
});

test('el avatar cambia de pose y rayos X requiere mantener pulsado', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile');
  await page.goto('/');
  const tracker = page.getByTestId('head-tracker');
  await expect(tracker).toHaveAttribute('data-frame', '10', { timeout: 10000 });
  await page.mouse.move(120, 100);
  await expect(tracker).not.toHaveAttribute('data-frame', '10');
  const avatar = page.getByRole('button', { name: /Explorar avatar/ });
  await avatar.hover();
  await expect(avatar).not.toHaveAttribute('data-xray');
  await page.mouse.down();
  await expect(avatar).toHaveAttribute('data-xray', '');
  await page.mouse.up();
  await expect(avatar).not.toHaveAttribute('data-xray');
});

test('un cambio a movimiento reducido restaura el cursor nativo', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile');
  await page.goto('/');
  await expect(page.getByTestId('smart-cursor')).toHaveCount(1);
  await page.mouse.move(400, 100);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByTestId('smart-cursor')).toHaveCount(0);
  await expect(page.getByTestId('head-tracker')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveAttribute('data-cursor-on');
});

test('videos locales solo cargan al pulsar Play', async ({ page }) => {
  const sources: string[] = [];
  page.on('request', (request) => { if (request.url().includes('avatar-motion.mp4')) sources.push(request.url()); });
  await page.goto('/#content');
  await expect(page.getByRole('button', { name: /Reproducir: David: estudio/ })).toBeVisible();
  expect(sources).toEqual([]);
  await page.getByRole('button', { name: /Reproducir: David: estudio/ }).click();
  await expect(page.locator('#content video')).toHaveAttribute('src', '/media/video/avatar-motion.mp4');
});

test('footer con proyectos reales y CV disponible', async ({ page, request }, info) => {
  await page.goto('/#contact');
  await expect(page.getByRole('navigation', { name: 'Enlaces del footer' })).toBeVisible();
  const cv = await request.get('/cv-david-cevallos.pdf');
  expect(cv.ok()).toBe(true);
  expect(cv.headers()['content-type']).toContain('application/pdf');
  if (info.project.name === 'desktop') {
    await expect(page.getByTestId('footer-trail')).toHaveCount(1);
    await page.getByTestId('footer-wordmark').hover();
    await expect.poll(() => page.locator('[data-testid="footer-trail"] img').evaluateAll((images) => images.some((image) => image.getAnimations().length > 0))).toBe(true);
  }
});

test('en touch la cabeza mira hacia el toque y vuelve al centro', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.addInitScript(() => Object.defineProperty(navigator, 'deviceMemory', { value: 8 }));
  await page.goto('/');
  await expect(page.getByTestId('head-tracker')).toHaveCount(0);
  await page.getByRole('button', { name: /Explorar avatar/ }).tap();
  await expect(page.getByTestId('head-tracker')).toHaveAttribute('data-frame', /^(?!10$)\d+$/, { timeout: 10000 });
  await expect(page.getByTestId('head-tracker')).toHaveAttribute('data-frame', '10', { timeout: 5000 });
});

test('un móvil de poca memoria conserva el retrato estático', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.addInitScript(() => Object.defineProperty(navigator, 'deviceMemory', { value: 2 }));
  await page.goto('/');
  await page.getByRole('button', { name: /Explorar avatar/ }).tap();
  await expect(page.getByTestId('head-tracker')).toHaveCount(0);
  await expect(page.getByRole('img', { name: 'David Cevallos' })).toBeVisible();
});
