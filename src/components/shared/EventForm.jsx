/* eslint-disable react/prop-types */ // Disables ESLint prop-type validation for this file

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// EventForm Component
// A form to add or edit an event
const EventForm = ({ selectedDate, onAddEvent, onUpdateEvent, onClose, editingEvent }) => {
  // State for form data
  const [eventData, setEventData] = useState({
    name: '', // Event name
    date: selectedDate.toISOString().split('T')[0], // Format selected date to 'YYYY-MM-DD'
    startTime: '', // Start time of the event
    endTime: '', // End time of the event
    description: '', // Description of the event
    category: 'default', // Default category
  });

  // Populate form data if editing an existing event
  useEffect(() => {
    if (editingEvent) {
      setEventData({
        ...editingEvent,
        date: new Date(editingEvent.date).toISOString().split('T')[0], // Ensure date format is 'YYYY-MM-DD'
      });
    }
  }, [editingEvent]);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure the name and value from the input
    setEventData((prevData) => ({ ...prevData, [name]: value })); // Update state with the new input value
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    if (editingEvent) {
      // If editing an existing event, call the update function
      onUpdateEvent({ ...eventData, id: editingEvent.id });
    } else {
      // If adding a new event, call the add function
      onAddEvent(eventData);
    }
    onClose(); // Close the form modal
  };

  return (
    <Dialog open={true} onOpenChange={onClose}> {/* Dialog opens as a modal */}
      <DialogContent> {/* Modal content wrapper */}
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle> {/* Conditional title */}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4"> {/* Form with vertical spacing */}
          {/* Event Name Input */}
          <Input
            type="text"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            placeholder="Event Name"
            required
          />
          {/* Event Date Input */}
          <Input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
          {/* Start Time Input */}
          <Input
            type="time"
            name="startTime"
            value={eventData.startTime}
            onChange={handleChange}
            required
          />
          {/* End Time Input */}
          <Input
            type="time"
            name="endTime"
            value={eventData.endTime}
            onChange={handleChange}
            required
          />
          {/* Event Description Input */}
          <Textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Event Description"
          />
          {/* Event Category Selector */}
          <Select
            name="category"
            value={eventData.category}
            onValueChange={(value) => handleChange({ target: { name: 'category', value } })} // Handle Select changes
          >
            <SelectTrigger> {/* Dropdown trigger */}
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent> {/* Dropdown options */}
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onClose} // Close form modal without submitting
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">{editingEvent ? 'Update' : 'Add'} Event</Button> {/* Submit button */}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
