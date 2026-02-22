import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { VideoGame } from '../../models/video-game.model';
import { VideoGameService } from '../../services/video-game.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-browse',
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  games$: Observable<VideoGame[]| []>;

  constructor(private gameService: VideoGameService) {
    this.games$ = this.gameService.games$;
  }

  ngOnInit(): void {
    this.gameService.getGames().pipe(take(1)).subscribe({
      next: () => {},
      error: (err) => console.error('Failed to load games', err)
    });
  }

  deleteGame(id: number): void {
    if (!confirm('Are you sure you want to delete this game?')) return;
    this.gameService.deleteGame(id).pipe(take(1)).subscribe({
      next: () => {},
      error: (err) => console.error('Delete failed', err)
    });
  }
}
