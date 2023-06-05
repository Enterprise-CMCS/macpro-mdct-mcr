type Booking = {
  timestamp: string;
  name: string;
};

export const getDate = (name: string, verbose = false) => {
  const booking: Booking = {
    timestamp: new Date().toISOString(),
    name,
  };
  if (verbose) {
    console.log(`Dear Diary, I got a date at: ${booking.timestamp}`);
  }
  return booking;
};

export const getCalendar = (markDate: boolean, doubleDate: boolean) => {
  const calendar: Booking[] = [];
  // Note the below line collects lower coverage depending on order and short circuiting if not all conditions tested
  if (doubleDate || markDate.valueOf()) {
    calendar.push(getDate("TODAY"));
  }
  if (doubleDate) {
    calendar.push(getDate("TODAY x 2"));
  }
  return calendar;
};
