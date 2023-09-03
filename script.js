function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    const apiKey = 'dZrSUNazpzTe1hLcYkgCytFys0ukJasdUnnsMTJl';

    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

                       const currentImageContainer = document.getElementById('current-image-container');
            currentImageContainer.innerHTML = `
                <img src="${data.url}" alt="${data.title}">
                <h3>${data.title}</h3>
                <p>${data.explanation}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            
        });
}

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
        
             const pageTitle = document.getElementById('page-title');
             pageTitle.textContent = `Picture on ${date}`;

           
            const currentImageContainer = document.getElementById('current-image-container');
            currentImageContainer.innerHTML = `
                <img src="${data.url}" alt="${data.title}">
                <h3>${data.title}</h3>
                <p>${data.explanation}</p>
            `;
            
         
            saveSearch(date);
            
          
            addSearchToHistory(date);
            limitSearchHistory();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
    
        });
}

function saveSearch(date) {

    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    

    searches.push(date);
    
   
    localStorage.setItem('searches', JSON.stringify(searches));
}


function addSearchToHistory(date) {
   
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    

    const searchHistoryList = document.getElementById('search-history');
    searchHistoryList.innerHTML = '';
    
    searches.forEach(searchDate => {
        const listItem = document.createElement('li');
        listItem.textContent = searchDate;
        
 
        listItem.addEventListener('click', () => {
      
            getImageOfTheDay(searchDate);
        });
        
        searchHistoryList.appendChild(listItem);
    });
}


getCurrentImageOfTheDay();

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input');
    const selectedDate = searchInput.value;

    getImageOfTheDay(selectedDate);
});

function limitSearchHistory() {
    const searchHistoryList = document.getElementById('search-history');
    const searchItems = searchHistoryList.querySelectorAll('li');

    if (searchItems.length >= 10) {

        const itemsToRemove = searchItems.length - 10;
        for (let i = 0; i < itemsToRemove; i++) {
            searchHistoryList.removeChild(searchItems[i]);
        }
    }
}

function isValidDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return false; 
    }

    const enteredDate = new Date(date);
    const currentDate = new Date();
    return enteredDate <= currentDate;
}
