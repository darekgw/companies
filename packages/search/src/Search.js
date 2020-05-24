import {
	LitElement,
	html,
	nothing
} from "lit-element";
import {searchStyles} from "../styles/Search.styles";
import {calculateLatestMonthCompanyIncome, findInTotalCompanyIncome, findAverageCompanyIncome} from "../../utils/helpersMethods";

export class Search extends LitElement {
	static get styles() {
		return [
			searchStyles()
		]
	}

	static get properties() {
		return {
			companies: {type: Array},
			filteredCompanies: {type: Array},
			financialData: {type: Array},
			calculatedFinancialData: {type: Array}
		};
	}

	constructor() {
		super();
		this.companies = [];
		this.filteredCompanies = [];
		this.financialData = [];
		this.calculatedFinancialData = [];
	}

	filterCompanies(userInput) {
		this.filteredCompanies = this.companies.filter(company => {
				const companiesContainsPhrase = `${company.id} ${company.name} ${company.city}`
					.toLowerCase()
					.includes(userInput.toLowerCase());
const lastMonthIncomeContainsPhrase = calculateLatestMonthCompanyIncome(company.id, this.financialData).includes(userInput);
const totalCompanyIncomeContainsPhrase = findInTotalCompanyIncome(company.id, this.calculatedFinancialData).includes(userInput);
				const averageCompanyIncomeContainsPhrase = findAverageCompanyIncome(company.id, this.calculatedFinancialData).includes(userInput);
			return companiesContainsPhrase || lastMonthIncomeContainsPhrase || totalCompanyIncomeContainsPhrase || averageCompanyIncomeContainsPhrase;
			}
		);
		console.log(this.filteredCompanies);
		let userFilteredCompanies = new CustomEvent("filteredCompany", {
			detail: {
				filteredCompanies: this.filteredCompanies
			},
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(userFilteredCompanies);
	}

	updateUserInput(e) {
		console.log(e);
		const inputElement = this.shadowRoot.querySelector("#company-search");
		this.filterCompanies(inputElement.value);
		console.log(inputElement.value);
	}

	render() {
		return html`
<div class="search">
<label for="company-search" class="search__title">Search companies data</label>
		<input class="search__input" id="company-search" type="text" @input="${this.updateUserInput}"/>
		</div>
		`
	}

}
