(function() {
	let userBadge;

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
	});
})();
