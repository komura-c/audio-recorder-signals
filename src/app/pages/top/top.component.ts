import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordAudioComponent } from 'src/app/features/record-audio/record-audio.component';

@Component({
  selector: 'app-top',
  standalone: true,
  imports: [CommonModule, RecordAudioComponent],
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
})
export class TopComponent {}
