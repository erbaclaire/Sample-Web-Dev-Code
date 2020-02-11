// function to calculate portfolio value
function calculatePortfolioValue() {
	let portfolioValue = document.querySelector("#portfolio-value");
	let netProfit = document.querySelector("#net-profit");
	let stocks = document.querySelectorAll("#stocks tbody tr");
	let totVal = 0;
	let netProf = 0;
	for (stock of stocks) {
		totVal += parseFloat(stock.querySelector(":nth-child(4)").innerHTML);
		netProf += parseFloat(stock.querySelector(":nth-child(6)").innerHTML);
	}
	portfolioValue.innerHTML = parseFloat(totVal).toFixed(2);
	netProfit.innerHTML = "$" + parseFloat(netProf).toFixed(2);
	if (netProf < 0) {
		netProfit.style.color = "red";
	} else {
		netProfit.style.color = "green";
	}
}

// function for adding stock to a portfolio or loading stocks
async function renderPortfolio(symbolValue, sharesValue, initialValue, lastFlag) {
	let stocks = document.querySelector("#stocks tbody");
	let newRow = document.createElement("tr");
	newRow.setAttribute("id", symbolValue);

	// symbol
	let newCol = document.createElement("td");
	let sym = document.createTextNode(symbolValue);
	newCol.appendChild(sym);
	newRow.appendChild(newCol);

	// shares
	let newCol2 = document.createElement("td");
	let shares = document.createTextNode(sharesValue);
	newCol2.appendChild(shares);
	newRow.appendChild(newCol2);

	// current price
	let newCol3 = document.createElement("td");
	let http_response = await fetch("https://cloud.iexapis.com/stable/stock/market/batch?symbols=" + symbolValue + "&types=quote&token=sk_0b2fe21aa32342e7b0a1806dff4beaf6");
	let data = await http_response.json();
	let pps= document.createTextNode(parseFloat(data[symbolValue].quote.latestPrice).toFixed(2));	
	newCol3.appendChild(pps);
	newRow.appendChild(newCol3);	

	// total value
	let newCol4 = document.createElement("td");
	let total = document.createTextNode(parseFloat(data[symbolValue].quote.latestPrice*sharesValue).toFixed(2));	
	newCol4.appendChild(total);
	newRow.appendChild(newCol4);

	// initial value
	let newCol5 = document.createElement("td");
	let initial = document.createTextNode(parseFloat(initialValue).toFixed(2));	
	newCol5.appendChild(initial);
	newRow.appendChild(newCol5);

	// profit/loss
	let newCol6 = document.createElement("td");
	let pl = document.createTextNode(parseFloat((data[symbolValue].quote.latestPrice*sharesValue) - initialValue).toFixed(2));
	newCol6.appendChild(pl);
	if (((data[symbolValue].quote.latestPrice*sharesValue) - initialValue) < 0) {
		newCol6.style.color = "red";
	} else {
		newCol6.style.color = "green";
	}
	newRow.appendChild(newCol6);

	// sell button - can only sell up to as much as they have
	let newCol7 = document.createElement("td");
	let newForm = document.createElement("form");
	newForm.setAttribute("id", "sell" + symbolValue);
	let newDiv = document.createElement("div");
	newDiv.setAttribute("class", "form-group row");
	let newDiv2 = document.createElement("div");
	newDiv2.setAttribute("class", "col-7");
	let newInput = document.createElement("input");
	newInput.setAttribute("type", "number");
	newInput.setAttribute("class", "form-control");
	newInput.setAttribute("placeholder", "Shares");
	newInput.setAttribute("max", sharesValue);
	newInput.setAttribute("min", 1);
	newDiv2.appendChild(newInput);
	newDiv.appendChild(newDiv2);
	let newDiv3 = document.createElement("div");
	newDiv3.setAttribute("class", "col-5");
	let newButton = document.createElement("button");
	newButton.setAttribute("type", "submit");
	newButton.setAttribute("class", "btn btn-primary");
	newButton.innerHTML = "Sell";
	newDiv3.appendChild(newButton);
	newDiv.appendChild(newDiv3);
	newForm.appendChild(newDiv);
	newCol7.appendChild(newForm);
	newRow.appendChild(newCol7);

	stocks.appendChild(newRow);	

	// calculate total value and net profit of portfolio
	if (lastFlag === 1) {
		calculatePortfolioValue();
	}
}

// load user's stock portfolio when pages loads
function loadStockPortfolio(e) {
	e.preventDefault();
	console.log(e);
	// render the stock portfolio
	for (var i = 0; i < localStorage.length; i++) {
		if (i === localStorage.length - 1) {
			var lastFlag = 1
		} else {
			var lastFlag = 0
		}
	    var key   = localStorage.key(i);
	    var value = JSON.parse(localStorage.getItem(key));
	    renderPortfolio(key, value[0], value[1], lastFlag) 
	}	
}
document.addEventListener("DOMContentLoaded", loadStockPortfolio);

// when user types in stock symbol, fill in price
async function logPrice(e) {
	e.preventDefault();
	console.log(e);
  	const symbolValue = document.querySelector("#symbol").value;
	let http_response = await fetch("https://cloud.iexapis.com/stable/stock/market/batch?symbols=" + symbolValue + "&types=quote&token=sk_0b2fe21aa32342e7b0a1806dff4beaf6");
	let data = await http_response.json();
	console.log(data);
	let pps = document.querySelector("#pps");
	pps.value = data[symbolValue].quote.latestPrice
}
document.addEventListener("input", logPrice);

// when user enters the shares they want, fill in the total
function logTotal(e) {
	e.preventDefault();
	console.log(e);
  	const sharesValue = document.querySelector("#shares").value;
  	const totalCost = document.querySelector("#total");
  	const pps = document.querySelector("#pps");
  	totalCost.value = pps.value*sharesValue
}
document.addEventListener("input", logTotal);

// purchase stock and add it to the stock portfolio
function buyStock(e) {
	e.preventDefault();
	console.log(e);
	const symbolValue = document.querySelector("#symbol").value;
	const sharesValue = document.querySelector("#shares").value;
	const initialValue = document.querySelector("#total").value;
	let stocks = document.querySelector("#stocks tbody");

	// to determine if stock is already in the portfolio
	let alreadyInPortfolio = 0;
	const rows = document.querySelectorAll("#stocks tbody tr");
	for (row of rows) {
		if (symbolValue === row.id) {
			alreadyInPortfolio = 1
		}
	}
	
	// if some of stock is not already purchased, then add everything
	if (alreadyInPortfolio === 0) {
		renderPortfolio(symbolValue, sharesValue, initialValue, 1);

		// update data that needs to be preserved - symbol, shares, and initial value - to local storage
		var portfolioData = [sharesValue, initialValue];
		localStorage.setItem(symbolValue, JSON.stringify(portfolioData));

	} else { // If some of stock is already purchased, then update shares, total, initial, and profit/loss
		// update shares
		const stock = document.querySelector("[id=" + CSS.escape(symbolValue) + "]");
		const oldShares = stock.querySelector(":nth-child(2)").innerHTML;
		stock.querySelector(":nth-child(2)").innerHTML = parseInt(parseFloat(oldShares) + parseFloat(sharesValue));
		newShares = parseInt(stock.querySelector(":nth-child(2)").innerHTML)

		// update total
		const pps = stock.querySelector(":nth-child(3)").innerHTML;
		stock.querySelector(":nth-child(4)").innerHTML = parseFloat(newShares*parseFloat(pps)).toFixed(2);
		newTotal = stock.querySelector(":nth-child(4)").innerHTML

		// update initial
		const oldInitial = stock.querySelector(":nth-child(5)").innerHTML;
		stock.querySelector(":nth-child(5)").innerHTML = parseFloat(parseFloat(oldInitial) + parseFloat(initialValue)).toFixed(2);
		const newInitial = stock.querySelector(":nth-child(5)").innerHTML;

		// update P&L
		stock.querySelector(":nth-child(6)").innerHTML = parseFloat(parseFloat(newTotal) - parseFloat(newInitial)).toFixed(2);
		if (parseFloat(newTotal) - parseFloat(newInitial) < 0) {
			stock.querySelector(":nth-child(6)").style.color = "red"
		} else {
			stock.querySelector(":nth-child(6)").style.color = "green"
		}

		// update amount you can sell
		let sell = stock.querySelector(":nth-child(7) form div div input");
		sell.max = newShares;

		// update data that needs to be preserved - symbol, shares, and initial value - to local storage
		var portfolioData = [newShares, newInitial];
		localStorage.setItem(symbolValue, JSON.stringify(portfolioData));

		// recalculate total value and net profit
		calculatePortfolioValue() 
	}
}
document.querySelector("#purchase-stock").addEventListener("submit", buyStock);

// sell shares
