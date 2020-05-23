import {
	LitElement,
	html,
	nothing
} from "lit-element";
import {calculateLatestMonthCompanyIncome} from "../../utils/helpersMethods";

export class Search extends LitElement {
	static get styles() {
		return []
	}

	static get properties() {
		return {
			companies: {type: Array},
			filteredCompanies: {type: Array},
			financialData: {type: Array}
		};
	}

	constructor() {
		super();
		this.companies = [];
		this.filteredCompanies = [];
		this.financialData = [];
	}

	filterCompanies(userInput) {
		this.filteredCompanies = this.companies.filter(company => {
				const companiesContainsPhrase = `${company.id} ${company.name} ${company.city}`
					.toLowerCase()
					.includes(userInput.toLowerCase());
const lastMonthIncomeContainsPhrase = calculateLatestMonthCompanyIncome(company.id, this.financialData).includes(userInput);
			return companiesContainsPhrase || lastMonthIncomeContainsPhrase;
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
		const inputElement = this.shadowRoot.querySelector("#search");
		this.filterCompanies(inputElement.value);
		console.log(inputElement.value);
	}

	render() {
		return html`
		<input id="search" type="text" @input="${this.updateUserInput}"/>
		`
	}

}
