export const findInTotalCompanyIncome = (companyId, calculatedFinancialData) => {
	const companyFinance = calculatedFinancialData.find(fin => {
			return fin.id === companyId
		}
	);
	return companyFinance.totalIncome;
}

export const findAverageCompanyIncome = (companyId, calculatedFinancialData) => {
	const companyFinance = calculatedFinancialData.find(fin => {
			return fin.id === companyId
		}
	);
	return companyFinance.averageIncome;
}

export const findLastMonthCompanyIncome = (companyId, calculatedFinancialData) => {
	const companyFinance = calculatedFinancialData.find(fin => {
			return fin.id === companyId
		}
	);
	return companyFinance.lastMonthIncome;
}
