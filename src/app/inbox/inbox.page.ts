import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '@components/header/header.component';
import { InboxCardComponent } from '@components/inbox-card/inbox-card.component';
import { SpinnerComponent } from '@components/spinner/spinner.component';
import { IonHeader, IonContent, AlertController } from '@ionic/angular/standalone';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { BrazePluginService } from '@services/braze-plugin.service';

@Component({
  selector: 'app-inbox',
  template: `
    <ion-header mode="ios" class="ion-no-border">
      <app-header
        title="Notifications"
        [showBackButton]="true"
        [showInboxButton]="false"
        (backEvent)="navigateBack()"
      ></app-header>
    </ion-header>
    <ion-content [fullscreen]="true" class="ion-padding">
      @if (notifications$ | async; as notifications) { @if (notifications && notifications.length > 0) {
      @for(notification of notifications; track notification.id) {
      <app-inbox-card
        [notification]="notification"
        (onCardClick)="clickedCard(notification)"
        (onDismissCard)="verifyDeleteCard(notification)"
      ></app-inbox-card>
      } } @else {
      <p>No notifications available</p>
      } } @else {
      <app-spinner />
      }
    </ion-content>
  `,
  standalone: true,
  styles: [
    `
      .action-button {
        color: black !important;
      }
    `
  ],
  imports: [CommonModule, IonHeader, IonContent, HeaderComponent, InboxCardComponent, AsyncPipe, SpinnerComponent]
})
export class InboxPage implements OnInit {
  private router = inject(Router);
  private brazePluginService = inject(BrazePluginService);
  private alertController = inject(AlertController);

  notifications$ = this.brazePluginService.inboxNotifications$;

  async verifyDeleteCard(notification: BrazeContentCard) {
    const alert = await this.alertController.create({
      header: 'Delete Message',
      message: 'Are you sure you would like to delete this message?',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'action-button'
        },
        {
          text: 'Yes',
          cssClass: 'action-button',
          handler: () => {
            this.brazePluginService.logContentCardDismissed(notification.id);
            console.log(`Deleted notification with ID: ${notification.id}`);
          }
        }
      ]
    });

    await alert.present();
  }

  clickedCard(notification: BrazeContentCard) {
    if (notification.url) {
      this.brazePluginService.logContentCardClicked(notification.id);

      this.handleDeeplink(notification.url);
    } else {
      console.warn('No URL available for this notification');
    }
  }

  handleDeeplink(url: string) {
    const path = url.split(':/')[1];
    this.router.navigateByUrl(`/${path}`).catch((error) => {
      console.error('Error navigating to URL:', error);
    });
  }

  ngOnInit(): void {
    this.brazePluginService.getContentCardsFromCache();
  }
  navigateBack(): void {
    this.router.navigate(['..']);
  }
}
