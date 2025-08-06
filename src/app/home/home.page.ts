import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { MmCardComponent } from '@components/mm-card/mm-card.component';
import { IonHeader, IonContent, IonButton, ToastController } from '@ionic/angular/standalone';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { BrazePluginService } from '@services/braze-plugin.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  template: `
    <ion-header mode="ios" class="ion-no-border">
      <app-header [showInboxButton]="true"></app-header>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding">
      <app-mm-card title="Implementation Task">
        <p class="m-b-2">Implement functionality to send <strong>INBOX_MESSAGE_TEST</strong> custom event to Braze.</p>
        <p class="m-b-2">
          Braze will send a push notification back to inform the client that there is a new content card available.
        </p>
        <p><strong>Note:</strong> Push notifications may take awhile to arrive</p>
      </app-mm-card>

      <ion-button (click)="sendInboxTestEvent()" color="primary" expand="block" size="large" fill="solid" class="m-t-4">
        Send Test Event
      </ion-button>
    </ion-content>
  `,
  styles: [],
  standalone: true,
  imports: [IonHeader, IonContent, IonButton, HeaderComponent, MmCardComponent]
})
export class HomePage implements OnInit, OnDestroy {
  private brazePluginService = inject(BrazePluginService);
  private toastController = inject(ToastController);
  private CUSTOM_EVENT_NAME = 'INBOX_MESSAGE_TEST';
  private destroy$ = new Subject<void>();

  async ngOnInit(): Promise<void> {
    this.brazePluginService.inboxNotifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => this.handleNotification(notifications));
  }

  async handleNotification(notifications: BrazeContentCard[]) {
    if (notifications.length === 0) return;
    const notification = notifications[notifications.length - 1]; // Assuming we only care about the last notification
    const toast = await this.toastController.create({
      message: notification.title || 'New Notification',
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }

  async sendInboxTestEvent(): Promise<void> {
    this.brazePluginService.logCustomEvent(this.CUSTOM_EVENT_NAME);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
