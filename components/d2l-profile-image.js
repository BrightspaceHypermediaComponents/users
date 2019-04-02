/**
`d2l-profile-image`
D2L Profile Image Hypermedia
@demo demo/d2l-profile-image.html
*/

import './d2l-profile-image-base.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { EntityMixin } from '../polymer-siren-mixins/entity-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { Rels } from 'd2l-hypermedia-constants';

export class D2LProfileImage extends EntityMixin(LitElement) {
	static get properties() {
		return {
			small: { type: Boolean },
			medium: { type: Boolean },
			large: { type: Boolean },
			xLarge: { type: Boolean, attribute: 'x-large' },
			_firstName: { type: String },
			_lastName: { type: String },
			_colourId: { type: Number	},
			_imageUrl: { type: String },
			_loading: { type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				line-height: 0;
			}
		`;
	}

	constructor() {
		super();

		this._loading = true;
		this._imageUrl = '';
		this._firstName = '';
		this._lastName = '';
		this._colourId = -1;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-siren-entity-error', this._handleSirenError, true);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-siren-entity-error', this._handleSirenError, true);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'entity' || propName === 'href') {
				this._configureProfileImage();
			}
		});
	}

	render() {
		return html`
			<d2l-profile-image-base
				id="d2l-profile-image"
				small="${ifDefined(this.small)}"
				medium="${ifDefined(this.medium)}"
				large="${ifDefined(this.large)}"
				x-large="${ifDefined(this.xLarge)}"
				first-name="${this._firstName}"
				last-name="${this._lastName}"
				colour-id="${this._colourId}"
				href="${this._imageUrl}"
				token="${this.token}"
				?loading="${this._loading}">
			</d2l-profile-image-base>
		`;
	}

	_handleSirenError() {
		if (!this._loading) {
			this._imageUrl = '';
			this._firstName = '';
			this._lastName = '';
			this._colourId = -1;
		}

		this._loading = false;
	}

	_configureProfileImage() {
		if (!this._loading) {
			this._imageUrl = '';
			this._firstName = '';
			this._lastName = '';
			this._colourId = -1;
		}

		if (!this.entity) {
			return Promise.resolve();
		}

		return Promise.resolve(this.entity)
			.then((data) => {
				this._imageUrl = '';
				if (data.hasSubEntityByRel(Rels.userProfile)) {

					const userProfile = data.getSubEntityByRel(Rels.userProfile);
					if (userProfile) {

						const profileImage = userProfile.getSubEntityByRel(Rels.profileImage);
						if (profileImage && !profileImage.hasClass('default-image')) {

							const imageEntity = profileImage.getLinkByRel('alternate');
							this._imageUrl = imageEntity.href;
						}
					}
				}

				this._firstName = '';
				const firstName = data.getSubEntityByRel(Rels.firstName);
				if (!firstName.hasClass('default-name')) {
					this._firstName = firstName.properties.name;
				}

				this._lastName = '';
				const lastName = data.getSubEntityByRel(Rels.lastName);
				if (!lastName.hasClass('default-name')) {
					this._lastName = lastName.properties.name;
				}

				this._colourId = -1;
				const selfLink = data.getLinkByRel('self').href;
				const userId = selfLink.split('/').pop();
				if (!isNaN(userId)) {
					this._colourId = userId;
				}
			})
			.catch(() => {
				this._imageUrl = '';
				this._firstName = '';
				this._lastName = '';
				this._colourId = -1;
			})
			.then(() => {
				this._loading = false;
			});
	}
}

customElements.define('d2l-profile-image', D2LProfileImage);
