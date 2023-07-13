
// Import the necessary Firebase modules
// import { initializeApp } from './firebase/firebase-app.js';
// import * as firebase from './firebase/firebase-firestore.js';

// // Initialize the Firebase app with your Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBBuPUQaU9YUNtrfVcPdVAE3vtIU99O1_4",
//     authDomain: "mym-weather-api.firebaseapp.com",
//     projectId: "mym-weather-api",
//     storageBucket: "mym-weather-api.appspot.com",
//     messagingSenderId: "76561129168",
//     appId: "1:76561129168:web:19f0cb639a47ba1f4248d5",
//     measurementId: "G-PG793C5BWK"
//   };

// Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// const db = firebase.getFirestore(firebaseApp);

var button = document.getElementById("button");
var mybutton = document.getElementById("mybutton");
var x = document.getElementById("details");
const apiKey = "d3f96423f57399f9e2646893a2eaaf1b";
x.style.display = "none";
mybutton.onclick = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(Positionweather);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}



// Create a variable to store the IndexedDB database
let weatherDB;
// Open the IndexedDB database
const request = indexedDB.open('WeatherDB', 1);
// Handle database upgrade (or creation)
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    // Create an object store for weather data
    const objectStore = db.createObjectStore('weatherData', { keyPath: 'id' });
    // Create an index for searching by city name
    objectStore.createIndex('byCity', 'city', { unique: false });
};
// Handle database opened successfully
request.onsuccess = function (event) {
    weatherDB = event.target.result;
    // Retrieve weather data from IndexedDB and display it
    retrieveWeatherData();
};
// Handle database errors
request.onerror = function (event) {
    console.error('IndexedDB error:', event.target.error);
};



// Function to store weather data in IndexedDB
function storeWeatherData(data) {
    const transaction = weatherDB.transaction('weatherData', 'readwrite');
    const objectStore = transaction.objectStore('weatherData');
    // Generate a unique ID for the data entry
    const id = Date.now();
    // Create an object with the data and the generated ID
    const weatherEntry = {
        id,
        city: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        maxtemp: data.main.temp_max,
        mintemp: data.main.temp_min,
        humidity: data.main.humidity,
        desc: data.weather[0]["main"],
    };
    // storeWeatherDataFirebase(weatherEntry)
    // Add the object to the object store
    const request = objectStore.add(weatherEntry);
    // Handle the success or error of the store operation
    request.onsuccess = function (event) {
        console.log('Weather data stored successfully in IndexedDB');
    };
    request.onerror = function (event) {
        console.error('Failed to store weather data in IndexedDB:', event.target.error);
    };
}

// Function to store weather data in Firebase Firestore
// async function storeWeatherDataFirebase(data) {
//     try {
//       const weatherDataCollection = firebase.collection(db, 'weatherData');
//       await firebase.addDoc(weatherDataCollection, data);
//       console.log('Weather data stored successfully in Firebase Firestore');
//     } catch (error) {
//       console.error('Failed to store weather data in Firebase Firestore:', error);
//     }
//   }

// Function to retrieve weather data from IndexedDB and display it
function retrieveWeatherData() {
    if (!weatherDB) {
        console.error('IndexedDB is not opened yet');
        return;
    }
    const transaction = weatherDB.transaction('weatherData', 'readonly');
    const objectStore = transaction.objectStore('weatherData');
    const request = objectStore.getAll();
    request.onsuccess = function (event) {
        const weatherDataArray = event.target.result;
        if (weatherDataArray && weatherDataArray.length > 0) {
            // Display the weather data
            weatherDataArray.forEach(weatherData => {
                displayWeatherData(weatherData);
            });
        }
    };
    request.onerror = function (event) {
        console.error('Failed to retrieve weather data from IndexedDB:', event.target.error);
    };
}


// Function to display weather data to the user
function displayWeatherData(weatherData) {
    x.style.display = "block";
    var msg = document.getElementById("msg");
    var temp = document.getElementById("temp");
    var maxt = document.getElementById("maxt");
    var mint = document.getElementById("mint");
    var hum = document.getElementById("hum");
    var desc = document.getElementById("desc");

    msg.textContent = weatherData.city + ", " + weatherData.country;
    temp.textContent = weatherData.temp + " *C";
    maxt.textContent = "Maximum Temp: " + weatherData.maxtemp + " *C";
    mint.textContent = "Minimum Temp: " + weatherData.mintemp + " *C";
    hum.textContent = "Humidity: " + weatherData.humidity + " %";
    desc.textContent = weatherData.desc;
}


// function sendMessageToBackground(data) {
//     try {
//         chrome.runtime.sendMessage({
//             action: 'storeWeatherData',
//             data: data
//         }, (response) => {
//             if (chrome.runtime.lastError) {
//                 throw new Error(chrome.runtime.lastError.message);
//             }
//             console.log('Data sent successfully:', response);
//         });
//     } catch (error) {
//         console.log('Error sending data:', error);
//     }
// }


function Positionweather(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var url1 = "https://api.openweathermap.org/data/2.5/weather?lat=";
    var url2 = "&lon=";
    var url3 = "&appid=";
    var url4 = "&units=metric";
    var url = url1.concat(lat, url2, lon, url3, apiKey, url4);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            x.style.display = "block";
            sendMessageToBackground(data); // Store the fetched weather data in DynamoDB
            storeWeatherData(data); // Store the fetched weather data in IndexedDB
            retrieveWeatherData(); // Display the weather data to the user
            var icon1 = "https://openweathermap.org/img/wn/";
            var icon2 = data.weather[0]["icon"];
            var icon3 = "@2x.png";
            var icon = icon1.concat(icon2, icon3);
            document.getElementById("icon").src = icon;
        })
        .catch(() => {
            x.style.display = "block";
            msg.textContent = "Please search for a valid city 😩";
        });
}
button.onclick = function () {
    var inputVal = document.getElementById("myInput").value;
    var url1 = "https://api.openweathermap.org/data/2.5/weather?q=";
    var url2 = "&appid=";
    var url3 = "&units=metric";
    var url = url1.concat(inputVal, url2, apiKey, url3);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            x.style.display = "block";
            sendMessageToBackground(data); // Store the fetched weather data in DynamoDB
            storeWeatherData(data); // Store the fetched weather data in IndexedDB
            retrieveWeatherData(); // Display the weather data to the user
            var icon1 = "https://openweathermap.org/img/wn/";
            var icon2 = data.weather[0]["icon"];
            var icon3 = "@2x.png";
            var icon = icon1.concat(icon2, icon3);
            document.getElementById("icon").src = icon;
        })
        .catch(() => {
            x.style.display = "block";
            msg.textContent = "Please search for a valid city 😩";
        });
}


window.onunhandledrejection = function (event) {
    console.error('Unhandled promise rejection:', event.reason);
};
