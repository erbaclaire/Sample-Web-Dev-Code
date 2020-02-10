// On load of page 1) add stock symbols to drop down menu 2) load stock portfolio
document.addEventListener("DOMContentLoaded", loadPage);
async function loadPage(e) {
	e.preventDefault();
	console.log(e);
	let http_response = await fetch("https://cloud.iexapis.com/stable/stocksUSNoUTP?token=sk_0b2fe21aa32342e7b0a1806dff4beaf6");
	let data = await http_response.json();
	const select = document.querySelector("select");
	console.log(data);
	for (symbol of data) {
		console.log(symbol);
		let option = document.createElement("option");
		let text = document.createTextNode(symbol);
		option.appendChild(text);
		select.appendChild(option);
	}
}


// Purchase stock and add it to the stock portfolio
function buyStock(e) {
	e.preventDefault;
	console.log(e);
	const symbol = document.querySelector("#symbol");
	const shares = document.querySelector("#shares");
	const total = document.querySelector("#total");
	let stocks = document.querySelector("#stocks tbody");

	let newRow = document.createElement("tr");
	let newCol = document.createElement("td");
	let newSymbol = document.createTextNode(symbol);
	newCol.appendChild(newSymbol);
	newRow.appendChild(newCol);
	let newCol2 = document.createElement("td");
	let newShares = document.createTextNode(shares);
	newCol2.appendChild(newShares);
	newRow.appendChild(newCol);
	let newCol3 = document.createElement("td");
	let newTotal = document.createTextNode(total);
	newCol3.appendChild(newShares);
	newRow.appendChild(newCol);
	stocks.appendChild(newRow);
}
document.querySelector("#buy").addEventListener("submit", buyStock);