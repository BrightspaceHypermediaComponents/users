import 'd2l-polymer-siren-behaviors/store/entity-store.js';

/*
* Behavior for fetching an entity when an href and token a present
* @polymerBehavior
*/
export const EntityMixin = superclass => class extends superclass {
	static get properties() {
		return {
			/**
			 * The href for this siren entity
			 */
			href: { type: String, reflect: true },

			/**
			 * The user access token
			 */
			token: { type: String, reflect: true },

			/**
			 * The fetched siren entity
			 */
			entity: { type: Object },

			_entityChangedHandler: { type: Object }
		};
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		if (this.removeListener) {
			this.removeListener();
			this.removeListener = null;
		}
	}

	constructor() {
		super();

		this.entity = null;
		this._entityChangedHandler = this._entityChanged.bind(this);
	}

	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'entity') {
				this._onEntityChanged();
			} else if (propName === 'href') {
				this._fetchEntity(oldValue, this.token);
			} else if (propName === 'token') {
				this._fetchEntity(this.href, oldValue);
			}
		});
	}

	_fetchEntity(hrefOld, tokenOld) {
		if (!this.href || (typeof this.token !== 'string' && typeof this.token !== 'function')) {
			return;
		}

		if (this.removeListener) {
			this.removeListener();
			this.removeListener = null;
		}

		window.D2L.Siren.EntityStore
			.addListener(this.href, this.token, this._entityChangedHandler)
			.then((removeListener) => {
				if (hrefOld && this.href !== hrefOld) {
					removeListener();
					return;
				}

				if (tokenOld && this.token !== tokenOld) {
					removeListener();
					return;
				}

				this.removeListener = removeListener;
				window.D2L.Siren.EntityStore.fetch(this.href, this.token);
			});
	}

	_entityChanged(entity, error) {
		if (error) {
			const sirenEvent = new CustomEvent('d2l-siren-entity-error', { detail: { error: error } });
			this.dispatchEvent(sirenEvent, { bubbles: true, composed: true });
			return;
		}

		if (entity !== this.entity) {
			this.entity = entity;
			const sirenEvent = new CustomEvent('d2l-siren-entity-changed', { detail: { entity: entity } });
			this.dispatchEvent(sirenEvent, { bubbles: true, composed: true });
		}
	}

	_onEntityChanged(entity, oldEntity) {
		// default empty implementation
	}

	_getSelfLink(entity) {
		if (entity) {
			return entity.href || (entity.hasLinkByRel('self') ? entity.getLinkByRel('self').href : '');
		}
		return '';
	}
};
