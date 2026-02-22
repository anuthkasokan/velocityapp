/**
 * Edit Component
 * 
 * Handles both creating new games and editing existing games.
 * Route determines mode: /edit/new (create) vs /edit/:id (update)
 * 
 * Demonstrates:
 * - Reactive Forms with validation
 * - Multiple observable streams (genres, publishers, developers)
 * - forkJoin for parallel API calls
 * - NgRx Actions for state updates
 * - Route parameter handling
 * - Form pre-population when editing
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Genre, Publisher, Developer } from '../../models/video-game.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as GamesActions from '../../store/actions';
import { VideoGameService } from '../../services/video-game.service';
import { GenreService } from '../../services/genre.service';
import { PublisherService } from '../../services/publisher.service';
import { DeveloperService } from '../../services/developer.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbModule],
  providers: [DatePipe],  // DatePipe for formatting dates
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  gameForm: FormGroup;  // Reactive form instance
  isNewGame = true;     // Flag: true for create, false for update
  gameId?: number;      // Game ID when editing existing game
  
  // Observable streams for dropdown options
  genres$!: Observable<Genre[]>;
  publishers$!: Observable<Publisher[]>;
  developers$!: Observable<Developer[]>;

  constructor(
    private fb: FormBuilder,              // For building reactive forms
    private store: Store<any>,            // NgRx store for dispatching actions
    private actions$: Actions,             // For listening to action results
    private gameService: VideoGameService, // API service for fetching game data
    private route: ActivatedRoute,        // For reading route parameters
    private router: Router,               // For navigation
    private genreService: GenreService,
    private publisherService: PublisherService,
    private developerService: DeveloperService,
    private datePipe: DatePipe            // For date formatting
  ) {
    // Initialize form with validators
    this.gameForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      releaseDate: ['', Validators.required],
      genre: [null, Validators.required],
      publisher: [null, Validators.required],
      developer: [null, Validators.required]
    });

    // Set up observable streams for dropdowns
    this.genres$ = this.genreService.genres$;
    this.publishers$ = this.publisherService.publishers$;
    this.developers$ = this.developerService.developers$;
  }

  /**
   * Component Initialization
   * 1. Load lookup data (genres, publishers, developers) in parallel
   * 2. Check route param to determine create vs edit mode
   * 3. If editing, load game data and populate form
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    // forkJoin: Wait for all 3 API calls to complete before proceeding
    const loadLookups$ = forkJoin([
      this.genreService.getAll(),
      this.publisherService.getAll(),
      this.developerService.getAll()
    ]);

    loadLookups$.pipe(take(1)).subscribe({
      next: () => {
        // After lookups loaded, check if we're editing
        if (id && id !== 'new') {
          this.isNewGame = false;
          this.gameId = +id;  // Convert string to number
          this.loadGame();
        }
      },
      error: (err) => console.error('Failed to load lookups', err)
    });
  }

  /**
   * Load Game Data for Editing
   * Fetches game by ID and populates the form
   * Navigates to home if game not found
   */
  private loadGame(): void {
    this.gameService.getGameById(this.gameId!).pipe(take(1)).subscribe({
      next: (game) => {
        if (game) this.patchFormWithGame(game);
        else this.router.navigate(['/']);  // Game not found
      },
      error: () => this.router.navigate(['/'])  // API error
    });
  }

  /**
   * Populate Form with Game Data
   * Converts related entities (genre, publisher, developer) to IDs for dropdowns
   */
  private patchFormWithGame(game: any): void {
    this.gameForm.patchValue({
      title: game.title,
      description: game.description,
      releaseDate: this.datePipe.transform(game.releaseDate, 'yyyy-MM-dd'),
      genre: game.genre?.id,
      publisher: game.publisher?.id,
      developer: game.developer?.id
    });
  }

  /**
   * Form Submit Handler
   * Dispatches appropriate action (add or update) based on mode
   * Listens for success/failure and navigates accordingly
   */
  onSubmit(): void {
    if (!this.gameForm.valid) return;  // Don't submit invalid form
    
    let { title, description, releaseDate, genre, publisher, developer } = this.gameForm.value;

    // Build payload with IDs instead of full objects
    const payload = {
      ...(this.isNewGame ? {} : { id: this.gameId }),  // Include ID only when updating
      title,
      description,
      releaseDate: this.datePipe.transform(releaseDate, 'yyyy-MM-dd'),
      genreId: genre,
      publisherId: publisher,
      developerId: developer
    };

    // Dispatch appropriate action based on mode
    const action = this.isNewGame 
      ? GamesActions.addGame({ game: payload as any })
      : GamesActions.updateGame({ game: payload as any });

    this.store.dispatch(action);
    
    // Listen for the result and navigate on success
    this.actions$.pipe(
      ofType(GamesActions.loadGamesSuccess, GamesActions.addGameFailure, GamesActions.updateGameFailure),
      take(1)  // Unsubscribe after first emission
    ).subscribe((result: any) => {
      if (result.type === GamesActions.loadGamesSuccess.type) {
        this.router.navigate(['/']);  // Success: go to browse view
      } else {
        console.error('Save failed', result.error);  // Failure: log error
      }
    });
  }

  /**
   * Cancel Handler
   * Navigate back to browse view without saving
   */
  onCancel(): void {
    this.router.navigate(['/']);
  }

  
}
