let eventos = [];

function initializeEvents() {
    setupSearch();
    handleSearch();
}

function handleSearch(event) {
    if (event) {
        event.preventDefault();
    }
    const city = document.getElementById('voice-search').value.trim();
    searchEvents(city);
}

function setupSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchButton = document.getElementById('searchButton');

    searchForm.addEventListener('submit', handleSearch);
    searchButton.addEventListener('click', handleSearch);
}

function searchEvents(city) {
    const ACCESS_TOKEN = "jYkS1XaVpIN7oTCR0t2Tx9y4MmNENq4IzQ71mWCT";
    const baseURL = "https://api.predicthq.com/v1/events";
    const headers = {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Accept": "application/json"
    };
    const url = `${baseURL}?q=${encodeURIComponent(city)}`;

    // Mostrar la pantalla de carga
    const loader = document.getElementById('loader');
    loader.style.display = 'flex'; // Cambiar a 'flex' para mostrar
    searchResults.innerHTML = '';
    fetch(url, { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            eventos = data.results;
            renderEvents(eventos);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            searchResults.innerHTML = '<p class="text-red-500 text-center py-4">An error occurred while fetching events.</p>';
        })
        .finally(() => {
            loader.style.display = 'none'; // Ocultar nuevamente
        });
}

function getRandomImageURL(category) {
    // Define el directorio base donde se encuentran las imágenes
    const baseURL = '/src/images/categoriesEvents/';

    // Define el objeto que mapea cada categoría con la cantidad de imágenes disponibles
    const categoryImages = {
        'school-holidays': 5,
        'public-holidays': 5,
        'observances': 1,
        'politics': 1,
        'conferences': 1,
        'expos': 1,
        'concerts': 1,
        'festivals': 1,
        'performing-arts': 1,
        'sports': 1,
        'community': 1,
        'daylight-savings': 1,
        'airport-delays': 1,
        'severe-weather': 1,
        'disasters': 1,
        'terror': 1,
        'health-warnings': 1,
        'academic': 1
    };
    

    // Verifica si la categoría está definida en el objeto categoryImages
    if (category in categoryImages) {
        // Genera un número aleatorio entre 1 y el número de imágenes disponibles para esa categoría
        const randomImageNumber = Math.floor(Math.random() * categoryImages[category]) + 1;
        // Construye la URL de la imagen aleatoria seleccionada
        const imageURL = `${baseURL}${category}/${randomImageNumber}.jpg`;
        return imageURL;
    } else {
        // Si la categoría no está definida en categoryImages, devuelve una imagen por defecto
        return 'https://via.placeholder.com/150';
    }
}

function renderEvents(events) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (events.length === 0) {
        searchResults.innerHTML = '<p class="text-gray-600 text-center py-4 border border-gray-300 rounded-md shadow-md bg-white p-6">No events found. Keep exploring!</p>';
        return;
    }

    const container = document.createElement('div');
    container.classList.add('grid', 'gap-4');

    events.forEach(evento => {
        const card = createEventCard(evento);
        container.appendChild(card);
    });

    searchResults.appendChild(container);
}

function createEventCard(evento) {
    const card = document.createElement('a');
    card.classList.add('flex', 'items-center', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'hover:bg-gray-100', 'dark:border-gray-700', 'dark:bg-gray-800', 'dark:hover:bg-gray-700', 'hover:shadow-2xl', 'hover:contrast-125', 'transition-all', 'hover:scale-105');

    card.addEventListener('click', () => {
        // Guarda el evento y la URL de la imagen en el localStorage
        const selectedEventData = {
            event: evento,
            imageURL: getRandomImageURL(evento.category)
        };
        localStorage.setItem('selectedEvent', JSON.stringify(selectedEventData));
        window.location.href = `/src/pages/trip/trip.html?eventName=${encodeURIComponent(evento.title)}`;
    });
    
    card.addEventListener('mouseenter', () => {
        card.classList.add('transform', 'scale-100', 'shadow-lg');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('transform', 'scale-100', 'shadow-lg');
    });

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('flex-shrink-0', 'h-48', 'w-48', 'rounded-l-lg', 'overflow-hidden');

    const img = document.createElement('img');
    img.classList.add('object-cover', 'w-full', 'h-full');
    img.src = getRandomImageURL(evento.category); // Obtener la URL de la imagen aleatoria
    img.alt = evento.title;

    imgContainer.appendChild(img);
    card.appendChild(imgContainer);

    const content = document.createElement('div');
    content.classList.add('flex', 'flex-col', 'p-4', 'flex-grow');

    const title = document.createElement('h5');
    title.classList.add('mb-2', 'text-xl', 'font-bold', 'text-gray-900', 'dark:text-white');
    title.textContent = evento.title;

    const dateLocation = document.createElement('p');
    dateLocation.classList.add('mb-1', 'text-sm', 'text-gray-600', 'dark:text-gray-400');
    dateLocation.textContent = `${new Date(evento.start).toLocaleDateString()} - ${getLocation(evento)}`;

    const description = document.createElement('p');
    description.classList.add('mb-3', 'text-sm', 'text-gray-700', 'dark:text-gray-400');
    description.textContent = evento.description || 'No description available';

    content.appendChild(title);
    content.appendChild(dateLocation);
    content.appendChild(description);
    card.appendChild(content);

    return card;
}

function getLocation(event) {
    let locationString = '';
    if (event.entities && event.entities.length > 0) {
        const venue = event.entities[0];
        if (venue.formatted_address) {
            locationString = venue.formatted_address;
        } else {
            if (event.location) {
                locationString = event.location;
            }
            if (event.locality) {
                locationString += `, ${event.locality}`;
            }
            if (event.country) {
                locationString += `, ${event.country}`;
            }
        }
    }
    return locationString;
}

document.addEventListener('DOMContentLoaded', initializeEvents);
