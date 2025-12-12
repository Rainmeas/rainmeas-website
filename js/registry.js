// Function to load registry data from local files
async function loadRegistryData() {
    try {
        // Since we're running locally, we'll simulate loading the registry data
        // In a real web deployment, this would be fetched from a server endpoint
        
        // For now, we'll return hardcoded data based on the actual registry files
        const registryData = {
            "nurashade-reversegeo": {
                "latest": "1.0.0",
                "versions": ["1.0.0"]
            },
            "nurashadeweather": {
                "latest": "1.0.0",
                "versions": ["1.0.0"]
            }
        };
        
        return registryData;
    } catch (error) {
        console.error('Error loading registry data:', error);
        return null;
    }
}

// Function to load package details
async function loadPackageDetails(packageName) {
    try {
        // Simulate loading package details from local files
        // In a real deployment, this would fetch from a server
        
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
                "downloads": 12500,
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
                "downloads": 15200,
                "icon": "fas fa-cloud-sun"
            }
        };
        
        return packageData[packageName] || null;
    } catch (error) {
        console.error(`Error loading package details for ${packageName}:`, error);
        return null;
    }
}

// Function to get all package details
async function getAllPackageDetails() {
    const packages = [
        "nurashade-reversegeo",
        "nurashadeweather"
    ];
    
    const packageDetails = [];
    for (const packageName of packages) {
        const details = await loadPackageDetails(packageName);
        if (details) {
            packageDetails.push(details);
        }
    }
    
    return packageDetails;
}