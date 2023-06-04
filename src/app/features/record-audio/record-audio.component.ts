import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordAudioService } from './record-audio.service';

@Component({
  selector: 'app-record-audio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-audio.component.html',
  styleUrls: ['./record-audio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordAudioComponent {
  private readonly recordAudioService = inject(RecordAudioService);

  readonly recorderStateSignal = this.recordAudioService.recorderStateSignal;
  readonly recordedAudioURLsSignal =
    this.recordAudioService.recordedAudioURLsSignal;

  startRecord() {
    this.recordAudioService
      .initRecord()
      .then(() => this.recordAudioService.startRecord());
  }

  pauseRecord() {
    this.recordAudioService.pauseRecord();
  }

  resumeRecord() {
    this.recordAudioService.resumeRecord();
  }

  stopRecord() {
    this.recordAudioService.stopRecord();
  }
}
