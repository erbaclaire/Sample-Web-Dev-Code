/* Sources:
	1. selector with variable: https://stackoverflow.com/questions/37081721/use-variables-in-document-queryselector
	2. this: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
	3. jQuery remove: https://api.jquery.com/remove/
*/

/* Filter stations */
function filterStations(e) {
	e.preventDefault()
	console.log(e)
	const stations = document.querySelectorAll("#stations tr")
	for (station of stations) {
		if (station.className === this.value || this.value === "all") {
			station.style.display = "block"
		} else { 
			station.style.display = "none"
		}
	}
}

const select = document.querySelector("select")
select.addEventListener("change", filterStations)

/* Favorite and un-favorite a station */
function favStation(e) {
	e.preventDefault()
	console.log(e)
  	let favorites = document.querySelector("#favorites tbody")
	const station = this.parentElement.parentElement.querySelector(':nth-child(2)').textContent
	if (this.innerHTML === "\u2661") {
		this.innerHTML = "&#9829;"
		let newRow = document.createElement("tr")
		let newCol = document.createElement("td")
		let newFav = document.createTextNode(station)
		newRow.setAttribute("id", station)
		newCol.appendChild(newFav)	
		newRow.appendChild(newCol)
		favorites.appendChild(newRow)
	} else {
		this.innerHTML = "&#9825;"
		const favStation = document.querySelector("[id=" + CSS.escape(station) + "]")
		$(favStation).remove();
	}
}

const stations = document.querySelectorAll(".fave")
for (station of stations) {
	station.addEventListener("click", favStation)
}