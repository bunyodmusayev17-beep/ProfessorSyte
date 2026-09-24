import { describe, expect, it } from 'vitest';

import { appendBoolean, appendFile, appendIfPresent, appendList } from './formData';

describe('appendIfPresent', () => {
  it('skips empty values so optional fields are not sent as "null"', () => {
    const formData = new FormData();
    appendIfPresent(formData, 'a', null);
    appendIfPresent(formData, 'b', undefined);
    appendIfPresent(formData, 'c', '');
    appendIfPresent(formData, 'd', 'value');

    expect([...formData.keys()]).toEqual(['d']);
  });
});

describe('appendBoolean', () => {
  it('serialises to the literals ASP.NET Core binds', () => {
    const formData = new FormData();
    appendBoolean(formData, 'yes', true);
    appendBoolean(formData, 'no', false);

    expect(formData.get('yes')).toBe('true');
    expect(formData.get('no')).toBe('false');
  });
});

describe('appendFile', () => {
  it('appends a real file but ignores null and empty ones', () => {
    const formData = new FormData();
    appendFile(formData, 'ok', new File(['xx'], 'a.png', { type: 'image/png' }));
    appendFile(formData, 'missing', null);
    appendFile(formData, 'empty', new File([], 'b.png', { type: 'image/png' }));

    expect([...formData.keys()]).toEqual(['ok']);
  });
});

describe('appendList', () => {
  it('uses the indexed keys the model binder expects', () => {
    const formData = new FormData();
    appendList(formData, 'ProductLinks', [
      { StoreName: 'AliExpress', ProductName: 'Servo', Url: 'https://a.example' },
      { StoreName: '', ProductName: 'Sensor', Url: 'https://b.example' },
    ]);

    expect(formData.get('ProductLinks[0].ProductName')).toBe('Servo');
    expect(formData.get('ProductLinks[1].Url')).toBe('https://b.example');
    // The empty store name is skipped rather than sent as an empty string.
    expect(formData.get('ProductLinks[1].StoreName')).toBeNull();
  });
});
