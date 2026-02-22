import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EditComponent } from './edit.component';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { of, Subject } from 'rxjs';
import { VideoGameService } from '../../services/video-game.service';
import { GenreService } from '../../services/genre.service';
import { PublisherService } from '../../services/publisher.service';
import { DeveloperService } from '../../services/developer.service';
import * as GamesActions from '../../store/actions';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let store: any;
  let router: any;
  let videoGameService: any;
  let actions$: Subject<any>;

  const mockGenres = [{ id: 1, name: 'Action' }];
  const mockPublishers = [{ id: 1, name: 'Test Publisher' }];
  const mockDevelopers = [{ id: 1, name: 'Test Developer' }];
  const mockGame = {
    id: 1,
    title: 'Test Game',
    description: 'Test Description',
    releaseDate: '2026-01-01',
    genre: { id: 1, name: 'Action' },
    publisher: { id: 1, name: 'Test Publisher' },
    developer: { id: 1, name: 'Test Developer' }
  };

  beforeEach(async () => {
    actions$ = new Subject();
    const storeSpy = {
      select: vi.fn(),
      dispatch: vi.fn()
    };
    const videoGameServiceSpy = {
      getGameById: vi.fn().mockReturnValue(of(mockGame))
    };
    const genreServiceSpy = {
      getAll: vi.fn().mockReturnValue(of(mockGenres)),
      genres$: of(mockGenres)
    };
    const publisherServiceSpy = {
      getAll: vi.fn().mockReturnValue(of(mockPublishers)),
      publishers$: of(mockPublishers)
    };
    const developerServiceSpy = {
      getAll: vi.fn().mockReturnValue(of(mockDevelopers)),
      developers$: of(mockDevelopers)
    };

    await TestBed.configureTestingModule({
      imports: [EditComponent, ReactiveFormsModule],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Actions, useValue: actions$ },
        { provide: VideoGameService, useValue: videoGameServiceSpy },
        { provide: GenreService, useValue: genreServiceSpy },
        { provide: PublisherService, useValue: publisherServiceSpy },
        { provide: DeveloperService, useValue: developerServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'new' } } } },
        DatePipe,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    videoGameService = TestBed.inject(VideoGameService);
    
    // Spy on router navigate after injecting
    vi.spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values for new game', () => {
    fixture.detectChanges();
    expect(component.isNewGame).toBe(true);
    expect(component.gameForm.get('title')?.value).toBe('');
  });

  it('should load game when editing', async () => {
    const route = TestBed.inject(ActivatedRoute);
    vi.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('1');
    
    component.ngOnInit();
    await fixture.whenStable();
    
    expect(videoGameService.getGameById).toHaveBeenCalledWith(1);
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    const form = component.gameForm;
    expect(form.valid).toBe(false);
    
    form.patchValue({
      title: 'Test',
      description: 'Test Description Long Enough',
      releaseDate: '2026-01-01',
      genre: 1,
      publisher: 1,
      developer: 1
    });
    
    expect(form.valid).toBe(true);
  });

  it('should dispatch addGame action on submit for new game', () => {
    component.isNewGame = true;
    component.gameForm.patchValue({
      title: 'New Game',
      description: 'Description for new game',
      releaseDate: '2026-01-01',
      genre: 1,
      publisher: 1,
      developer: 1
    });

    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: GamesActions.addGame.type })
    );
  });

  it('should dispatch updateGame action on submit for existing game', () => {
    component.isNewGame = false;
    component.gameId = 1;
    component.gameForm.patchValue({
      title: 'Updated Game',
      description: 'Updated description for game',
      releaseDate: '2026-01-01',
      genre: 1,
      publisher: 1,
      developer: 1
    });

    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: GamesActions.updateGame.type })
    );
  });

  it('should navigate to home on cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to home on successful save', () => {
    component.gameForm.patchValue({
      title: 'Test',
      description: 'Test Description Long',
      releaseDate: '2026-01-01',
      genre: 1,
      publisher: 1,
      developer: 1
    });

    component.onSubmit();
    actions$.next(GamesActions.loadGamesSuccess({ games: [] }));
    
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
