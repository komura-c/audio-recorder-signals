import { TestBed } from '@angular/core/testing';

import { RecordAudioService } from './record-audio.service';

describe('RecordAudioService', () => {
  let service: RecordAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
