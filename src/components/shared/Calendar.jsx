/* eslint-disable react/prop-types */
// Disables ESLint's prop-types validation warning for props passed to the component.

import { useDrop } from 'react-dnd';
// Importing `useDrop` hook from `react-dnd` to enable drag-and-drop functionality.

import { Button } from "@/components/ui/button";


const Calendar = ({ selectedDate, setSelectedDate, events, onDayClick, moveEvent }) => {
  /*
  Calendar Component:
  - Displays a monthly calendar grid.
  - Allows users to navigate between months.
  - Highlights the current day and selected day.
  - Supports drag-and-drop to move events to different dates.

  Props:
  - selectedDate: Currently selected date.
  - setSelectedDate: Function to update the selected date.
  - events: Array of events with their corresponding dates.
  - onDayClick: Callback when a day is clicked.
  - moveEvent: Function to move an event to a different date.
  */

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  // Calculates the total number of days in the current month.

  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  // Gets the index (0-6) of the first day of the month (0 = Sunday, 1 = Monday, etc.).

  const prevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };
  // Moves to the previous month by decrementing the month and resetting the date to the 1st.

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };
  // Moves to the next month by incrementing the month and resetting the date to the 1st.

  const CalendarDay = ({ day, isToday, isSelected, dayEvents }) => {
    /*
    CalendarDay Component:
    - Represents an individual day in the calendar grid.
    - Highlights today's date and the selected date.
    - Supports drag-and-drop for moving events to this day.
    */

    const [{ isOver }, drop] = useDrop({
      accept: 'event',
      // Accepts draggable items of type "event".

      drop: (item) => {
        const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
          .toISOString().split('T')[0];
        moveEvent(item.id, newDate);
        // Moves the event to the new date by calling `moveEvent` with event id and date.
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        // Indicates whether an item is currently being dragged over this day.
      }),
    });

    const hasEvents = dayEvents.length > 0;
    // Checks if there are any events scheduled for this day.

    return (
      <div
        ref={drop}
        // Assigns the `drop` ref to make this day a drop target for drag-and-drop.
        className={`p-2 border rounded-lg
          ${isToday ? 'bg-blue-100' : ''}
          ${isSelected ? 'border-blue-500' : ''}
          ${isOver ? 'bg-green-100' : ''}
          ${hasEvents ? 'font-bold' : ''}`}
        // Dynamically applies classes based on the current state:
        // - Highlights today's date (`bg-blue-100`).
        // - Highlights the selected date with a border (`border-blue-500`).
        // - Changes background color when an item is dragged over (`bg-green-100`).
        // - Makes the font bold if events exist (`font-bold`).

        onClick={() => {
          setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
          onDayClick();
          // Updates the selected date when this day is clicked.
        }}
      >
        <span className={`${hasEvents ? 'text-blue-600' : ''}`}>
          {day}
        </span>
        {/* Displays the day number with blue text if events exist for this day. */}

        {dayEvents.length > 0 && (
          <div className="mt-1 h-1 w-1 bg-blue-500 rounded-full mx-auto"></div>
        )}
        {/* Adds a small blue dot below the day number if events are present. */}
      </div>
    );
  };

  return (
    <div className="calendar bg-white shadow-lg rounded-lg p-6">


      <div className="flex justify-between items-center mb-4">
        {/* Header Section: Month Navigation */}
        <Button onClick={prevMonth} variant="outline">&lt; Previous</Button>
        {/* Button to navigate to the previous month. */}

        <h2 className="text-xl font-bold">
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        {/* Displays the current month and year in a bold, large font. */}

        <Button onClick={nextMonth} variant="outline">Next &gt;</Button>
        {/* Button to navigate to the next month. */}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {/*
    Calendar Grid Layout:
    - Creates a 7-column grid to represent the 7 days of the week.
    - 'gap-2' adds spacing between grid items.
  */}

        {/* Header: Renders the names of the days of the week. */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-gray-500">
            {/* Each day is rendered as a grid item. */}
            {day}
          </div>
        ))}

        {/* Empty Grid Spaces: Adds empty cells before the first day of the month. */}
        {[...Array(firstDayOfMonth).keys()].map(i => (
          <div key={`empty-${i}`}></div>
          /*
            Creates empty divs (placeholders) for the days before the first actual day of the month.
            - `firstDayOfMonth` represents the index of the first day (e.g., 0 = Sunday, 1 = Monday, etc.).
            - [...Array(n).keys()] creates an array [0, 1, ..., n-1] to map over.
            - Each empty cell is given a unique key like 'empty-0', 'empty-1', etc.
          */
        ))

        /* Days of the Month: Renders the days and their associated events. */}
        {[...Array(daysInMonth).keys()].map(i => {
          const day = i + 1; // Actual day number (1-based index).
          const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
          const isToday = currentDate.toDateString() === new Date().toDateString(); // Check if the day is today.
          const isSelected = currentDate.toDateString() === selectedDate.toDateString(); // Check if the day is selected.

          // Filters events occurring on the current date.
          const dayEvents = events.filter(event =>
            new Date(event.date).toDateString() === currentDate.toDateString()
          );

          return (
            <CalendarDay
              key={day} // Unique key for each day.
              day={day} // Pass the current day number as a prop.
              isToday={isToday} // Boolean: Highlights the current day.
              isSelected={isSelected} // Boolean: Marks the selected day.
              dayEvents={dayEvents} // Pass the filtered events for the current day.
            />
          );
        })}
      </div>


    </div>
  );
};

export default Calendar;

