import {css} from "lit-element";

export const companiesStyles = () => {
	return css`
	.companies {
	margin-left: 8px;
	margin-right: 8px;
	}
	
	.companies__title {
	text-transform: uppercase;
	text-align: center;
	font-size: 18px;
	}
	
	.companies__search {
	margin-bottom: 5px;
	}
	
	.companies__table-wrapper {
		overflow-x:auto;
	}
	
	.table {
	width: 100%;
	line-height: 1.5;
	}
	
	.table__head {
	text-align: left;
	cursor: pointer;
	}
	
	.table__head--right {
	text-align: right;
	}
	
	.table__head--id {
	min-width: 30px;
	}
	
	.table__head--name {
	min-width: 150px;
	}
	
	.table__head--last-income {
	min-width: 80px;
	}
	
	.table__head--total-income {
	min-width: 80px;
	}
	
	.table__head--average-income {
	min-width: 65px;
	}
	
	.table__body .table__row:nth-child(odd) {
  background-color: #f2f2f2;
}
	
	.table__data--right {
	text-align: right;
	}
	
	.companies__pagination {
	margin-top: 20px;
	margin-bottom: 10px;
	display: flex;
	justify-content: flex-end;
	}
	
	.pagination-button {
	width: 120px;
	height: 44px;
	}
	
	.pagination-button--info {
	color: black;
	}
	
	@media screen and (min-width: 992px) {
		.companies {
		width: 80%;
		margin: auto;
		 }
		 
		 .companies__title {
		 font-size: 1.5em;
		 }
		 
		 .companies__search {
		 margin-top: 5px;
		margin-bottom: 25px;
		}
		 
		 .table {
		 font-size: 18px;
		 }
		 
		 .companies__pagination {
		margin-top: 1.5em;
		}
	
	}
	
	
	
	`
}
