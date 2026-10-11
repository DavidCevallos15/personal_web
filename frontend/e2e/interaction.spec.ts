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

test('rayos X: al pasar el mouse la máscara revela la otra cara', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile');
  await page.goto('/');
  await expect(page.getByRole('img', { name: 'David Cevallos' })).toBeVisible();
  const avatar = page.locator('#hero div.group:has(img[alt="David Cevallos"])');
  const xray = avatar.locator('> [aria-hidden="true"]');
  await expect(xray).toHaveCSS('opacity', '0');
  const box = await avatar.boundingBox();
  if (!box) throw new Error('avatar sin layout');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.25);
  await expect(xray).toHaveCSS('opacity', '1');
  await expect.poll(() => avatar.evaluate((el) => el.style.getPropertyValue('--mx'))).not.toBe('-999px');
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
  page.on('request', (request) => { if (request.url().includes('jovenes-en-accion.mp4')) sources.push(request.url()); });
  await page.goto('/#content');
  await expect(page.getByRole('button', { name: /Reproducir: Jóvenes en acción/ })).toBeVisible();
  expect(sources).toEqual([]);
  await page.getByRole('button', { name: /Reproducir: Jóvenes en acción/ }).click();
  await expect(page.locator('#content video')).toHaveAttribute('src', '/media/video/jovenes-en-accion.mp4');
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

test('plantillas y proyectos no enlazan a GitHub; Pedir demo deja el mensaje en el contacto', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#studio a[href*="github.com"], #works a[href*="github.com"]')).toHaveCount(0);
  await page.locator('#studio').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Pedir demo' }).first().click();
  await expect(page.locator('#message')).toHaveValue(/plantilla Estudio Axis/);
  await expect(page.locator('#name')).toBeFocused();
});

test('las flechas recorren las plantillas sin trackpad', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile');
  await page.goto('/');
  await page.locator('#studio-templates').scrollIntoViewIfNeeded();
  const list = page.locator('#studio-templates');
  await expect(page.getByRole('button', { name: 'Plantilla anterior' })).toBeDisabled();
  await page.getByRole('button', { name: 'Siguiente plantilla' }).click();
  await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
  await expect(page.getByRole('button', { name: 'Plantilla anterior' })).toBeEnabled();
});

test('Volver arriba funciona en pantalla completa de escritorio', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole('link', { name: /Volver arriba/ }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(10);
});
