import {css} from "lit-element";

export const companiesStyles = () => {
	return css`
	.companies {
		margin-left: var(--mobile-space);
		margin-right: var(--mobile-space);
	}
	
	.companies__title {
		text-transform: uppercase;
		text-align: center;
		font-size: var(--desktop-font-size);
	}
	
	.companies__search {
		margin-bottom: 6px;
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
		min-width: var(--desktop-space);
	}
	
	.table__head--name {
		min-width: 150px;
	}
	
	.table__head--total-income {
		min-width: 80px;
	}
	
	.table__head--average-income {
		min-width: 65px;
	}
	
	.table__head--last-income {
		min-width: 95px;
		max-width: 205px;
	}
	
	.table__head-month {
		white-space: nowrap;
	}
	
	.table__sort {
		display: none;
	}
	
	.table__sort--show {
		display: inline-block;
	}
	
	.table__body .table__row:nth-child(odd) {
 		background-color: #f2f2f2;
	}
	
	.table__data--right {
		text-align: right;
	}
	
	.companies__pagination {
		margin-top: var(--tablet-space);
		margin-bottom: var(--tablet-space);
		display: flex;
		justify-content: flex-end;
	}
	
	.pagination-button {
		font-size: var(--mobile-font-size);
		width: 33.3333%;
		height: 44px;
	}
	
	.pagination-button--info {
		color: black;
	}
	
	@media screen and (min-width: 768px) {
		.companies {
			margin-left: var(--tablet-space);
			margin-right: var(--tablet-space);
		}
		
		.companies__search {
			 margin-top: var(--tablet-space);
			 margin-bottom: var(--tablet-space);
		 }
		 
		 .companies__pagination {
			margin-top: var(--tablet-space);
			margin-bottom: var(--tablet-space);
		}	
	
		.pagination-button {
			width: 130px;
			height: var(--desktop-space);
		}
	}
	
	@media screen and (min-width: 992px) {
		 .companies__title {
			 font-size: 1.5em;
		 }
		 
		 .companies__search {
			 margin-top: var(--desktop-space);
			 margin-bottom: var(--desktop-space);
		 }
		 
		 .table {
		 	font-size: var(--desktop-font-size);
		 }
		 
		 .companies__pagination {
			margin-top: var(--desktop-space);
			margin-bottom: var(--desktop-space);
		}	
		
		.pagination-button {
			font-size: var(--desktop-font-size);
		}
	}
	
	@media screen and (min-width: 1200px) {
		.companies {
				width: 80%;
				margin: auto;
			 }
	}
	
	`
};
