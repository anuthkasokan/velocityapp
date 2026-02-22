# Technical Assessment - Video Game Catalog App

## Quick Start Guide for Reviewers

```bash
# Install dependencies
npm install

# Run development server
npm start
# Navigate to http://localhost:4200

# Run tests
npm test
```

## Architecture Overview

### State Management (NgRx)

This application implements the **Redux pattern** using NgRx, demonstrating proper separation of concerns:

```
User Interaction → Component → Action → Effect → API
                               ↓         ↓
                            Reducer ← Success/Failure
                               ↓
                            Store
                               ↓
                           Selector
                               ↓
                          Component (updates UI)
```

**Key Files to Review:**

- [`src/app/store/actions.ts`](src/app/store/actions.ts) - Typed actions using `createAction`
- [`src/app/store/reducer.ts`](src/app/store/reducer.ts) - Pure state transitions
- [`src/app/store/effects.ts`](src/app/store/effects.ts) - Side effect handling with RxJS
- [`src/app/store/selectors.ts`](src/app/store/selectors.ts) - Memoized state queries

### Component Architecture

#### Browse Component ([`browse.component.ts`](src/app/components/browse/browse.component.ts))

- Displays all games in responsive card layout
- Uses **async pipe** for automatic subscription management
- Dispatches actions to NgRx store
- Implements user confirmation for delete operations

#### Edit Component ([`edit.component.ts`](src/app/components/edit/edit.component.ts))

- Smart routing: handles both create (`/edit/new`) and update (`/edit/:id`)
- **Reactive Forms** with custom validation rules
- **forkJoin** for parallel API calls (genres, publishers, developers)
- Form pre-population when editing
- Action result listening with **ofType** operator

### Service Layer

#### Video Game Service ([`video-game.service.ts`](src/app/services/video-game.service.ts))

- All HTTP communication centralized
- Comprehensive error handling with fallback values
- RESTful API integration (GET, POST, PUT, DELETE)
- Observable-based for reactive data flow

### Modern Angular Features Demonstrated

1. **Standalone Components** - No NgModules required
2. **inject() Function** - Modern dependency injection
3. **Signals** - New reactive primitive (app title)
4. **provideRouter** - Functional router configuration
5. **provideHttpClient** - Functional HTTP setup

### Testing Strategy

**50 tests covering:**

- ✅ Components (Browse, Edit, App)
- ✅ Services (VideoGameService)
- ✅ NgRx Store (Actions, Reducer, Effects, Selectors)

**Testing Patterns Used:**

- Mock services with Vitest `vi.fn()`
- Store spy for action verification
- Observable testing with RxJS
- Form validation testing
- Component integration tests

### Code Quality Highlights

1. **Type Safety**
   - Strict TypeScript throughout
   - Interfaces for all data models
   - No `any` types except where necessary

2. **Clean Code Principles**
   - Single Responsibility Principle
   - DRY (Don't Repeat Yourself)
   - Separation of concerns
   - Descriptive naming conventions

3. **Error Handling**
   - API errors caught and logged
   - User-friendly error messages
   - Graceful degradation

4. **Performance**
   - Memoized selectors prevent unnecessary recomputation
   - OnPush change detection where beneficial
   - Async pipe for automatic unsubscription

### RxJS Operators Used

- `map` - Transform data
- `mergeMap` - Flatten observables (parallel execution)
- `catchError` - Error handling
- `take(1)` - Auto-unsubscribe after first emission
- `ofType` - Filter actions by type
- `forkJoin` - Wait for multiple observables

### File Organization

```
src/app/
├── components/        # UI components
├── models/           # TypeScript interfaces
├── services/         # API services and config
├── store/            # NgRx state management
├── app.config.ts     # Application providers
└── app.routes.ts     # Route configuration
```

## API Requirements

The application expects a REST API with these endpoints:

```
GET    /api/games           - Get all games
GET    /api/games/:id       - Get game by ID
POST   /api/games           - Create new game
PUT    /api/games/:id       - Update game
DELETE /api/games/:id       - Delete game

GET    /api/genres          - Get all genres
GET    /api/publishers      - Get all publishers
GET    /api/developers      - Get all developers
```

Configure the API base URL in [`src/configuration/app.config.json`](src/configuration/app.config.json)

## Notable Implementation Details

### Immutable State Updates

All reducer operations create new objects instead of mutating:

```typescript
// Add game - spread operator
games: [...state.games, game];

// Update game - map returns new array
games: state.games.map((g) => (g.id === game.id ? game : g));

// Delete game - filter returns new array
games: state.games.filter((g) => g.id !== id);
```

### Effect Pattern

Effects handle side effects (API calls) and dispatch new actions:

```typescript
loadGames$ = createEffect(() =>
  this.actions$.pipe(
    ofType(GamesActions.loadGames),
    mergeMap(() =>
      this.service.getGames().pipe(
        map((games) => GamesActions.loadGamesSuccess({ games })),
        catchError((error) => of(GamesActions.loadGamesFailure({ error }))),
      ),
    ),
  ),
);
```

### Smart Form Handling

The edit form adapts based on route parameter:

- `/edit/new` → Create mode (empty form)
- `/edit/123` → Edit mode (pre-populated form)

## Development Practices

- ✅ **Angular Style Guide** compliance
- ✅ **Prettier** for consistent formatting
- ✅ **Vitest** for fast unit testing
- ✅ **TypeScript strict mode**
- ✅ **Comprehensive comments** for code clarity

## Questions or Clarifications?

All major architectural decisions are documented in code comments. Each file includes:

- Purpose and responsibility
- Key patterns used
- Important implementation details

---

**Technologies Used:**
Angular 21 | NgRx 21 | RxJS 7 | TypeScript 5.9 | Bootstrap 5 | Vitest 4
