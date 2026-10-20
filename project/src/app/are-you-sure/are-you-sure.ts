import { Component } from '@angular/core';

@Component({
  selector: 'app-are-you-sure',
  imports: [],
  templateUrl: './are-you-sure.html',
  styleUrl: './are-you-sure.scss',
})
export class AreYouSure {
playVideo() {
  const videoElement = document.getElementById('yt') as HTMLVideoElement;
  const wrapElement = document.querySelector('.shorts-wrap');

  if (videoElement) {
    videoElement.play();
    wrapElement?.classList.add('playing');
  }
}
}
