import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { VideoGame } from '../../models/video-game.model';
import { Store } from '@ngrx/store';
import * as GamesActions from '../../store/actions';
import * as GamesSelectors from '../../store/selectors';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-browse',
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  games$: Observable<VideoGame[]| []>;

  constructor(private store: Store) {
    this.games$ = this.store.select(GamesSelectors.selectAllGames);
  }

  ngOnInit(): void {
    this.store.dispatch(GamesActions.loadGames());
  }

  deleteGame(id: number): void {
    if (!confirm('Are you sure you want to delete this game?')) return;
    this.store.dispatch(GamesActions.deleteGame({ id }));
  }
}
