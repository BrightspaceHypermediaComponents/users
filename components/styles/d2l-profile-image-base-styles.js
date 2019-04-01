import { css } from 'lit-element/lit-element.js';

export const profileImageBaseStyles = css`
	:host {
		--d2l-icon-height: 100%;
		--d2l-icon-width: 100%;
		display: inline-block;
	}

	:host([loading]) {
		opacity: 0;
	}

	:host(:not([small]):not([medium]):not([large]):not([x-large])) {
		display: none;
	}

	.d2l-profile-image-container {
		height: 100%;
		width: 100%;
	}

	.d2l-profile-image-container.shady-person {
		--d2l-icon-fill-color: var(--d2l-color-ferrite);
	}
	.d2l-profile-image-container.initials {
		align-items : center;
		color: var(--d2l-color-regolith);
		display : flex;
		justify-content: center;
		text-align: center;
	}

	:host([small]) {
		height: 30px;
		margin: 0;
		min-width: 30px;
		width: 30px;
	}
	:host([small]) .d2l-profile-image-container {
		border-radius: 4px;
		margin: 0;
	}

	:host([medium]) {
		height: 42px;
		margin: 0;
		min-width: 42px;
		width: 42px;
	}
	:host([medium]) .d2l-profile-image-container {
		border-radius: 6px;
		margin: 0;
	}

	:host([large]) {
		height: 60px;
		margin: 0;
		min-width: 60px;
		width: 60px;
	}
	:host([large]) .d2l-profile-image-container {
		border-radius: 8px;
		margin: 0;
	}

	:host([x-large]) {
		height: 84px;
		margin: 0;
		min-width: 84px;
		width: 84px;
	}
	:host([x-large]) .d2l-profile-image-container {
		border-radius: 8px;
		margin: 0;
	}
`;
