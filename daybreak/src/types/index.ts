// Weather types
export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  time: string;
  description: string;
  forecast?: DayForecast[];
  hourlyTemps?: HourlyTemp[]; // Add this for hourly temperature data
}

// Add this new interface for hourly temperature data
export interface HourlyTemp {
  time: string;
  temp: number;
}
  // Add this new interface for the forecast data
// Add time property to DayForecast
export interface DayForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  chanceOfRain: number;
  time: string; // Add this for the forecast time
}
  
  // Spotify types
  export interface SpotifyTrack {
    name: string;
    artist: string;
    albumArt?: string;
    progress: number;
    progressMs: number;
    durationMs: number;
  }
  
  export interface SpotifyResponse {
    is_playing: boolean;
    track_name?: string;
    artist?: string;
    album_art?: string;
    progress_ms?: number;
    duration_ms?: number;
    error?: boolean;
  }
  
  // Motivation types
  export interface QuoteData {
    text: string;
    author: string;
  }
  
  // Train types
  export interface TrainDeparture {
    id: number;
    line: string;
    color: string;
    destination: string;
    time: string;
  }