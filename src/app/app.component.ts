import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PushNotificationService } from '@services/push-notification.service';
import { Platform } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {
  constructor(
    private pushNotificationService: PushNotificationService,
    private platform: Platform,
    private router: Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    // Initialize services after platform is ready
    this.pushNotificationService.init();

    this.listenToDeeplinks();
  }

  private listenToDeeplinks() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const url = event.url;
      if (url) {
        const path = new URL(url).pathname;
        const cleanedPath = path.replace(/^\/+|\/+$/g, '');
        this.router.navigateByUrl(`/${cleanedPath}`).catch((error) => {
          console.error('Error navigating to URL:', error);
        });
      }
    });
  }
}
