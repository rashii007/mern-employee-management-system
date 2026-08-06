import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAuthUser } from './authUtils.js';

test('normalizes a plain user object', () => {
  const user = { _id: '1', name: 'Ali', email: 'ali@example.com', role: 'employee' };
  assert.deepEqual(normalizeAuthUser(user), user);
});

test('unwraps the backend response shape from getCurrentUser', () => {
  const wrapped = {
    success: true,
    user: { _id: '2', name: 'Sara', email: 'sara@example.com', role: 'employee' },
  };

  assert.deepEqual(normalizeAuthUser(wrapped), wrapped.user);
});
