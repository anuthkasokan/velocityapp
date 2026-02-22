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
    private store: Store<any>,
    private actions$: Actions,
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
    const loadLookups$ = forkJoin([
      this.genreService.getAll(),
      this.publisherService.getAll(),
      this.developerService.getAll()
    ]);

    loadLookups$.pipe(take(1)).subscribe({
      next: () => {
        if (id && id !== 'new') {
          this.isNewGame = false;
          this.gameId = +id;
          this.loadGame();
        }
      },
      error: (err) => console.error('Failed to load lookups', err)
    });
  }

  private loadGame(): void {
    this.gameService.getGameById(this.gameId!).pipe(take(1)).subscribe({
      next: (game) => {
        if (game) this.patchFormWithGame(game);
        else this.router.navigate(['/']);
      },
      error: () => this.router.navigate(['/'])
    });
  }

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

  onSubmit(): void {
    if (!this.gameForm.valid) return;
    
    let { title, description, releaseDate, genre, publisher, developer } = this.gameForm.value;

    const payload = {
      ...(this.isNewGame ? {} : { id: this.gameId }),
      title,
      description,
      releaseDate: this.datePipe.transform(releaseDate, 'yyyy-MM-dd'),
      genreId: genre,
      publisherId: publisher,
      developerId: developer
    };

    const action = this.isNewGame 
      ? GamesActions.addGame({ game: payload as any })
      : GamesActions.updateGame({ game: payload as any });

    this.store.dispatch(action);
    this.actions$.pipe(
      ofType(GamesActions.loadGamesSuccess, GamesActions.addGameFailure, GamesActions.updateGameFailure),
      take(1)
    ).subscribe((result: any) => {
      if (result.type === GamesActions.loadGamesSuccess.type) this.router.navigate(['/']);
      else console.error('Save failed', result.error);
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  
}
