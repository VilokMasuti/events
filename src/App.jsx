
import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd'; // Provides drag-and-drop context
import { HTML5Backend } from 'react-dnd-html5-backend'; // Backend for drag-and-drop
import Calendar from '../src/components/shared/Calendar';
import EventList from '../src/components/shared/EventList';
import EventForm from '../src/components/shared/EventForm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";


const App = () => {
  // State to store selected date on the calendar
  const [selectedDate, setSelectedDate] = useState(new Date());

  // State to manage events (list of events)
  const [events, setEvents] = useState([]);

  // State to control the visibility of the event form (Add/Edit)
  const [showEventForm, setShowEventForm] = useState(false);

  // State to store event being edited
  const [editingEvent, setEditingEvent] = useState(null);

  // State to store filter input for event search
  const [filter, setFilter] = useState('');

  // Toast hook to show success/error messages
  const { toast } = useToast();

  // 1. Load events from localStorage when the app is mounted
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || []; // Retrieve stored events or initialize as empty
    setEvents(storedEvents); // Set retrieved events to state
  }, []);

  // 2. Save events to localStorage whenever 'events' state changes
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events)); // Persist events in local storage
  }, [events]);

  /**
   * Function to add a new event
   * @param {Object} newEvent - New event details
   */
  const addEvent = (newEvent) => {
    // Prevent adding overlapping events
    if (isEventOverlapping(newEvent)) {
      toast({
        title: "Event Overlap",
        description: "This event overlaps with an existing event. Please choose a different time.",
        variant: "destructive",
      });
      return;
    }
    // Add the new event with a unique ID
    setEvents([...events, { ...newEvent, id: Date.now() }]);
    setShowEventForm(false); // Hide the event form

    // Show success toast
    toast({
      title: "Event Added",
      description: "Your event has been successfully added.",
    });
  };

  /**
   * Function to update an existing event
   * @param {Object} updatedEvent - Updated event details
   */
  const updateEvent = (updatedEvent) => {
    // Prevent overlapping when updating events
    if (isEventOverlapping(updatedEvent, updatedEvent.id)) {
      toast({
        title: "Event Overlap",
        description: "This event overlaps with an existing event. Please choose a different time.",
        variant: "destructive",
      });
      return;
    }
    // Update the specific event in the events list
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    setShowEventForm(false);
    setEditingEvent(null);

    // Show success toast
    toast({
      title: "Event Updated",
      description: "Your event has been successfully updated.",
    });
  };

  /**
   * Function to delete an event by its ID
   * @param {number} eventId - ID of the event to delete
   */
  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId)); // Remove the event from state
    toast({
      title: "Event Deleted",
      description: "Your event has been successfully deleted.",
    });
  };

  /**
   * Function to check if a new/updated event overlaps with existing events
   * @param {Object} newEvent - New or updated event details
   * @param {number} excludeEventId - Optional ID of the event to exclude (useful for updates)
   * @returns {boolean} - True if overlapping exists, false otherwise
   */
  const isEventOverlapping = (newEvent, excludeEventId = null) => {
    return events.some(event => {
      if (event.id === excludeEventId) return false; // Skip the event being edited
      if (event.date !== newEvent.date) return false; // Compare only events on the same date

      // Parse start and end times to check for overlap
      const newStart = new Date(`${newEvent.date}T${newEvent.startTime}`);
      const newEnd = new Date(`${newEvent.date}T${newEvent.endTime}`);
      const existingStart = new Date(`${event.date}T${event.startTime}`);
      const existingEnd = new Date(`${event.date}T${event.endTime}`);

      return (newStart < existingEnd && newEnd > existingStart); // Check overlap logic
    });
  };

  /**
   * Function to move an event to a new date
   * @param {number} id - ID of the event to move
   * @param {string} newDate - New date for the event
   */
  const moveEvent = (id, newDate) => {
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id === id) {
        const updatedEvent = { ...event, date: newDate };

        // Prevent overlap after moving
        if (isEventOverlapping(updatedEvent, id)) {
          toast({
            title: "Event Overlap",
            description: "This event overlaps with an existing event on the new date.",
            variant: "destructive",
          });
          return event;
        }
        return updatedEvent;
      }
      return event;
    }));
  };

  // Filter events based on user input (name or description)
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(filter.toLowerCase()) ||
    event.description.toLowerCase().includes(filter.toLowerCase())
  );

  /**
   * Function to export events of the selected month as a JSON file
   */
  const exportEvents = () => {
    const currentMonthEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear();
    });

    // Prepare JSON file for download
    const dataStr = JSON.stringify(currentMonthEvents, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileName = `events_${selectedDate.getFullYear()}_${selectedDate.getMonth() + 1}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();

    toast({
      title: "Events Exported",
      description: "Your events have been exported successfully.",
    });
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Dynamic Event Calendar</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar Component */}
          <div className="lg:w-3/4">
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              events={filteredEvents}
              onDayClick={() => setShowEventForm(true)}
              moveEvent={moveEvent}
            />
          </div>

          {/* Event Controls and List */}
          <div className="lg:w-1/4 space-y-4">
            <Input
              type="text"
              placeholder="Filter events..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full"
            />
            <Button onClick={exportEvents} className="w-full">Export Month Events</Button>
            <EventList
              events={filteredEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === selectedDate.toDateString();
              })}
              onEditEvent={(event) => {
                setEditingEvent(event);
                setShowEventForm(true);
              }}
              onDeleteEvent={deleteEvent}
              selectedDate={selectedDate}
            />
          </div>
        </div>

        {/* Event Form */}
        {showEventForm && (
          <EventForm
            selectedDate={selectedDate}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onClose={() => {
              setShowEventForm(false);
              setEditingEvent(null);
            }}
            editingEvent={editingEvent}
          />
        )}

        {/* Toast Notifications */}
        <Toaster />
      </div>
    </DndProvider>
  );
};

export default App;
