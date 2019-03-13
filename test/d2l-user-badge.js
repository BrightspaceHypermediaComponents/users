(function() {
	let userBadge;

	async function loadPromise(url) {
		const entity = await window.D2L.Siren.EntityStore.fetch(url, '');
		await userBadge._loadData(entity.entity);
	}

	suite('d2l-user-badge base', function() {
		setup(function() {
			userBadge = fixture('base');
		});
		test('instantiating the element works', function() {
			assert.equal(userBadge.tagName.toLowerCase(), 'd2l-user-badge');
		});
		test('attributes are set correctly', function() {
			assert.equal(userBadge.href, 'data/user.json');
			assert.equal(userBadge.displayNameHref, 'https://www.d2l.com');
			assert.equal(userBadge.token, 'faketoken');
		});
		test('displayName is set correctly', (done) => {
			loadPromise('data/user.json').then(function() {
				assert.equal(userBadge._displayName, 'Josh Roach');
				done();
			});
		});
	});
})();
