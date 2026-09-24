import '@testing-library/jest-dom/vitest';

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom has no layout engine, so these are missing on HTMLDialogElement.
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal ??= function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close ??= function close() {
    this.open = false;
  };
}

afterEach(cleanup);
