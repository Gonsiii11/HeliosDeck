export const favoriteLocations = [
  { id: 'mexico-city-mx', name: 'Ciudad de Mexico', country: 'Mexico', latitude: 19.4326, longitude: -99.1332 },
  { id: 'new-york-us', name: 'New York', country: 'Estados Unidos', latitude: 40.7128, longitude: -74.006 },
  { id: 'london-uk', name: 'London', country: 'Reino Unido', latitude: 51.5072, longitude: -0.1276 },
  { id: 'paris-fr', name: 'Paris', country: 'Francia', latitude: 48.8566, longitude: 2.3522 },
  { id: 'madrid-es', name: 'Madrid', country: 'Espana', latitude: 40.4168, longitude: -3.7038 },
  { id: 'barcelona-es', name: 'Barcelona', country: 'Espana', latitude: 41.3851, longitude: 2.1734 },
  { id: 'tokyo-jp', name: 'Tokyo', country: 'Japon', latitude: 35.6762, longitude: 139.6503 },
  { id: 'sydney-au', name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  { id: 'sao-paulo-br', name: 'Sao Paulo', country: 'Brasil', latitude: -23.5505, longitude: -46.6333 },
  { id: 'mumbai-in', name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777 },
  { id: 'cairo-eg', name: 'Cairo', country: 'Egipto', latitude: 30.0444, longitude: 31.2357 },
  { id: 'los-angeles-us', name: 'Los Angeles', country: 'Estados Unidos', latitude: 34.0522, longitude: -118.2437 },
]

const barcelona = favoriteLocations.find((location) => location.id === 'barcelona-es')
export const defaultLocations = [barcelona || favoriteLocations[0]]

export const buildLocationLabel = (location) =>
  location?.name && location?.country ? `${location.name}, ${location.country}` : location?.name || 'Ubicacion'
