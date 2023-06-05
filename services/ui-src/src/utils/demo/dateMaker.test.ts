import {getDate, getCalendar} from './dateMaker';
describe("Calendar and Date functions", () => {
    test("returns 2 dates when double date is called", async () => {
      const calendar = getCalendar(false, true);
      console.log(calendar);
      expect(calendar.length).toEqual(2);
    });
  });
  