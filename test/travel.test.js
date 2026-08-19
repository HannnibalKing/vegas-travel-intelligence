const test = require('node:test');
const assert = require('node:assert/strict');
const { areas, hourRisk, snapshot } = require('../server');

test('tourist areas include old strip, new strip, and downtown', () => {
  const ids = areas.map(area => area.id);
  assert.ok(ids.includes('old-strip'));
  assert.ok(ids.includes('new-strip'));
  assert.ok(ids.includes('downtown'));
});

test('night activity model changes area levels', () => {
  assert.ok(hourRisk(23, 1) > hourRisk(11, 1));
  assert.equal(snapshot(11).length, areas.length);
});
