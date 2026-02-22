/**
 * Domain Models
 * TypeScript interfaces defining the data structures used throughout the app.
 */

export interface VideoGame {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  genre: Genre;
  publisher: Publisher;
  developer: Developer;
}

export interface Genre {
    id: number;
    name: string;
}

export interface Publisher {
    id: number;
    name: string;
}

export interface Developer {
    id: number;
    name: string;
}
