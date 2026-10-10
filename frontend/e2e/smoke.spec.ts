import { expect, test, type Page } from '@playwright/test';

/** Errores de consola propios (se ignoran recursos externos bloqueados en el test). */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|ERR_/.test(m.text())) errors.push(m.text());
  });
  return errors;
}

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
});

test('carga sin errores y el hero presenta a David', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('David Cevallos');
  await expect(page.getByRole('link', { name: /trabajemos/i })).toBeVisible();
  await expect(page.getByRole('img', { name: 'David Cevallos' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('todas las secciones existen y el nav las enlaza', async ({ page }) => {
  await page.goto('/');
  for (const id of ['studio', 'works', 'certificates', 'stack', 'content', 'art', 'contact']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('sin scroll horizontal', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('la galería sirve WebP livianos, no los PNG originales', async ({ page }) => {
  const heavy: string[] = [];
  page.on('response', async (r) => {
    if (/\.(png|jpe?g)$/.test(r.url()) && !r.url().includes('favicon')) heavy.push(r.url());
  });
  await page.goto('/');
  await page.locator('#art').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const thumbs = page.locator('#art img');
  await expect(thumbs.first()).toHaveAttribute('src', /\/media\/gallery\/.+-thumb\.webp$/);
  expect(await thumbs.count()).toBe(160);
  expect(heavy).toEqual([]);
});

test('lightbox de la galería abre y cierra con teclado', async ({ page }) => {
  await page.goto('/');
  await page.locator('#art').scrollIntoViewIfNeeded();
  // El marquee se pausa con foco (teclado) o hover: abrimos con Enter como un usuario de teclado
  const first = page.getByRole('button', { name: 'Ver arte IA 1' }).first();
  await first.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: /arte ia ampliado/i });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('los videos de fondo no se descargan hasta acercarse', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  const videos: string[] = [];
  page.on('request', (r) => r.resourceType() === 'media' && videos.push(r.url()));
  await page.goto('/');
  await page.waitForTimeout(500);
  expect(videos.some((u) => u.includes('coding-loop'))).toBe(false);
});

test('el formulario valida antes de enviar', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByRole('button', { name: /enviar mensaje/i }).click();
  // validación nativa: el campo requerido queda inválido y no hay mensaje de éxito
  expect(await page.locator('#name').evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
  await expect(page.getByText('Mensaje enviado')).toHaveCount(0);
});

test.describe('reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });
  test('no renderiza la patita y el hero queda estático', async ({ page }) => {
    await page.goto('/');
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(400);
    await expect(page.locator('svg filter#paw-clay')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test('easter egg: escribir LOG abre el archivo literario', async ({ page }) => {
  test.skip(test.info().project.name === 'mobile');
  await page.goto('/');
  await page.keyboard.type('log');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});
