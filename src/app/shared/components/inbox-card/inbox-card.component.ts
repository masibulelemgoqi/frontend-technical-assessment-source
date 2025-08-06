import { Component, inject, input, output } from '@angular/core';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/angular/standalone';
import { ImageLoaderComponent } from '@components/image-loader/image-loader.component';
import { closeCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-inbox-card',
  template: ` <ion-card class="ion-no-padding" (click)="onCardClick.emit(notification)">
    <ion-card-header>
      @if (title) {
      <ion-card-title>
        <div class="notification-card">
          <div class="notification-card-title">
            @if(icon) {
            <div class="m-r-1">
              <app-image-loader
                src="{{ icon }}"
                imageClass="iconize"
                maxWidth="35px"
                skeletonDiameter="35px"
                skeletonBorderRadius="35px"
              ></app-image-loader>
            </div>
            }
            <p class="notification-title">{{ title }}</p>
          </div>
          <div class="notification-card-action">
            <ion-icon
              name="close-circle-outline"
              color="danger"
              size="large"
              (click)="onDismissCard.emit(notification)"
            ></ion-icon>
          </div>
        </div>
      </ion-card-title>
      }
    </ion-card-header>

    <ion-card-content>
      @if (description) {
      <p>{{ description }}</p>
      }
    </ion-card-content>
  </ion-card>`,
  standalone: true,
  styles: [
    `
      .notification-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      .notification-card-title {
        display: flex;
        align-items: center;
      }

      .notification-card-action {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .notification-title {
        font-size: 14px;
        font-weight: 500;
      }

      .icon {
        background-color: var(--ion-color-light);
        width: 100%;
      }
    `
  ],
  imports: [IonCardContent, IonCard, IonCardHeader, IonCardTitle, ImageLoaderComponent, IonIcon]
})
export class InboxCardComponent {
  notification = input<BrazeContentCard>();
  onDismissCard = output<(notification: BrazeContentCard) => void>();
  onCardClick = output<(notification: BrazeContentCard) => void>();

  constructor() {
    addIcons({ closeCircleOutline });
  }

  get id() {
    return this.notification()?.id;
  }

  get title() {
    return this.notification()?.title;
  }

  get icon() {
    return this.notification()?.image;
  }

  get description() {
    return this.notification()?.cardDescription;
  }
}
