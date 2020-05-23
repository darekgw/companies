import {css} from "lit-element";

export const searchStyles = () => {
	return css`
.search {
display: flex;
justify-content: flex-end;
font-size: 16px;
}

@media screen and (min-width: 992px) {
	.search {
		font-size: 20px;
	}
}

.search__title {
	margin-right: 8px;
	font-weight: bold;
}
	
	`
};
