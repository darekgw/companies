import {
	LitElement,
	html,
	nothing
} from "lit-element";
import {companiesStyles} from "../styles/Companies.styles";
import "../../search/app-search";
import {calculateLatestMonthCompanyIncome} from "../../utils/helpersMethods";

export class Companies extends LitElement {
	static get styles() {
		return [
			companiesStyles()
		]
	}

	static get properties() {
		return {
			companies: {type: Array},
			filteredCompanies: {type: Array},
			companiesId: {type: Array},
			companiesFinancialData: {type: Array},
			filteredCompaniesFinancialData: {type: Array},
			currentPage: {type: Number}
		};
	}

	constructor() {
		super();
		this.companies = [];
		this.filteredCompanies = []
		this.companiesId = [];
		this.companiesFinancialData = [];
		this.filteredCompaniesFinancialData = [];
		this.id = 'id';
		this.name = 'name';
		this.city = 'city';
		this.numberOfRecords = undefined;
		this.numberOfRecordsToShow = 15;
		this.numberOfPages = undefined;
		this.currentPage = 1;
	}

	connectedCallback() {
		super.connectedCallback();
		document.addEventListener(
			"filteredCompany",
			this.getFilteredCompanies.bind(this)
		);
	}

	getFilteredCompanies(event) {
		this.filteredCompanies = [...event.detail.filteredCompanies];
		this.filteredCompaniesFinancialData = this.companiesFinancialData.filter(companyFinance => {
			return this.filteredCompanies.find(company => company.id === companyFinance.id);
		})
	}

	firstUpdated() {
		const tmpFinancialData = [];
		fetch("https://recruitment.hal.skygate.io/companies")
			.then(r => r.json())
			.then(r => {
				this.companies = r;
				this.filteredCompanies = r;
				console.log(this.companies)
				this.numberOfRecords = this.companies.length;
				this.numberOfPages = Math.ceil(this.numberOfRecords / this.numberOfRecordsToShow);
				console.log('numOfPages ', this.numberOfPages)
				return r;
			})
			.then(async r => {

				await Promise.all(r.map(company => {

					return fetch(`https://recruitment.hal.skygate.io/incomes/${company.id}`)
						.then(r => r.json())
						.then(r => {
							tmpFinancialData.push(r);
						})

				}));
				return r;
			})
			.then(r => {
				this.companiesFinancialData = [...tmpFinancialData];
				console.log('this.companiesFinancialData ', this.companiesFinancialData)
			})
		;
	}

	render() {
		if (this.companies.length === 0) return html``;
		console.log('this.companiesFinancialData ', this.companiesFinancialData)
		return html`
		<div class="companies">
		<h1 class="companies__title">Companies data table</h1>
		<div class="companies__search">
			<app-search .companies="${this.companies}" .financialData="${this.companiesFinancialData}"></app-search>
		</div>
		<div class="companies__table-wrapper">
        <table class="table companies__table">
			<thead class="table__head-wrapper">
				 <tr class="table__row">
					 <th class="table__head table__head--id" @click="${(e) => this.__sort(e, this.id)}">Id</th>
					 <th class="table__head table__head--name"  @click="${(e) => this.__sort(e, this.name)}">Company name</th>
					 <th class="table__head table__head--city"  @click="${(e) => this.__sort(e, this.city)}">City</th>
					 <th class="table__head table__head--right table__head--last-income" @click="${(e) => this.sortByIncome(e)}">Last month income</th>
					 <th class="table__head table__head--right table__head--total-income">Total income</th>
					 <th class="table__head table__head--right table__head--average-income">Average income</th>
				</tr>
			</thead>
			<tbody class="table__body">
				   ${this.__generateTable(this.filteredCompanies, this.companiesFinancialData)}
			</tbody>
		</table>
		</div>
		${this.generatePaginationButtons()}
		</div>
        `
	}

	generatePaginationButtons() {
		return html`
		<div class="companies__pagination pagination">
			<button class="pagination-button pagination-button--backward" @click="${(e) => this.pagination(e)}">Back</button>
			<button class="pagination-button pagination-button--info" disabled>Page ${this.currentPage} of ${this.numberOfPages}</button>
			<button class="pagination-button pagination-button--forward" @click="${(e) => this.pagination(e)}">Forward</button>
		</div>
		`
	}

	pagination(e) {
		const paginationButton = e.target;
		const paginateForward = paginationButton.classList.contains('pagination-button--forward');
		if (paginateForward) {
			if (this.currentPage < this.numberOfPages)
				this.currentPage += 1;
			console.log(this.currentPage)
		} else {
			if (this.currentPage > 1)
				this.currentPage -= 1;
		}
	}

	__generateTable(companies, financialData) {
		let firstRecordToShowIndex = 0;
		if (this.currentPage !== 1) {
			firstRecordToShowIndex = this.numberOfRecordsToShow * (this.currentPage - 1);
		}
		const lastRecordToShowIndex = firstRecordToShowIndex + this.numberOfRecordsToShow;
		const companiesToShow = companies.slice(firstRecordToShowIndex, lastRecordToShowIndex);
		return companiesToShow.map(company => {
			return html`
			<tr class="table__row">
				<td class="table__data table__data--left table__data--left">${company.id}</td>
				<td class="table__data table__data--left class="table__data table__data--right" ">${company.name}</td>
				<td class="table__data table__data--left">${company.city}</td>
				${this.__getLastMonthIncome(company.id, financialData)}
				${this.__getCompanySumOfIncome(company.id)}
				${this.__getCompanyAverageIncome(company.id)}
			</tr>
			`
		})
	}

	__getLastMonthIncome(companyId) {
		if (this.companiesFinancialData.length === 0) return html`<td></td>`;
		return html`
		<td class="table__data table__data--right">${calculateLatestMonthCompanyIncome(companyId, this.companiesFinancialData)}</td>
		`
	}

	__getCompanySumOfIncome(companyId) {
		if (this.companiesFinancialData.length === 0) return html`<td></td>`;
		const companyFinance = this.companiesFinancialData.find(fin => {
				return fin.id === companyId
			}
		);
		const companySumOfIncome = companyFinance.incomes.reduce((sum, income) => {
			return Number(sum) + Number(income.value)
		}, 0);
		return html`
		<td class="table__data table__data--right">${companySumOfIncome.toFixed(2)}</td>
		`
	}

	__getCompanyAverageIncome(companyId) {
		if (this.companiesFinancialData.length === 0) return html`<td></td>`;
		const companyFinance = this.companiesFinancialData.find(fin => {
				return fin.id === companyId
			}
		);
		const companySumOfIncome = companyFinance.incomes.reduce((sum, income) => {
			return Number(sum) + Number(income.value)
		}, 0);
		const numberOfMonths = companyFinance.incomes.length;
		const averageIncome = companySumOfIncome / numberOfMonths;
		return html`
		<td class="table__data table__data--right">${averageIncome.toFixed(2)}</td>
		`
	}

	__sort(e, sortBy) {
		console.log('sortBy ', sortBy)
		const targetElement = e.target;
		const sortedByTargetElementAsc = targetElement.classList.contains('asc');
		const previousElementSortedAsc = this.shadowRoot.querySelector('.asc');
		const previousElementSortedDesc = this.shadowRoot.querySelector('.desc');
		if (previousElementSortedAsc) {
			previousElementSortedAsc.classList.remove('asc');
		} else if (previousElementSortedDesc) {
			previousElementSortedDesc.classList.remove('desc')
		}
		if (sortedByTargetElementAsc) {
			this.filteredCompanies = [...this.filteredCompanies.sort((a, b) => (a[sortBy] < b[sortBy]) ? 1 : ((b[sortBy] < a[sortBy]) ? -1 : 0))];
			targetElement.classList.remove('asc');
			targetElement.classList.add('desc')
		} else {
			this.filteredCompanies = [...this.filteredCompanies.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0))];
			targetElement.classList.remove('desc');
			targetElement.classList.add('asc')
		}
	}

	sortByIncome(e) {
		const targetElement = e.target;
		const sortedByTargetElementAsc = targetElement.classList.contains('asc');
		const previousElementSortedAsc = this.shadowRoot.querySelector('.asc');
		const previousElementSortedDesc = this.shadowRoot.querySelector('.desc');
		if (previousElementSortedAsc) {
			previousElementSortedAsc.classList.remove('asc');
		} else if (previousElementSortedDesc) {
			previousElementSortedDesc.classList.remove('desc')
		}
		if (sortedByTargetElementAsc) {
			this.companiesFinancialData = [...this.companiesFinancialData.sort((a, b) => {
				const aLastMonthIncome = a.incomes.reduce((x, y) => {
					return (x.date > y.date) ? x : y
				});
				const bLastMonthIncome = b.incomes.reduce((x, y) => {
					return (x.date > y.date) ? x : y
				});
				return (aLastMonthIncome.value > bLastMonthIncome.value) ? 1 : ((bLastMonthIncome.value > aLastMonthIncome.value) ? -1 : 0);
			})]
			this.filteredCompanies = [...this.filteredCompanies.sort((a, b) => {
				const aCompanyFinancialData = this.companiesFinancialData.find(companyFinance => companyFinance.id === a.id);
				const bCompanyFinancialData = this.companiesFinancialData.find(companyFinance => companyFinance.id === b.id);
				console.log('aCompanyFinancialData ', this.companiesFinancialData.indexOf(aCompanyFinancialData));
				return this.companiesFinancialData.indexOf(bCompanyFinancialData) - this.companiesFinancialData.indexOf(aCompanyFinancialData);
			})];
			console.log('this.filteredCompanies ', this.filteredCompanies);
			targetElement.classList.remove('asc');
			targetElement.classList.add('desc')
		} else {
			console.log('sort asc');
			this.companiesFinancialData = [...this.companiesFinancialData.sort((a, b) => {
				const aLastMonthIncome = a.incomes.reduce((x, y) => {
					return (x.date > y.date) ? x : y
				});
				const bLastMonthIncome = b.incomes.reduce((x, y) => {
					return (x.date > y.date) ? x : y
				});
				return (aLastMonthIncome.value > bLastMonthIncome.value) ? 1 : ((bLastMonthIncome.value > aLastMonthIncome.value) ? -1 : 0);
			})]
			this.filteredCompanies = [...this.filteredCompanies.sort((a, b) => {
				const aCompanyFinancialData = this.companiesFinancialData.find(companyFinance => companyFinance.id === a.id);
				const bCompanyFinancialData = this.companiesFinancialData.find(companyFinance => companyFinance.id === b.id);
				console.log('aCompanyFinancialData ', this.companiesFinancialData.indexOf(aCompanyFinancialData));
				return this.companiesFinancialData.indexOf(aCompanyFinancialData) - this.companiesFinancialData.indexOf(bCompanyFinancialData)
			})];
			targetElement.classList.remove('desc');
			targetElement.classList.add('asc')
		}


		console.log('sortByIncome')

		// this.companiesFinancialData.forEach(fin => {
		// 	console.log(fin.incomes.reduce((x, y) => {
		// 		return (x.date > y.date) ? x : y
		// 	}))
		// })
		console.log('this.companiesFinancialData ', this.companiesFinancialData);
		this.companiesFinancialData.forEach(fin => {
			const aLastMonthIncome = fin.incomes.reduce((x, y) => {
				return (x.date > y.date) ? x : y
			});
			console.log('inc ', aLastMonthIncome);
		})
	}

}
