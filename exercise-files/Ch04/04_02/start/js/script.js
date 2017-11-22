"use strict";

(function() {
	const url = "http://api.openweathermap.org/data/2.5/weather?q=";
	const apiKey = "9a3cbcffa8095bf058e5356342758144"; // Replace "APIKEY" with your own API key; otherwise, your HTTP request will not work
	const activities = {
		teamIn: ['basketball','hockey','volleyball'],
		teamOutWarm: ['softball/baseball','football/soccer','American football','rowing','tennis','volleyball','ultimate frisbee','rugby'],
		teamOutCold: ['hockey'],
		soloIn: ['rock climbing','swimming','ice skating'],
		soloOutWarm: ['rowing','running','hiking','cycling','rock climbing'],
		soloOutCold: ['snowshoeing','downhill skiing','cross-country skiing','ice skating']
	}
	let state = {};
	let category = 'all';

	// get weather data when user clicks Forecast button, then add temp & conditions to view
	// $('.forecast-button').click(function(e) {
	// 	e.preventDefault();
	// 	const location = $('#location').val();
	// 	$('#location').val('');

	// 	$.get(url + location + '&appid=' + apiKey).done(function(response) {
	// 		updateUISuccess(response);
	// 	}).fail(function() {
	// 		updateUIFailure();
	// 	});
	// });

	// $('.forecast-button').click(function(e) {
		document.querySelector('.forecast-button').addEventListener('click', function(e) {

		e.preventDefault();
		//const location = $('#location').val(); // whatever user types in location input field
		const location = document.querySelector('#location').value;
		// $('#location').val(''); // sets beginning state to empty string
		document.querySelector('#location').value = '';

		fetch(url + location + '&appid=' + apiKey).then(function(response) {
			return(response.json()); // calls response,json method to get json data from open weather map
		}).then(function(response) {
			updateUISuccess(response);
		}).catch(function() {
			updateUIFailure();
		});
	}, false);

	// update list of sports when user selects a different category (solo/team/all)
	// $('.options div').on('click', updateActivityList);
	document.querySelectorAll('.options div').forEach(function(el) {
		el.addEventListener('click', updateActivityList, false);
	});

	// handle ajax success
	function updateUISuccess(response) {
		const degC = response.main.temp - 273.15;
		const degCInt = Math.floor(degC);
		const degF = degC * 1.8 + 32;
		const degFInt = Math.floor(degF);
		state = {
			condition: response.weather[0].main,
			icon: "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png",
			degCInt: Math.floor(degCInt),
			degFInt: Math.floor(degFInt),
			city: response.name
		};

		//const $into = $('.conditions')[0]; // selecting the DOM element where the React component that follows will be rendered
		const into = document.querySelector('.conditions');
		// ReactDOM.render(<Forecast {...state} />, $into);
		// ReactDOM.render(<Forecast {...state} />, into);

		// function Forecast(props) {
		// 	return (
		// 		<div>
		// 			<p className="city">{props.city}</p>
		// 			<p>{props.degCInt}&#176; C / {props.degFInt}&#176; F <img src={props.icon} alt={props.condition} /></p>
		// 		</div>
		// 	)
		// }

		// start with js statements to create elements - need to create 4 elements

		let container = document.createElement('div'); // container for weather data
		let cityPara = document.createElement('p'); // p for city info data
		cityPara.setAttribute('class', 'city'); // sets value of class attr to string city
		// .innerHTML has security risks bc it exposes html elements so avoid it
		// .textContent is safer, it doesnt parse anyt html in the values
		cityPara.textContent = state.city;
		let conditionsPara = document.createElement('p'); // p for weather conditions data
		conditionsPara.textContent = state.degCInt + '\u00B0 C / ' + state.degFInt + '\u00B0 F /';// degCInt = celsius temp value and degFInt = farenheit temp value
		// use unicode versions of html codes for &#176; when using vanilla js
		let iconImage = document.createElement('img'); // image element for weather icon
		iconImage.setAttribute('src', state.icon); // param that is storing the alt text value
		iconImage.setAttribute('alt', state.condition); // brief descr. of  the weather
		updateActivityList();
	}

	// handle selection of a new category (team/solo/all) 
	function updateActivityList(event) {
		// if (event !== undefined && $(this).hasClass('selected')) {
			if (event !== undefined && event.target.classList.contains('selected')) { // event.target is a reference to the element that the event happened to
			// if the 'event' parameter is defined, then a tab has been clicked; if not, then this is the
			//   default case and the view simply needs to be updated
			// if the clicked tab has the class 'selected', then no need to change location of 'selected' class
			//   or change the DOM
			return true;
		// } else if (event !== undefined && !$(this).hasClass('selected')) {
			} else if (event !== undefined && !event.target.classList.contains('selected')) {
			// if the 'event' parameter is defined, then a tab has been clicked
			// if the clicked tab does not have the class 'selected', then location of 'selected' class must be added
			//   to the clicked element and removed from its siblings
			// category = $(this).attr('id');
			category = event.target.id; // use event.target to reference the element that was clicked including its attributes
			//$('.options div').removeClass('selected'); // three tabs in activity results section
			document.querySelectorAll('.options div').forEach(function(el) {
				// for each element we want to remove a class value, use classList property bc it is part of each element already
				 // classList prop: stores a collection of the element's current class values, supports the remove method
				el.classList.remove('selected'); // pass the method the string of the class that you want to remove
			})
			// In JS iteration is not implicit the way it is in jQuery (meaning jQuery applies the method to each of the returned elements)
			// In JS you need to create a loop to iterate through selected elements and transform them one at a time

			// Returned collection for querySelectorAll is not technically an array but it supports many array methods
				// supported method: forEach which lets you easily loop through elements in an array.
				// Chain forEach method to selector, takes a function as its argument
				// Specify el as the param name that lets us reference each element in the collection during the loop

			// $(this).addClass('selected');
			event.target.classList.add('selected'); // adds class value selected to the class list of the target element
		} 

		state.activities = [];
		if (state.condition === "Rain") {
			updateState('In');
		} else if (state.condition === "Snow" || state.degFInt < 50) {
			updateState('OutCold');
		} else {
			updateState('OutWarm');
		}

		function updateState(type) {
			if (category === "solo") {
				state.activities.push(...activities['solo' + type]);
			} else if (category === "team") {
				state.activities.push(...activities['team' + type]);
			} else {
				state.activities.push(...activities['solo' + type]);
				state.activities.push(...activities['team' + type]);
			}
		}

		// const $into = $('.activities')[0];
		const into = document.querySelector('.activities');

		// ReactDOM.render(<Activities {...state} />, $into);
		// ReactDOM.render(<Activities {...state} />, into);

		// function Activities(props) {
		// 	const activitiesList = props.activities.map(function(activity, index) {
		// 		return <li key={index}>{activity}</li>
		// 	});
		// 	return (
		// 		<div>
		// 			<ul>{activitiesList}</ul>
		// 		</div>
		// 	)
		// }

		let activitiesContainer = document.createElement('div');
		let list = document.createElement('ul');
		// need to build out li items for all the elements in the state.activities array
		state.activities.forEach(function(activity, index) { // activity is the text of the li array item and index is the value of the index # for array element
			let listItem = document.createElement('li');
			listItem.textContent = activity;
			listItem.setAttribute('key', index);
		});
		$('.results').slideDown(300);
	}

	// handle ajax failure
	function updateUIFailure() {
		// $(".conditions").text("Weather information unavailable");
		document.querySelector('.conditions').textContent = "Weather information unavailable";
	}
})();