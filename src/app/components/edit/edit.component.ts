import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { VideoGame, Genre, Publisher, Developer } from '../../models/video-game.model';
import { Observable } from 'rxjs';
import { VideoGameService } from '../../services/video-game.service';
import { GenreService } from '../../services/genre.service';
import { PublisherService } from '../../services/publisher.service';
import { DeveloperService } from '../../services/developer.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbModule],
  providers: [DatePipe],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  gameForm: FormGroup;
  isNewGame = true;
  gameId?: number;
  genres$!: Observable<Genre[]>;
  publishers$!: Observable<Publisher[]>;
  developers$!: Observable<Developer[]>;

  constructor(
    private fb: FormBuilder,
    private gameService: VideoGameService,
    private route: ActivatedRoute,
    private router: Router,
    private genreService: GenreService,
    private publisherService: PublisherService,
    private developerService: DeveloperService,
    private datePipe: DatePipe
  ) {
    this.gameForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      releaseDate: ['', Validators.required],
      genre: [null, Validators.required],
      publisher: [null, Validators.required],
      developer: [null, Validators.required]
    });

    this.genres$ = this.genreService.genres$;
    this.publishers$ = this.publisherService.publishers$;
    this.developers$ = this.developerService.developers$;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // Load lookup lists first, then (if editing) load the game and map lookups
    const loadLookups$ = forkJoin([
      this.genreService.getAll().pipe(take(1)),
      this.publisherService.getAll().pipe(take(1)),
      this.developerService.getAll().pipe(take(1))
    ]);

    if (id && id !== 'new') {
      this.isNewGame = false;
      this.gameId = +id;

      loadLookups$
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.gameService.getGameById(this.gameId!).pipe(take(1)).subscribe({
              next: (game) => {
                if (!game) {
                  this.router.navigate(['/']);
                  return;
                }

                // Map genre/publisher/developer to the lookup objects so selects show correctly
                const mapLookup = (val: any, list$: Observable<any[]>): any => {
                  if (!val) return null;
                  // If backend returned an object with id
                  const id = typeof val === 'number' ? val : val.id ?? null;
                  let found: any = null;
                  // get current snapshot of the list from the BehaviorSubject by subscribing synchronously
                  // lists are already loaded into the services' subjects
                  list$.pipe(take(1)).subscribe((arr) => {
                    found = arr.find((x: any) => x.id === id) ?? (typeof val === 'object' ? val : null);
                  });
                  return found;
                };

                const mappedGenre = mapLookup((game as any).genre, this.genreService.genres$);
                const mappedPublisher = mapLookup((game as any).publisher, this.publisherService.publishers$);
                const mappedDeveloper = mapLookup((game as any).developer, this.developerService.developers$);

                this.gameForm.patchValue({
                  ...game,
                  releaseDate: this.datePipe.transform((game as any).releaseDate, 'yyyy-MM-dd'),
                  genre: mappedGenre,
                  publisher: mappedPublisher,
                  developer: mappedDeveloper
                });
              },
              error: (err) => {
                console.error('Failed to load game', err);
                this.router.navigate(['/']);
              }
            });
          },
          error: (err) => {
            console.error('Failed to load lookups', err);
            // Still attempt to load game even if lookups fail
            this.gameService.getGameById(this.gameId!).pipe(take(1)).subscribe({
              next: (game) => {
                if (game) {
                  this.gameForm.patchValue({
                    ...game,
                    releaseDate: this.datePipe.transform((game as any).releaseDate, 'yyyy-MM-dd')
                  });
                } else this.router.navigate(['/']);
              },
              error: () => this.router.navigate(['/'])
            });
          }
        });
    } else {
      // New game: just load lookups
      loadLookups$.pipe(take(1)).subscribe({ next: () => {}, error: (err) => console.error('Failed to load lookups', err) });
    }
  }

  onSubmit(): void {
    if (!this.gameForm.valid) return;
    
    const { title, description, releaseDate, genre, publisher, developer } = this.gameForm.value;
    
    const payload = {
      ...(this.isNewGame ? {} : { id: this.gameId }),
      title,
      description: description ?? null,
      releaseDate: this.datePipe.transform(releaseDate, 'yyyy-MM-dd'),
      genreId: genre?.id ?? null,
      publisherId: publisher?.id ?? null,
      developerId: developer?.id ?? null
    };

    const save$ = this.isNewGame 
      ? this.gameService.addGame(payload) 
      : this.gameService.updateGame(payload);

    save$.pipe(take(1)).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error('Save failed', err)
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  
}
