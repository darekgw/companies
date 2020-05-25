import {css} from "lit-element";

export const searchStyles = () => {
	return css`
	.search {
		display: flex;
		justify-content: flex-end;
		font-size: var(--mobile-font-size);
	}
	
	.search__title {
		margin-right: var(--mobile-space);
		line-height: 26px;
		font-weight: bold;
	}
	
	.search__input {
		font-size: var(--mobile-font-size);
	}
	
	@media screen and (min-width: 992px) {
		.search {
			font-size: var(--desktop-font-size);
		}
		
		.search__title {
			margin-right: var(--tablet-space);
		}
		
		.search__input {
			font-size: var(--desktop-font-size);
		}
	}
	
	`
};
