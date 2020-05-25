import {
	LitElement,
	html
} from "lit-element";
import {companiesStyles} from "../styles/Companies.styles";
import "../../search/app-search";

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
			currentPage: {type: Number},
			lastMonth: {type: String}
		};
	}

	constructor() {
		super();
		this.companies = [];
		this.filteredCompanies = []
		this.companiesId = [];
		this.companiesFinancialData = [];
		this.filteredCompaniesFinancialData = [];
		this.calculatedFinancialData = [];
		this.id = 'id';
		this.name = 'name';
		this.city = 'city';
		this.totalIncome = 'totalIncome';
		this.averageIncome = 'averageIncome';
		this.lastMonthIncome = 'lastMonthIncome';
		this.numberOfRecordsToShow = 15;
		this.numberOfPages = undefined;
		this.currentPage = 1;
		this.lastMonth = undefined;
		this.sortDirection = undefined;
	}

	connectedCallback() {
		super.connectedCallback();
		document.addEventListener(
			"filteredCompany",
			this.__getFilteredCompanies.bind(this)
		);
	}

	__getFilteredCompanies(event) {
		this.filteredCompanies = this.sortDirection === 'desc' ? [...event.detail.filteredCompanies].reverse() : [...event.detail.filteredCompanies];
		this.filteredCompaniesFinancialData = this.companiesFinancialData.filter(companyFinance => {
			return this.filteredCompanies.find(company => company.id === companyFinance.id);
		})
		this.numberOfPages = Math.ceil(this.filteredCompanies.length / this.numberOfRecordsToShow);
	}

	firstUpdated() {
		const tmpFinancialData = [];
		fetch("https://recruitment.hal.skygate.io/companies")
			.then(r => r.json())
			.then(r => {
				this.companies = r;
				this.filteredCompanies = r;
				this.numberOfPages = Math.ceil(this.filteredCompanies.length / this.numberOfRecordsToShow);
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
				this.__findLastMonth();
				this.__calculateFinancialData();
			});
	}

	render() {
		if (this.companies.length === 0) return html``;
		return html`
		<div class="companies">
			<h1 class="companies__title">Companies data table</h1>
			<div class="companies__search">
				<app-search .companies="${this.companies}" .calculatedFinancialData="${this.calculatedFinancialData}"></app-search>
			</div>
			<div class="companies__table-wrapper">
				<table class="table companies__table">
					<thead class="table__head-wrapper">
						 <tr class="table__row">
							 <th class="table__head table__head--id" @click="${(e) => this.__sort(e, this.id)}">Id 
							 	<span class="table__sort table__sort--asc">(asc)</span>
							 	<span class="table__sort table__sort--desc">(desc)</span>
							 </th>
							 <th class="table__head table__head--name"  @click="${(e) => this.__sort(e, this.name)}">Company name 
								<span class="table__sort table__sort--asc">(asc)</span>
							 	<span class="table__sort table__sort--desc">(desc)</span>
							 </th>
							 <th class="table__head table__head--city"  @click="${(e) => this.__sort(e, this.city)}">City 
							 	<span class="table__sort table__sort--asc">(asc)</span>
								<span class="table__sort table__sort--desc">(desc)</span>
							 </th>
							 <th class="table__head table__head--right table__head--total-income" @click="${(e) => this.__sortByCalculatedIncome(e, this.totalIncome)}">Total income 
								 <span class="table__sort table__sort--asc">(asc)</span>
								 <span class="table__sort table__sort--desc">(desc)</span>
							 </th>
							 <th class="table__head table__head--right table__head--average-income" @click="${(e) => this.__sortByCalculatedIncome(e, this.averageIncome)}">Average income 
								 <span class="table__sort table__sort--asc">(asc)</span>
								 <span class="table__sort table__sort--desc">(desc)</span>
							 </th>
							 <th class="table__head table__head--right table__head--last-income" @click="${(e) => this.__sortByCalculatedIncome(e, this.lastMonthIncome)}">Last month income 
								 <span class="table__head-month">${this.lastMonth}</span> 
								 <span class="table__sort table__sort--asc">(asc)</span>
								 <span class="table__sort table__sort--desc">(desc)</span>
							 </th>
						</tr>
					</thead>
					<tbody class="table__body">
						   ${this.__generateTable(this.filteredCompanies)}
					</tbody>
				</table>
			</div>
			${this.__generatePaginationButtons()}
		</div>
        `
	}

	__generatePaginationButtons() {
		return html`
		<div class="companies__pagination pagination">
			<button class="pagination-button pagination-button--backward" @click="${(e) => this.__pagination(e)}">Previous</button>
			<button class="pagination-button pagination-button--info" disabled>Page ${this.currentPage} of ${this.numberOfPages}</button>
			<button class="pagination-button pagination-button--forward" @click="${(e) => this.__pagination(e)}">Next</button>
		</div>
		`
	}

	__pagination(e) {
		const paginationButton = e.target;
		const paginateForward = paginationButton.classList.contains('pagination-button--forward');
		if (paginateForward) {
			if (this.currentPage < this.numberOfPages) this.currentPage += 1;
		} else {
			if (this.currentPage > 1) this.currentPage -= 1;
		}
		this.__toggleDisabledPaginationButtons();
	}

	__setCurrentPage() {
		if (this.numberOfPages === 0) {
			this.currentPage = 0;
		} else if (this.numberOfPages === 1) {
			this.currentPage = 1;
		} else if (this.currentPage > this.numberOfPages) {
			this.currentPage = this.numberOfPages;
		} else if (this.currentPage === 0 && this.numberOfPages > 0) {
			this.currentPage = 1;
		}
		this.__toggleDisabledPaginationButtons();
	}

	__toggleDisabledPaginationButtons() {
		const forwardButton = this.shadowRoot.querySelector('.pagination-button--forward');
		const backwardButton = this.shadowRoot.querySelector('.pagination-button--backward');
		if (forwardButton && backwardButton) {
			forwardButton.disabled = false
			backwardButton.disabled = false;
			if (this.numberOfPages < 2) {
				forwardButton.disabled = true;
				backwardButton.disabled = true;
			} else if (this.currentPage === 1) {
				backwardButton.disabled = true;
			} else if (this.currentPage === this.numberOfPages) {
				forwardButton.disabled = true;
			}
		}
	}

	__generateTable(filteredCompanies) {
		this.__setCurrentPage();
		let firstRecordToShowIndex = 0;
		if (this.currentPage !== 1) {
			firstRecordToShowIndex = this.numberOfRecordsToShow * (this.currentPage - 1);
		}
		const lastRecordToShowIndex = firstRecordToShowIndex + this.numberOfRecordsToShow;
		const companiesToShow = filteredCompanies.slice(firstRecordToShowIndex, lastRecordToShowIndex);
		return companiesToShow.map(company => {
			return html`
			<tr class="table__row">
				<td class="table__data table__data--left table__data--left">${company.id}</td>
				<td class="table__data table__data--left class="table__data table__data--right" ">${company.name}</td>
				<td class="table__data table__data--left">${company.city}</td>
				${this.__getCompanyTotalIncome(company.id)}
				${this.__getCompanyAverageIncome(company.id)}
				${this.__getLastMonthIncome(company.id)}
			</tr>
			`
		})
	}

	__getCompanyTotalIncome(companyId) {
		if (this.calculatedFinancialData.length === 0) return html`<td></td>`;
		const companyCalculatedData = this.calculatedFinancialData.find(calculatedData => calculatedData.id === companyId);
		const companyTotalIncome = companyCalculatedData.totalIncome;
		return html`
		<td class="table__data table__data--right">${companyTotalIncome}</td>
		`
	}

	__getCompanyAverageIncome(companyId) {
		if (this.calculatedFinancialData.length === 0) return html`<td></td>`;
		const companyCalculatedData = this.calculatedFinancialData.find(calculatedData => calculatedData.id === companyId);
		const companyAverageIncome = companyCalculatedData.averageIncome;
		return html`
		<td class="table__data table__data--right">${companyAverageIncome}</td>
		`
	}

	__getLastMonthIncome(companyId) {
		if (this.calculatedFinancialData.length === 0) return html`<td></td>`;
		const companyCalculatedData = this.calculatedFinancialData.find(calculatedData => calculatedData.id === companyId);
		const lastMonthIncome = companyCalculatedData.lastMonthIncome;
		return html`
		<td class="table__data table__data--right">${lastMonthIncome}</td>
		`
	}

	__sort(e, sortBy) {
		let targetElement = e.target;
		console.log(targetElement);
		if (targetElement.tagName === "SPAN") targetElement = targetElement.parentElement;
		const sortedByTargetElementAsc = targetElement.classList.contains('asc');
		const descInfo = targetElement.querySelector('.table__sort--desc');
		const ascInfo = targetElement.querySelector('.table__sort--asc');
		this.__removeSortClassFromPreviousElement();
		if (sortedByTargetElementAsc) {
			this.filteredCompanies = [...this.filteredCompanies.sort((a, b) => (a[sortBy] < b[sortBy]) ? 1 : ((b[sortBy] < a[sortBy]) ? -1 : 0))];
			targetElement.classList.remove('asc');
			targetElement.classList.add('desc')
			descInfo.classList.add('table__sort--show');
			ascInfo.classList.remove('table__sort--show');
			this.sortDirection = 'desc';
		} else {
			this.filteredCompanies = [...this.filteredCompanies.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0))];
			targetElement.classList.remove('desc');
			targetElement.classList.add('asc')
			descInfo.classList.remove('table__sort--show');
			ascInfo.classList.add('table__sort--show');
			this.sortDirection = 'asc';
		}
	}

	__sortByCalculatedIncome(e, incomeType) {
		let targetElement = e.target;
		if (targetElement.tagName === "SPAN") targetElement = targetElement.parentElement;
		const sortedByTargetElementAsc = targetElement.classList.contains('asc');
		const descInfo = targetElement.querySelector('.table__sort--desc');
		const ascInfo = targetElement.querySelector('.table__sort--asc');
		this.__removeSortClassFromPreviousElement();
		if (sortedByTargetElementAsc) {
			this.__sortFilteredCompanies(incomeType, 'desc');
			targetElement.classList.remove('asc');
			targetElement.classList.add('desc');
			descInfo.classList.add('table__sort--show');
			ascInfo.classList.remove('table__sort--show');
			this.sortDirection = 'desc';
		} else {
			this.__sortFilteredCompanies(incomeType, 'asc');
			targetElement.classList.remove('desc');
			targetElement.classList.add('asc');
			descInfo.classList.remove('table__sort--show');
			ascInfo.classList.add('table__sort--show');
			this.sortDirection = 'asc';
		}
	}

	__sortFilteredCompanies(incomeType, sortDirection) {
		this.calculatedFinancialData = [...this.calculatedFinancialData.sort((a, b) => {
			return (Number(a[incomeType]) > Number(b[incomeType])) ? 1 : ((Number(b[incomeType]) > Number(a[incomeType])) ? -1 : 0);
		})];
		this.filteredCompanies = [...this.filteredCompanies.sort((a, b) => {
			const aCompanyFinancialData = this.calculatedFinancialData.find(companyFinance => companyFinance.id === a.id);
			const bCompanyFinancialData = this.calculatedFinancialData.find(companyFinance => companyFinance.id === b.id);
			if (sortDirection === 'desc') {
				return this.calculatedFinancialData.indexOf(bCompanyFinancialData) - this.calculatedFinancialData.indexOf(aCompanyFinancialData);
			}
			return this.calculatedFinancialData.indexOf(aCompanyFinancialData) - this.calculatedFinancialData.indexOf(bCompanyFinancialData);
		})];
	}

	__removeSortClassFromPreviousElement() {
		const previousElementSortedAsc = this.shadowRoot.querySelector('.asc');
		const previousElementSortedDesc = this.shadowRoot.querySelector('.desc');
		const previousElementSortInfo = this.shadowRoot.querySelector('.table__sort--show');
		if (previousElementSortInfo) previousElementSortInfo.classList.remove('table__sort--show');
		if (previousElementSortedAsc) {
			previousElementSortedAsc.classList.remove('asc');
		} else if (previousElementSortedDesc) {
			previousElementSortedDesc.classList.remove('desc')
		}
	}

	__calculateFinancialData() {
		this.companies.forEach(company => {
			const nextCompany = {};
			nextCompany.id = company.id;
			this.calculatedFinancialData.push(nextCompany);
		});
		this.__calculateTotalCompaniesIncome();
		this.__calculateAverageCompaniesIncome();
		this.__calculateLastMonthIncome();
	}

	__calculateTotalCompaniesIncome() {
		this.calculatedFinancialData.forEach(financialData => {
			const companyFinance = this.companiesFinancialData.find(fin => fin.id === financialData.id);
			const companySumOfIncome = companyFinance.incomes.reduce((sum, income) => {
				return Number(sum) + Number(income.value)
			}, 0);
			financialData.totalIncome = companySumOfIncome.toFixed(2);
		})
	}

	__calculateAverageCompaniesIncome() {
		this.calculatedFinancialData.forEach(financialData => {
			const companyFinance = this.companiesFinancialData.find(fin => fin.id === financialData.id);
			const numberOfMonths = companyFinance.incomes.length;
			const averageIncome = financialData.totalIncome / numberOfMonths;
			financialData.averageIncome = averageIncome.toFixed(2);
		})
	}

	__calculateLastMonthIncome() {
		const lastMonthRegex = new RegExp("^" + this.lastMonth);
		this.calculatedFinancialData.forEach(financialData => {
			const companyFinance = this.companiesFinancialData.find(fin => fin.id === financialData.id);
			const lastMonthIncomes = companyFinance.incomes.filter(monthlyIncome => lastMonthRegex.test(monthlyIncome.date));
			const summaryLastMonthIncome = lastMonthIncomes.reduce((a, b) => {
				return Number(a) + Number(b.value);
			}, 0);
			financialData.lastMonthIncome = summaryLastMonthIncome.toFixed(2);
		});
	}

	__findLastMonth() {
		const lastFinanceData = this.companiesFinancialData.map(financialData => {
			return financialData.incomes.reduce((x, y) => {
				return (x.date > y.date) ? x : y
			});
		})
		const latestFinancialData = lastFinanceData.reduce((x, y) => {
			return (x.date > y.date) ? x : y;
		});
		this.lastMonth = latestFinancialData.date.slice(0, 7);
	}

}
