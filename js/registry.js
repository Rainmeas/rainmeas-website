// Function to fetch registry index from GitHub
async function fetchRegistryIndex() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Rainmeas/rainmeas-registry/main/index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching registry index:', error);
        // Fallback to local data if GitHub fetch fails
        return getLocalRegistryData();
    }
}

// Function to fetch package details from GitHub
async function fetchPackageDetails(packageName) {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/Rainmeas/rainmeas-registry/main/packages/${packageName}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching package details for ${packageName}:`, error);
        // Fallback to local data if GitHub fetch fails
        return getLocalPackageData(packageName);
    }
}

// Function to get all package details from GitHub
async function getAllPackageDetails() {
    try {
        const registryData = await fetchRegistryIndex();
        const packageNames = Object.keys(registryData);
        
        const packagePromises = packageNames.map(name => fetchPackageDetails(name));
        const packages = await Promise.all(packagePromises);
        
        return packages;
    } catch (error) {
        console.error('Error fetching all package details:', error);
        // Fallback to local data if GitHub fetch fails
        return getLocalAllPackageDetails();
    }
}

// Local fallback data
function getLocalRegistryData() {
    return {
        "nurashade-reversegeo": {
            "latest": "1.0.0",
            "versions": ["1.0.0"]
        },
        "nurashadeweather": {
            "latest": "1.0.0",
            "versions": ["1.0.0"]
        }
    };
}

function getLocalPackageData(packageName) {
    const packageData = {
        "nurashade-reversegeo": {
            "name": "nurashade-reversegeo",
            "author": "nurashade",
            "description": "NuraShade Reverse Geo is a Rainmeter configuration component that provides reverse geocoding capabilities using the BigDataCloud API. Given a latitude and longitude, it retrieves detailed location information including country, city, subdivision, continent, postcode, and more. This package is designed to complement the NuraShade weather suite and enhance location-based displays in Rainmeter skins.",
            "homepage": "https://github.com/NuraShade/NuraShadeReverseGeo",
            "license": "Creative Commons Attribution-ShareAlike 3.0 Unported",
            "versions": {
                "1.0.0": {
                    "download": "https://github.com/NuraShade/NuraShadeReverseGeo/releases/download/v1.0.0/nurashade-reversegeo_v1.0.0.zip"
                },
                "latest": "1.0.0"
            },
            "dependencies": {},
            "icon": "fas fa-map-marker-alt"
        },
        "nurashadeweather": {
            "name": "nurashadeweather",
            "author": "nurashade",
            "description": "NuraShade Weather Measures is a collection of Rainmeter configuration files that provide comprehensive weather forecasting capabilities using the Open-Meteo API. This package includes measures for current weather conditions, 7-day forecasts, and 7-hour hourly forecasts. Most numerical measures include both precise and rounded variants for flexible display options.",
            "homepage": "https://github.com/NuraShade/NuraShadeWeather",
            "license": "Creative Commons Attribution-ShareAlike 3.0 Unported",
            "versions": {
                "1.0.0": {
                    "download": "https://github.com/NuraShade/NuraShadeWeather/releases/download/v1.0.0/nurashadeweather_v1.0.0.zip"
                },
                "latest": "1.0.0"
            },
            "dependencies": {},
            "icon": "fas fa-cloud-sun"
        }
    };
    
    return packageData[packageName] || null;
}

function getLocalAllPackageDetails() {
    const packages = [
        "nurashade-reversegeo",
        "nurashadeweather"
    ];
    
    return packages.map(name => getLocalPackageData(name)).filter(pkg => pkg !== null);
}