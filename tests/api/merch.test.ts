import { describe, it, expect, beforeEach } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils';
import { resetAndSeedDatabase } from '../helpers/db';

// Start the Nuxt test server
await setup();

describe('Merch API Endpoints', () => {
  beforeEach(() => {
    // Reset and seed the database before each test
    resetAndSeedDatabase();
  });

  it('GET /api/merch should return all items with their variants', async () => {
    const data: any = await $fetch('/api/merch');
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(3);
    
    // Check first item structure
    const gojo = data.find((p: any) => p.id === 1);
    expect(gojo).toBeDefined();
    expect(gojo.title).toBe('Сатору Годжо: Hollow Purple Ver.');
    expect(gojo.variants).toBeDefined();
    expect(gojo.variants.length).toBe(2);
    expect(gojo.variants[0].variantName).toBe('Масштаб 1/7');
    expect(gojo.variants[0].stock).toBe(5);
  });

  it('GET /api/merch with filters should work correctly', async () => {
    // Filter by Category
    const figures: any = await $fetch('/api/merch?category=figure');
    expect(figures.length).toBe(2); // Gojo and Asuka are figures

    const apparel: any = await $fetch('/api/merch?category=apparel');
    expect(apparel.length).toBe(1); // Guts hoodie is apparel

    // Filter by Franchise
    const eva: any = await $fetch('/api/merch?franchise=Евангелион');
    expect(eva.length).toBe(1);
    expect(eva[0].id).toBe(2); // Asuka
  });

  it('GET /api/merch/[id] should return a single product with variants', async () => {
    const data: any = await $fetch('/api/merch/1');
    expect(data).toBeDefined();
    expect(data.title).toBe('Сатору Годжо: Hollow Purple Ver.');
    expect(data.variants.length).toBe(2);
  });

  it('GET /api/merch/[id] with non-existent ID should throw an error (404)', async () => {
    await expect($fetch('/api/merch/999')).rejects.toThrow();
  });
});
