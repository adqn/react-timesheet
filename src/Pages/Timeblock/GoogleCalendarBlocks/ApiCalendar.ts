const Config = require('./apiGoogleconfig.json');

class ApiCalendar {
  sign: boolean = false;
  gapi: any = null;
  onLoadCallback: any = null;
  calendar: string = 'primary';

  constructor() {
    try {
      this.updateSigninStatus = this.updateSigninStatus.bind(this);
      this.initClient = this.initClient.bind(this);
      this.handleSignoutClick = this.handleSignoutClick.bind(this);
      this.handleAuthClick = this.handleAuthClick.bind(this);
      this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
      this.listEvents = this.listEvents.bind(this);
      this.listenSign = this.listenSign.bind(this);
      this.onLoad = this.onLoad.bind(this);
      this.setCalendar = this.setCalendar.bind(this);
      this.getBasicUserProfile = this.getBasicUserProfile.bind(this);
      this.handleClientLoad();
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Update connection status.
   * @param {boolean} isSignedIn
   */
  private updateSigninStatus(isSignedIn: boolean): void {
    this.sign = isSignedIn;
  }

  /**
   * Auth to the google Api.
   */
  private initClient(): void {
    this.gapi = window['gapi'];
    this.gapi.client
      .init(Config)
      .then(() => {
        // Listen for sign-in state changes.
        this.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(this.updateSigninStatus);
        // Handle the initial sign-in state.
        this.updateSigninStatus(
          this.gapi.auth2.getAuthInstance().isSignedIn.get()
        );
        if (this.onLoadCallback) {
          this.onLoadCallback();
        }
      })
      .catch((e: any) => {
        console.log(e);
      });
  }

  /**
   * Init Google Api
   * And create gapi in global
   */
  private handleClientLoad(): void {
    this.gapi = window['gapi'];
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);
    script.onload = (): void => {
      window['gapi'].load('client:auth2', this.initClient);
    };
  }

  /**
   * Sign in Google user account
   */
  public handleAuthClick(): void {
    if (this.gapi) {
      this.gapi.auth2.getAuthInstance().signIn();
    } else {
      console.log('Error: this.gapi not loaded');
    }
  }

  /**
   * Set the default attribute calendar
   * @param {string} newCalendar
   */
  public setCalendar(newCalendar: string): void {
    this.calendar = newCalendar;
  }

  /**
   * Execute the callback function when a user is disconnected or connected with the sign status.
   * @param callback
   */
  public listenSign(callback: any): void {
    if (this.gapi) {
      this.gapi.auth2.getAuthInstance().isSignedIn.listen(callback);
    } else {
      console.log('Error: this.gapi not loaded');
    }
  }

  /**
   * Execute the callback function when gapi is loaded
   * @param callback
   */
  public onLoad(callback: any): void {
    if (this.gapi) {
      callback();
    } else {
      this.onLoadCallback = callback;
    }
  }

  /**
   * Sign out user google account
   */
  public handleSignoutClick(): void {
    if (this.gapi) {
      this.gapi.auth2.getAuthInstance().signOut();
    } else {
      console.log('Error: this.gapi not loaded');
    }
  }

  /**
   * List all events in the calendar
   * @param {number} maxResults to see
   * @param {string} calendarId to see by default use the calendar attribute
   * @returns {any}
   */
  public listUpcomingEvents(
    maxResults: number,
    calendarId: string = this.calendar
  ): any {
    if (this.gapi) {
      return this.gapi.client.calendar.events.list({
        calendarId: calendarId,
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: maxResults,
        orderBy: 'startTime',
      });
    } else {
      console.log('Error: this.gapi not loaded');
      return false;
    }
  }

  /**
   * List all events in the calendar queried by custom query options
   * See all available options here https://developers.google.com/calendar/v3/reference/events/list
   * @param {object} queryOptions to see
   * @param {string} calendarId to see by default use the calendar attribute
   * @returns {any}
   */
  public listEvents(queryOptions: object,calendarId: string = this.calendar): any {
    if (this.gapi) {
        return this.gapi.client.calendar.events.list({
            calendarId,
            ...queryOptions
        });
    } else {
        console.log('Error: this.gapi not loaded');
        return false;
    }
  }

  /**
   * @returns {any} Get the user's basic profile information. Documentation: https://developers.google.com/identity/sign-in/web/reference#googleusergetbasicprofile
   */
  getBasicUserProfile(): any {
    if (this.gapi) {
      return this.gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile();
    } else {
      console.log('Error: gapi is not loaded use onLoad before please.');
      return null;
    }
  }
}

let _apiCalendar: ApiCalendar;

export function apiCalendar() {
  if (!_apiCalendar) {
    try {
      _apiCalendar = new ApiCalendar();
    } catch (e) {
      console.log(e);
    }
  }

  return _apiCalendar;
}