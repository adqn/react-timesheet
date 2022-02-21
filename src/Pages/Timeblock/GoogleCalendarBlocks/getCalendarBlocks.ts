import { apiCalendar } from './ApiCalendar';

export const initCalendar = () => {
    const api = apiCalendar();
    api.onLoad(() => {
        if (!api.sign) {
            api.handleAuthClick();
        }
    })
};

export const getCalendarBlocks = async () => {
    /*
    Example raw event JSON
    {
        "kind": "calendar#event",
        "etag": "\"3290800126130000\"",
        "id": "5lqqk2grdr0e0l8vtads848gaj_20220220T080000Z",
        "status": "confirmed",
        "htmlLink": "https://www.google.com/calendar/event?eid=NWxxcWsyZ3JkcjBlMGw4dnRhZHM4NDhnYWpfMjAyMjAyMjBUMDgwMDAwWiBrc2lvbmRhZzg0NkBt",
        "created": "2022-02-20T23:34:23.000Z",
        "updated": "2022-02-20T23:34:23.065Z",
        "summary": "Rory: Sleep",
        "creator": {
            "email": "ksiondag846@gmail.com",
            "self": true
        },
        "organizer": {
            "email": "ksiondag846@gmail.com",
            "self": true
        },
        "start": {
            "dateTime": "2022-02-20T00:00:00-08:00",
            "timeZone": "America/Los_Angeles"
        },
        "end": {
            "dateTime": "2022-02-20T07:30:00-08:00",
            "timeZone": "America/Los_Angeles"
        },
        "recurringEventId": "5lqqk2grdr0e0l8vtads848gaj",
        "originalStartTime": {
            "dateTime": "2022-02-20T00:00:00-08:00",
            "timeZone": "America/Los_Angeles"
        },
        "iCalUID": "5lqqk2grdr0e0l8vtads848gaj@google.com",
        "sequence": 0,
        "reminders": {
            "useDefault": true
        },
        "eventType": "default"
    },
    */
    const api = apiCalendar();
    const events: {summary: string; start: Date, end: Date}[] = (await api.listTodaysEvents()).result.items.map((rawEvent: any) => ({
        summary: rawEvent.summary.replace("Rory:", ""),
        start: new Date(rawEvent.start.dateTime),
        end: new Date(rawEvent.end.dateTime),
    }));

    return events;
};