export const calculateLatestMonthCompanyIncome = (companyId, companiesFinancialData) => {
	const companyFinance = companiesFinancialData.find(fin => {
			return fin.id === companyId
		}
	);
	const latestMonthData = companyFinance.incomes.reduce((x, y) => {
		return (x.date > y.date) ? x : y
	});
	return latestMonthData.value;
}
