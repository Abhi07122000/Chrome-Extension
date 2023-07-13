# Chrome-Extension
# MYM Weather Chrome Extension

This is a simple weather Chrome extension that allows users to fetch and display weather information for a specific city or their current location. The extension uses the OpenWeatherMap API to retrieve weather data and provides features such as storing data in IndexedDB and displaying previously fetched data.

## Features

- Fetch weather data for a specific city using the OpenWeatherMap API.
- Retrieve and display weather data for the user's current location using geolocation.
- Store fetched weather data in IndexedDB for offline access.
- Display previously fetched weather data from IndexedDB.
- Display weather information such as temperature, maximum and minimum temperature, humidity, and weather description.
- Store weather data in Cloud DB using the Chrome extension background script.

## Installation

1. Clone the repository or download the project files to your local machine.

2. Open Google Chrome and go to `chrome://extensions/`.

3. Enable **Developer mode** by toggling the switch in the top-right corner.

4. Click on **Load unpacked** and select the project folder.

5. The extension should now be added to your Chrome browser.

## Usage

1. Click on the extension icon in the browser toolbar to open the weather popup window.
2. Enter a city name in the input field and click "Fetch the Weather" to retrieve weather data for the specified city.
3. Alternatively, click on the "Find My Weather" button to fetch weather data for your current location (requires geolocation permission).
4. The weather data will be displayed, including the current temperature, maximum temperature, minimum temperature, humidity, and weather description.
5. The fetched weather data will be stored in IndexedDB for offline access.
6. Previously fetched weather data will be retrieved from IndexedDB and displayed upon opening the popup window.
