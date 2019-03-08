import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import 'd2l-link/d2l-link.js'
import './d2l-profile-image.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {Rels, Classes} from 'd2l-hypermedia-constants';

/**
 * @customElement
 * @polymer
 */

class D2LProfileBadge extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], PolymerElement) {
	static get template() {
		const profileBadgeTemplate = html`
			<style>
				:host {
					display: block;
				}
				.d2l-profile-badge-image {
					display: inline-block;
					padding-right: 0.6rem;
					vertical-align: middle;
				}
				:host(:dir(rtl)) .d2l-profile-badge-image {
					padding-right: 0;
					padding-left: 0.6rem;
				}
				.d2l-profile-badge-link {
					display: inline-block;
					vertical-align: middle;
				}
			</style>
			<d2l-profile-image class="d2l-profile-badge-image" href="[[_userHref]]" token="[[token]]" large=""></d2l-profile-image>
			<d2l-link class="d2l-profile-badge-link" href="[[_linkHref]]">[[_displayName]]</d2l-link>
		`;
		profileBadgeTemplate.setAttribute('strip-whitespace', 'strip-whitespace');
		return profileBadgeTemplate;
	}
	static get is() { return 'd2l-profile-badge'; }
	static get properties() {
		return {
			'displayNameHref': {
				type: String,
				value: '',
				reflectToAttribute: true
			},
			_userHref: {
				type: String,
				value: ''
			},
			_displayName: {
				type: String,
				value: ''
			},
			_linkHref: {
				type: String,
				value: ''
			}
		};
	}
	static get observers() {
		return [
			'_loadData(entity)'
		];
	}

	_userFetch(url) {
		return window.D2L.Siren.EntityStore.fetch(url, this.token);
	}

	async _loadData(entity) {
		if (!entity) {
			return Promise.resolve();
		}

		try {
			if (this.href) {
				this._userHref = this.href;
			}
			if (this.displayNameHref) {
				this._linkHref = this.displayNameHref;
			}
			await this._getUserPromise(entity);
		} catch (e) {
			// Unable to load user from entity
		}
	}

	_followLink(entity, rel) {
		let href;
		if (entity && entity.hasLinkByRel && entity.hasLinkByRel(rel)) {
			href = entity.getLinkByRel(rel).href;
		} else {
			href = '';
		}

		if (href) {
			return this._userFetch(href);
		}
		return Promise.resolve();
	}

	async _getUserPromise(userEntity) {
		return this._followLink(userEntity, 'self')
			.then(function(u) {
				if (u && u.entity && u.entity.hasSubEntityByRel(Rels.displayName)) {
					this._displayName = u.entity.getSubEntityByRel(Rels.displayName).properties.name;
				}
			}.bind(this));
	}
}

window.customElements.define(D2LProfileBadge.is, D2LProfileBadge);
