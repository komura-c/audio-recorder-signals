import { Injectable, NgZone, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecordAudioService {
  private readonly ngZone = inject(NgZone);

  private mediaRecorderInstance: MediaRecorder | null = null;
  private userMediaStream: MediaStream | null = null;

  private readonly _recorderStateSignal = signal<
    'inactive' | 'recording' | 'paused'
  >('inactive');
  get recorderStateSignal() {
    return this._recorderStateSignal.asReadonly();
  }

  private readonly _recordedAudioURLsSignal = signal<string[]>([]);
  get recordedAudioURLsSignal() {
    return this._recordedAudioURLsSignal.asReadonly();
  }

  async initRecord() {
    if (!navigator.mediaDevices.getUserMedia) {
      console.error('getUserMedia is not supported');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    this.userMediaStream = stream;

    if (!MediaRecorder.isTypeSupported('audio/webm')) {
      console.error('audio/webm is not supported');
      return;
    }

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm',
    });

    this.setEvent(mediaRecorder);

    this.mediaRecorderInstance = mediaRecorder;
  }

  private setEvent(mediaRecorder: MediaRecorder) {
    mediaRecorder.ondataavailable = (event) => this.ondataavailable(event);
    mediaRecorder.onerror = (event) => this.onerror(event);
    // mediaRecorder.onpause = (event) => this.onpause(event);
    // mediaRecorder.onresume = (event) => this.onresume(event);
    // mediaRecorder.onstart = (event) => this.onstart(event);
    // mediaRecorder.onstop = (event) => this.onstop(event);
  }

  private ondataavailable(event: BlobEvent) {
    this.setAudioURLs(event.data);
  }
  private setAudioURLs(blob: Blob) {
    const audioURL = window.URL.createObjectURL(blob);

    // updateがリアクティブにならないため、ngZone内で行う
    this.ngZone.run(() => {
      this._recordedAudioURLsSignal.update((audioURLs) => {
        audioURLs.push(audioURL);
        return audioURLs;
      });
    });
  }

  private onerror(event: Event) {
    console.error(event);
  }
  // private onpause(event: Event) {}
  // private onresume(event: Event) {}
  // private onstart(event: Event) {}
  // private onstop(event: Event) {}

  startRecord() {
    if (!this.mediaRecorderInstance) {
      return;
    }
    this.mediaRecorderInstance.start();
    this._recorderStateSignal.set(this.mediaRecorderInstance.state);
  }

  pauseRecord() {
    if (!this.mediaRecorderInstance) {
      return;
    }
    this.mediaRecorderInstance.pause();
    this._recorderStateSignal.set(this.mediaRecorderInstance.state);
  }

  resumeRecord() {
    if (!this.mediaRecorderInstance) {
      return;
    }
    this.mediaRecorderInstance.resume();
    this._recorderStateSignal.set(this.mediaRecorderInstance.state);
  }

  stopRecord() {
    if (!this.mediaRecorderInstance) {
      return;
    }
    this.mediaRecorderInstance.stop();
    this._recorderStateSignal.set(this.mediaRecorderInstance.state);
    this.mediaRecorderInstance = null;

    if (!this.userMediaStream) {
      return;
    }
    this.userMediaStream.getTracks().forEach((track) => track.stop());
    this.userMediaStream = null;
  }
}
