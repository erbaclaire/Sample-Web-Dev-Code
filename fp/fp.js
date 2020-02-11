// Load user's stock portfolio when pages loads
console.log(localStorage);
document.addEventListener("DOMContentLoaded", loadStockPortfolio);
function loadStockPortfolio(localStorage) {
	for (item in localStorage) {
		
	}
}

// When user types in stock symbol, fill in price
async function logPrice(e) {
	e.preventDefault();
	console.log(e);
  	const symbolInput = document.querySelector("#symbol");
  	const symbolValue = symbolInput.value;
	let http_response = await fetch("https://cloud.iexapis.com/stable/stock/market/batch?symbols=" + symbolValue + "&types=quote&token=sk_0b2fe21aa32342e7b0a1806dff4beaf6");
	let data = await http_response.json();
	console.log(data);
	let pps = document.querySelector("#pps");
	pps.value = data[symbolValue].quote.latestPrice
}
document.addEventListener("input", logPrice);

// When user enters the shares they want, fill in the total
async function logTotal(e) {
	e.preventDefault();
	console.log(e);
  	const sharesInput = document.querySelector("#shares");
  	const sharesValue = sharesInput.value;
  	const totalCost = document.querySelector("#total");
  	const pps = document.querySelector("#pps");
  	totalCost.value = pps.value*sharesValue
}
document.addEventListener("input", logTotal);

// Purchase stock and add it to the stock portfolio
function buyStock(e) {
	e.preventDefault();
	console.log(e);
	const symbolInput = document.querySelector("#symbol");
	const symbolValue = symbolInput.value;
	const ppsInput = document.querySelector("#pps");
	const ppsValue = ppsInput.value;
	const sharesInput = document.querySelector("#shares");
	const sharesValue = sharesInput.value;
	const totalInput = document.querySelector("#total");
	const totalValue = totalInput.value;
	let stocks = document.querySelector("#stocks tbody");

	// If some of stock is not already purchased
	let newRow = document.createElement("tr");
	let newCol = document.createElement("td");
	let newSymbol = document.createTextNode(symbolValue);
	newCol.appendChild(newSymbol);
	newRow.appendChild(newCol);

	let newCol2 = document.createElement("td");
	let newShares = document.createTextNode(sharesValue);
	newCol2.appendChild(newShares);
	newRow.appendChild(newCol2);

	let newCol3 = document.createElement("td");
	let newPrice = document.createTextNode("$" + ppsValue);
	newCol3.appendChild(newPrice);
	newRow.appendChild(newCol3);	

	let newCol4 = document.createElement("td");
	let newTotal = document.createTextNode("$" + totalValue);
	newCol4.appendChild(newTotal);
	newRow.appendChild(newCol4);

	let newCol5 = document.createElement("td");
	let newInitial = document.createTextNode("$" + totalValue);
	newCol5.appendChild(newInitial);
	newRow.appendChild(newCol5);

	let newCol6 = document.createElement("td");
	let newPL = document.createTextNode("$" + 0);
	newCol6.appendChild(newPL);
	newCol6.style.color = "green";
	newRow.appendChild(newCol6);

	stocks.appendChild(newRow);

	var portfolioData = [sharesValue, totalValue];
	localStorage.setItem(symbolValue, JSON.stringify(portfolioData));
}
document.querySelector("#purchase-stock").addEventListener("submit", buyStock);