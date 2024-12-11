/* eslint-disable react/prop-types */ // Disables ESLint's prop-type validation for this file

import { useDrag } from 'react-dnd'; // Import the 'useDrag' hook for drag-and-drop functionality
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// EventItem Component
// Represents a draggable event card
const EventItem = ({ event, onEditEvent, onDeleteEvent }) => {
  // Initialize drag functionality using the `useDrag` hook from react-dnd
  const [{ isDragging }, drag] = useDrag({
    type: 'event', // Identifies the type of draggable item
    item: { id: event.id }, // Data passed when dragging starts, here it's the event ID
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // Tracks if the current item is being dragged
    }),
  });

  return (
    <div
      ref={drag} // Binds the `drag` reference to enable drag-and-drop on this element
      className={`p-4 mb-4 rounded-lg
        ${event.category === 'work' ? 'bg-red-100' : // Adds background color based on event category
          event.category === 'personal' ? 'bg-green-100' : 'bg-yellow-100'}
        ${isDragging ? 'opacity-50' : ''} // Adds transparency when the item is being dragged`}
    >
      <h3 className="font-bold">{event.name}</h3> {/* Event name displayed as bold text */}
      <p className="text-sm text-gray-600">
        {event.startTime} - {event.endTime} {/* Display event start and end times */}
      </p>
      <p className="text-sm mt-2">{event.description}</p> {/* Display event description */}
      <div className="mt-2 space-x-2"> {/* Action buttons for the event */}
        <Button
          onClick={() => onEditEvent(event)} // Edit button triggers the onEditEvent callback
          variant="outline"
          size="sm"
        >
          Edit
        </Button>
        <Button
          onClick={() => onDeleteEvent(event.id)} // Delete button triggers the onDeleteEvent callback
          variant="destructive"
          size="sm"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};


const EventList = ({ events, onEditEvent, onDeleteEvent, selectedDate }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6"> {/* Container with background, shadow, and padding */}
      <h3 className="text-xl font-bold mb-4">
        Events for {selectedDate.toDateString()} {/* Header showing selected date */}
      </h3>
      <ScrollArea className="h-[calc(100vh-300px)]"> {/* Scrollable area for long lists */}
        {events.length === 0 ? ( // Conditional rendering if no events exist
          <p>No events for this day.</p>
        ) : (
          <div>
            {events.map(event => ( // Iterate over each event and render an EventItem component
              <EventItem
                key={event.id} // Assign a unique key for each item in the list
                event={event} // Pass the event data as props
                onEditEvent={onEditEvent} // Pass the edit callback function
                onDeleteEvent={onDeleteEvent} // Pass the delete callback function
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default EventList;
