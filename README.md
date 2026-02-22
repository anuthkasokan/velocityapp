# Video Game Catalog App

A modern Angular application for managing a video game catalog with full CRUD operations, built using Angular 21 with NgRx for state management.

## 🎯 Project Overview

This application demonstrates proficiency in:

- **Angular 21** (latest version) with standalone components
- **NgRx** for reactive state management (Store, Effects, Selectors)
- **Reactive Forms** with validation
- **RxJS** for reactive programming patterns
- **Bootstrap 5** and **ng-bootstrap** for UI components
- **Vitest** for unit testing with comprehensive test coverage
- **TypeScript** with strict typing
- **RESTful API** integration with error handling

## 🏗️ Architecture

### State Management Pattern

The application uses the **Redux pattern** via NgRx:

- **Store**: Centralized state container for video games
- **Actions**: Typed actions for all CRUD operations
- **Reducers**: Pure functions to handle state transitions
- **Effects**: Side effect management for API calls
- **Selectors**: Memoized state queries

### Project Structure

```
src/app/
├── components/
│   ├── browse/          # Browse and delete games (list view)
│   └── edit/            # Create and update games (form view)
├── models/
│   └── video-game.model.ts    # TypeScript interfaces
├── services/
│   ├── video-game.service.ts  # Game CRUD operations
│   ├── genre.service.ts       # Genre lookup service
│   ├── publisher.service.ts   # Publisher lookup service
│   ├── developer.service.ts   # Developer lookup service
│   └── app-config.service.ts  # API configuration
├── store/
│   ├── actions.ts       # NgRx actions (createAction)
│   ├── reducer.ts       # NgRx reducer (createReducer)
│   ├── effects.ts       # NgRx effects (API side effects)
│   └── selectors.ts     # NgRx selectors (createSelector)
└── app.config.ts        # Application providers (standalone)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v11.6.2 or higher)

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

### API Configuration

The app expects a REST API at the endpoint configured in `src/configuration/app.config.json`

- Default: `http://localhost:3000/api`
- Supports CRUD operations for: games, genres, publishers, developers

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

- Uses **Vitest** as the test runner
- Includes tests for components, services, effects, reducers, and selectors
- Mocking strategy: Spies for services and store interactions

### Test Coverage

```bash
npm test -- --coverage
```

## 📋 Features

### Browse Games

- Display all video games in a responsive card layout
- Shows game title, description, release date, genre, publisher, and developer
- Delete functionality with confirmation
- Edit navigation

### Add/Edit Game

- Reactive form with validation:
  - Title (required, min 2 characters)
  - Description (required, min 10 characters)
  - Release Date (required)
  - Genre (required, dropdown)
  - Publisher (required, dropdown)
  - Developer (required, dropdown)
- Smart routing: `/edit/new` for create, `/edit/:id` for update
- Form pre-population when editing existing games
- Cancel navigation back to browse view

### State Management

- All API calls handled through NgRx Effects
- Optimistic UI updates after successful operations
- Error handling with user feedback
- Loading states tracked in store

## 🛠️ Technical Highlights

### Standalone Components

Uses Angular's modern standalone components approach (no NgModules required)

### Dependency Injection

Leverages Angular's `inject()` function for modern DI patterns

### Reactive Programming

- RxJS operators: `map`, `mergeMap`, `catchError`, `take`, `ofType`
- Observable streams for async data handling
- `forkJoin` for parallel API calls

### Type Safety

- Strict TypeScript configuration
- Interfaces for all data models
- Typed actions, selectors, and state

### Best Practices

- Separation of concerns (components, services, state)
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Error boundary with global error listeners
- Unsubscribe handling with `take(1)` operator

## 🎨 UI/UX

- **Bootstrap 5** for responsive design
- **ng-bootstrap** for Angular-native Bootstrap components
- Mobile-friendly responsive layouts
- Consistent styling with SCSS
- User confirmation for destructive actions

## 📦 Build

````bash
npm run build

## 📦 Build

```bash
npm run build
````

Optimized production build artifacts stored in `dist/` directory

## 🔑 Key Learning Outcomes

This project demonstrates:

1. **State Management**: Proper implementation of Redux pattern with NgRx
2. **Reactive Programming**: Effective use of RxJS observables and operators
3. **Testing**: Comprehensive unit tests with mocks and spies
4. **Modern Angular**: Standalone components, signals, and inject() function
5. **Form Handling**: Reactive forms with complex validation
6. **API Integration**: RESTful service layer with error handling
7. **Routing**: Angular router with parameters and navigation
8. **TypeScript**: Strong typing throughout the application

## 📝 Notes for Reviewers

- All components use **standalone** architecture (no NgModules)
- **Store DevTools** enabled for debugging state transitions
- **Error handling** implemented at service and effect layers
- **Responsive design** works on mobile and desktop
- **Unit tests** demonstrate understanding of testing patterns
- **Clean code** with consistent formatting and naming conventions

---

**Author**: Anuth Asokan  
**Date**: February 2026
**Purpose**: Technical Assessment
