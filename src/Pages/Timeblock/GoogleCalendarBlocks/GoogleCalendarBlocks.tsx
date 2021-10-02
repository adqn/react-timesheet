import React from "react";
import { apiCalendar } from './ApiCalendar';

export const GoogleCalendarBlocks = () => {
  const api = apiCalendar();
  window.api = api;
  const handleCalendarLogIn = (): void => {
    api.handleAuthClick();
  };

  const logUpcomingEvents = async () => {
    const result = await api.listUpcomingEvents(50);
    console.log(result);
  }

  if (api.sign) {
    logUpcomingEvents();
    return null;
  } else {
    return (
      <>
        <br />
        <button onClick={handleCalendarLogIn}>sign-in</button>
      </>
    )
  }
};
