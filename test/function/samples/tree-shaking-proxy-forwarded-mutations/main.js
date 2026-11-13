const viaGetTrap = { count: 0 };
const tracked = new Proxy(viaGetTrap, {
	get(target, key) {
		return target[key];
	}
});
tracked.count++;
assert.strictEqual(viaGetTrap.count > 0 ? 'changed' : 'unchanged', 'changed', 'get trap');

const viaEmptyHandler = { value: false };
new Proxy(viaEmptyHandler, {}).value = true;
assert.strictEqual(viaEmptyHandler.value ? 'changed' : 'unchanged', 'changed', 'empty handler');

const viaDelete = { value: true };
delete new Proxy(viaDelete, { has: () => true }).value;
assert.strictEqual(viaDelete.value ? 'unchanged' : 'changed', 'changed', 'delete');

const viaDefineProperty = { value: false };
Object.defineProperty(
	new Proxy(viaDefineProperty, { get: (target, key) => target[key] }),
	'value',
	{
		value: true
	}
);
assert.strictEqual(viaDefineProperty.value ? 'changed' : 'unchanged', 'changed', 'defineProperty');

const viaNestedValue = { nested: { value: false } };
const withSetTrap = new Proxy(viaNestedValue, {
	set() {
		return true;
	}
});
withSetTrap.nested.value = true;
assert.strictEqual(
	viaNestedValue.nested.value ? 'changed' : 'unchanged',
	'changed',
	'nested value'
);
