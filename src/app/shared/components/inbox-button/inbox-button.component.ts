import { AfterViewInit, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { IonButton, IonIcon, IonAccordion } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline } from 'ionicons/icons';
import anime, { AnimeInstance } from 'animejs';
import { PushNotificationService } from '@services/push-notification.service';
import { Subject, takeUntil } from 'rxjs';
import { BrazePluginService } from '@services/braze-plugin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inbox-button',
  template: `
    <div class="notification-button">
      @if (unreadMessages()) {
      <svg class="notification-button-unread" height="10" width="10" xmlns="http://www.w3.org/2000/svg">
        <circle r="4.5" cx="5" cy="5" fill="red" />
      </svg>
      }
      <ion-button class="bell" [slot]="slot()" fill="clear" (click)="showInbox()">
        <ion-icon color="dark" slot="icon-only" name="notifications-outline"></ion-icon>
      </ion-button>
    </div>
  `,
  styles: [
    `
      ion-button {
        --padding-end: 0.5rem;
        --padding-start: 0.5rem;
        font-size: 1.75rem;
      }

      .notification-button {
        position: relative;
        svg {
          position: absolute;
          top: 30%;
          right: 25%;
          z-index: 99;
        }
      }
    `
  ],
  imports: [IonButton, IonIcon],
  standalone: true
})
export class InboxButtonComponent implements AfterViewInit, OnInit, OnDestroy {
  readonly slot = input<IonAccordion['toggleIconSlot']>();
  unreadMessages = signal(false);
  private shakeAnimation?: AnimeInstance;
  private brazePluginService = inject(BrazePluginService);
  private destroy$ = new Subject<void>();
  private router = inject(Router);

  constructor() {
    addIcons({ notificationsOutline });
  }

  ngOnInit(): void {
    this.brazePluginService.inboxNotifications$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.unreadMessages.set(true);
      this.shakeAnimation?.restart();
    });
  }

  showInbox(): void {
    this.router.navigate(['/inbox']);
    // TODO: Show Inbox component in Modal when tapping Bell icon
  }

  // TODO: When receiving/reading new Braze inbox message, update notification state.
  // Icon should play the shake animation when new unread messages are received.
  //   this.unreadMessages = true;
  //   this.shakeAnimation?.restart();

  ngAfterViewInit(): void {
    this.shakeAnimation = anime({
      targets: '.bell',
      translateX: [
        { value: -5, duration: 50 },
        { value: 5, duration: 50 },
        { value: -5, duration: 50 },
        { value: 5, duration: 50 },
        { value: -5, duration: 50 },
        { value: 5, duration: 50 },
        { value: -5, duration: 50 },
        { value: 5, duration: 50 },
        { value: 0, duration: 50 }
      ],
      easing: 'easeInOutSine',
      duration: 2000,
      autoplay: false
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
