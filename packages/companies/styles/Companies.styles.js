import {css} from "lit-element";

export const companiesStyles = () => {
	return css`
	* {
	font-size: 18px;
	}
	
	table {
	max-width: 100%;
	}
	
	th {
	// background-color: red;
	}
	
	.table__data--right {
	text-align: right;
	}
	
	@media and screen(min-width: 600px) {
	table {
	max-width: 80%;
	}
	}
	
	`
}
