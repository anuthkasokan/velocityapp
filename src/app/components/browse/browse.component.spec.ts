import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowseComponent } from './browse.component';
import { Store } from '@ngrx/store';
import { of, firstValueFrom } from 'rxjs';
import { VideoGame } from '../../models/video-game.model';
import * as GamesActions from '../../store/actions';
import { provideRouter } from '@angular/router';

describe('BrowseComponent', () => {
  let component: BrowseComponent;
  let fixture: ComponentFixture<BrowseComponent>;
  let store: any;

  const mockGames: VideoGame[] = [
    {
      id: 1,
      title: 'Test Game',
      description: 'Test Description',
      releaseDate: '2026-01-01',
      genre: { id: 1, name: 'Action' },
      publisher: { id: 1, name: 'Test Publisher' },
      developer: { id: 1, name: 'Test Developer' }
    }
  ];

  beforeEach(async () => {
    const storeSpy = {
      select: vi.fn().mockReturnValue(of(mockGames)),
      dispatch: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BrowseComponent],
      providers: [
        { provide: Store, useValue: storeSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrowseComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadGames on init', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(GamesActions.loadGames());
  });

  it('should select games from store', async () => {
    const games = await firstValueFrom(component.games$);
    expect(games).toEqual(mockGames);
  });

  it('should dispatch deleteGame with confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteGame(1);
    expect(store.dispatch).toHaveBeenCalledWith(GamesActions.deleteGame({ id: 1 }));
  });

  it('should not dispatch deleteGame without confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const dispatchSpy = vi.fn();
    store.dispatch = dispatchSpy;
    component.deleteGame(1);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should display games in template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Game');
  });
});
