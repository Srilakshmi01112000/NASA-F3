function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    const apiKey = 'dZrSUNazpzTe1hLcYkgCytFys0ukJasdUnnsMTJl';

    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            // Display the image of the day in the "current-image-container"
            const currentImageContainer = document.getElementById('current-image-container');
            currentImageContainer.innerHTML = `
                <img src="${data.url}" alt="${data.title}">
                <h3>${data.title}</h3>
                <p>${data.explanation}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle errors and display an appropriate message
        });
}

// Example getImageOfTheDay function
function getImageOfTheDay(date) {
    const apiKey = 'dZrSUNazpzTe1hLcYkgCytFys0ukJasdUnnsMTJl';

    if (!isValidDate(date)) {
        alert("Please select a valid date .");
        return;
    }

    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
             // Update the h1 text content with the selected date
             const pageTitle = document.getElementById('page-title');
             pageTitle.textContent = `Picture on ${date}`;

            // Display the image of the day in the "current-image-container"
            const currentImageContainer = document.getElementById('current-image-container');
            currentImageContainer.innerHTML = `
                <img src="${data.url}" alt="${data.title}">
                <h3>${data.title}</h3>
                <p>${data.explanation}</p>
            `;
            
            // Save the selected date to local storage
            saveSearch(date);
            
            // Add the selected date to the search history list
            addSearchToHistory(date);
            limitSearchHistory();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle errors and display an appropriate message
        });
}

// Example saveSearch function
function saveSearch(date) {
    // Retrieve the existing searches from local storage (if any)
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    
    // Add the new date to the searches array
    searches.push(date);
    
    // Save the updated searches array to local storage
    localStorage.setItem('searches', JSON.stringify(searches));
}

// Example addSearchToHistory function
function addSearchToHistory(date) {
    // Retrieve the saved search dates from local storage
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    
    // Display the search history as an unordered list in the UI
    const searchHistoryList = document.getElementById('search-history');
    searchHistoryList.innerHTML = '';
    
    searches.forEach(searchDate => {
        const listItem = document.createElement('li');
        listItem.textContent = searchDate;
        
        // Add a click event listener to each search history item
        listItem.addEventListener('click', () => {
            // When clicked, fetch and display the data for that specific date
            getImageOfTheDay(searchDate);
        });
        
        searchHistoryList.appendChild(listItem);
    });
}

// Call getCurrentImageOfTheDay when the page loads
getCurrentImageOfTheDay();

// Add an event listener to the search form
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input');
    const selectedDate = searchInput.value;
    
    // Call getImageOfTheDay with the selected date
    getImageOfTheDay(selectedDate);
});
// Function to limit the number of previous searches to 10
function limitSearchHistory() {
    const searchHistoryList = document.getElementById('search-history');
    const searchItems = searchHistoryList.querySelectorAll('li');

    if (searchItems.length >= 10) {
        // Remove the oldest search(s) if there are more than 10
        const itemsToRemove = searchItems.length - 10;
        for (let i = 0; i < itemsToRemove; i++) {
            searchHistoryList.removeChild(searchItems[i]);
        }
    }
}
// Function to validate the date input
function isValidDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return false; // Invalid date format
    }

    const enteredDate = new Date(date);
    const currentDate = new Date();

    // Compare the entered date with the current date
    return enteredDate <= currentDate;
}
