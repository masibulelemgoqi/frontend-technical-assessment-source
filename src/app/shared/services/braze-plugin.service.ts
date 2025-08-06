import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { BehaviorSubject, Subject } from 'rxjs';

const BrazePlugin = require('braze-cordova-sdk');

@Injectable({
  providedIn: 'root'
})
export class BrazePluginService {
  private inboxNotificationSubject = new Subject<BrazeContentCard[]>();

  get inboxNotifications$() {
    return this.inboxNotificationSubject.asObservable();
  }

  initialize(token: string) {
    BrazePlugin.setRegisteredPushToken(token);
    BrazePlugin.subscribeToInAppMessage(true);
  }

  logCustomEvent(eventName: string, properties?: Record<string, any>) {
    if (Capacitor.isNativePlatform()) {
      BrazePlugin.logCustomEvent(eventName, properties);
    } else {
      console.warn('Braze custom events are not supported on web platform');
    }
  }

  setUserId(userId: string) {
    BrazePlugin.updateUser(userId);
  }

  getContentCardsFromServer() {
    BrazePlugin.getContentCardsFromServer(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  getContentCardsFromCache() {
    BrazePlugin.getContentCardsFromCache(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  logContentCardClicked(cardId: string) {
    BrazePlugin.logContentCardClicked(cardId);
  }

  logContentCardImpression(cardId: string) {
    BrazePlugin.logContentCardImpression(cardId);
  }

  logContentCardDismissed(cardId: string) {
    BrazePlugin.logContentCardDismissed(cardId);
  }

  private successCallback(contentCards: BrazeContentCard[]) {
    const inboxCards = contentCards.filter((card) => card.extras?.type == 'inbox');
    this.inboxNotificationSubject.next(inboxCards);
  }

  private errorCallback(error: any) {
    console.error('Error fetching content cards:', error);
  }
}
