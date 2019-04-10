/**
`d2l-profile-image-base`
D2L Profile Image
@demo demo/d2l-profile-image-base.html
*/
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier3-icons.js';
import 'd2l-fetch/d2l-fetch.js';
import { heading2Styles, heading3Styles, heading4Styles, labelStyles } from 'd2l-core-ui/components/typography/styles.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { profileImageBaseStyles } from './styles/d2l-profile-image-base-styles.js';
import { styleMap } from 'lit-html/directives/style-map.js';

export class D2LProfileImageBase extends LitElement {

	static get properties() {
		return {
			colourId: { type: Number, attribute: 'colour-id' },
			firstName: { type: String, attribute: 'first-name' },
			lastName: { type: String, attribute: 'last-name' },
			href: { type: String },
			token: { type: String },
			small: { type: Boolean },
			medium: { type: Boolean },
			large: { type: Boolean },
			xLarge: { type: Boolean, attribute: 'x-large' },
			_displayType: { type: String },
			_failedToLoadImage: { type: Boolean },
			_imageLoading: { type: Boolean },
			_imageUrl: { type: String },
			_initials: { type: String }
		};
	}

	static get styles() {
		return [ labelStyles, heading2Styles, heading3Styles, heading4Styles, profileImageBaseStyles ];
	}

	constructor() {
		super();

		// WARNING
		// Changing the order, as well as adding or removing a colour
		// May result in background colours to change for a given colourId
		// Only update if you have the correct approval
		this.__backgroundColours = [
			'#8B271F',
			'#CF3A2F',
			'#C74F05',
			'#527F1F',
			'#346633',
			'#165F5B',
			'#1F826B',
			'#0C7683',
			'#3155BF',
			'#4476C1',
			'#383773',
			'#6F6BB8',
			'#50305F',
			'#9860AF',
			'#804167',
			'#AB578A',
			'#8C2855',
			'#D13B7F',
			'#47565E',
			'#5F727D',
			'#3B4148',
			'#59616C'
		];
		this._imageLoading = true;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'colourId') {
				this._getInitialedBackgroundColour();
			} else if (propName === 'href' && this.href) {
				this._resetImageState();
			} else if (propName === 'firstName' || propName === 'lastName') {
				this._getInitials();
			}

			if (propName === 'href'
				|| propName === '_failedToLoadImage'
				|| propName === 'colourId'
				|| propName === 'firstName'
				|| propName === '_imageLoading') {
				this._setDisplayType();
			}
		});
	}

	render() {
		const containerClasses = {
			'd2l-profile-image-container': true,
			'd2l-label-text': this.small,
			'd2l-heading-4': this.medium,
			'd2l-heading-3': this.large,
			'd2l-heading-2': this.xLarge
		};

		if (this._displayType === 'shady') {
			containerClasses['shady-person'] = true;
			return html`
				<div class=${classMap(containerClasses)}>
					<d2l-icon icon="d2l-tier3:profile-pic"></d2l-icon>
				</div>
			`;
		}
		else if (this._displayType === 'initials') {
			containerClasses['initials'] = true;
			return html`
				<div class=${classMap(containerClasses)}
					style=${styleMap({ backgroundColor: `${this._backgroundColor}` })}>
						${this._initials}
				</div>
			`;
		}
		else if (this._displayType === 'avatar') {
			return html`
				<img
					class=${classMap(containerClasses)}
					draggable="false"
					src="${this._imageUrl}"
					@error=${this._failedToLoadImageFunc}>
			`;
		}

		return html``;
	}

	_setDisplayType() {
		if (this._imageLoading && this.href) {
			this._displayType = 'empty';
		}
		else if (this.href && !this._failedToLoadImage) {
			this._displayType = 'avatar';
		}
		else if (typeof this.colourId !== 'undefined' &&
				this.colourId !== null &&
				this.colourId > 0 &&
				this.firstName
		) {
			this._displayType = 'initials';
		}
		else {
			this._displayType = 'shady';
		}
	}

	_failedToLoadImageFunc() {
		this._failedToLoadImage = true;
	}

	_getInitialedBackgroundColour() {
		const idx = this.colourId % this.__backgroundColours.length;
		this._backgroundColor = this.__backgroundColours[idx];
	}

	_getInitials() {
		if (this.firstName && this.lastName) {
			this._initials = this.firstName[0].toUpperCase() + this.lastName[0].toUpperCase();
		}
		else if (this.firstName) {
			this._initials = this.firstName[0].toUpperCase();
		}
		else {
			this._initials = '';
		}
	}

	_resetImageState() {
		this._imageLoading = true;
		this._failedToLoadImage = false;

		const headers = new Headers();
		headers.append('Authorization', `Bearer ${this.token}`);

		return window.d2lfetch
			.removeTemp('simpleCache')
			.removeTemp('dedupe')
			.fetch(this.href, {method: 'GET', headers: headers})
			.then((resp) => {
				return resp.blob();
			})
			.then((blob) => {
				this._imageUrl = URL.createObjectURL(blob);
			})
			.catch(() => {
				this._imageUrl = this.href;
			})
			.then(() => {
				this._imageLoading = false;
			});
	}
}

customElements.define('d2l-profile-image-base', D2LProfileImageBase);
