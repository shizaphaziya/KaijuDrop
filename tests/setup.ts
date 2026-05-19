import { beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

// Initialize a fresh Pinia instance before each test to prevent state leaks
beforeEach(() => {
  setActivePinia(createPinia());
});
