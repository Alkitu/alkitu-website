import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BigCalendar, type CalendarEvent } from './big-calendar';
import { addHours, addDays, startOfToday, setHours, setMinutes } from 'date-fns';

const meta = {
    title: 'Integrations/Calendars/Big Calendar',
    component: BigCalendar,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
Google Calendar–style calendar built with **react-big-calendar** + **date-fns**.
All colors, borders, typography, and backgrounds are driven by your design system CSS variables.
Toggle dark mode in the Storybook toolbar to see automatic theme switching.
                `.trim(),
            },
        },
    },
    tags: ['autodocs'],
} satisfies Meta<typeof BigCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Demo events ───────────────────────────────────────────────────────────────
const today = startOfToday();

const SAMPLE_EVENTS: CalendarEvent[] = [
    // Today
    {
        id: 1,
        title: 'Design System Sprint Planning',
        start: setMinutes(setHours(today, 9), 0),
        end: setMinutes(setHours(today, 10), 30),
        color: 'hsl(217, 91%, 50%)', // blue
    },
    {
        id: 2,
        title: 'Component Review',
        start: setMinutes(setHours(today, 13), 0),
        end: setMinutes(setHours(today, 14), 0),
        color: 'hsl(142, 71%, 35%)', // green
    },
    {
        id: 3,
        title: 'Stakeholder Demo',
        start: setMinutes(setHours(today, 16), 0),
        end: setMinutes(setHours(today, 17), 30),
        color: 'hsl(25, 95%, 45%)',  // orange
    },
    // Tomorrow
    {
        id: 4,
        title: 'Figma → Code Sync',
        start: setMinutes(setHours(addDays(today, 1), 10), 0),
        end: setMinutes(setHours(addDays(today, 1), 11), 0),
        color: 'hsl(280, 65%, 55%)', // purple
    },
    {
        id: 5,
        title: 'Accessibility Audit',
        start: setMinutes(setHours(addDays(today, 1), 14), 30),
        end: setMinutes(setHours(addDays(today, 1), 16), 0),
    },
    // All-day
    {
        id: 6,
        title: '🎨 Design System v2 Launch',
        start: addDays(today, 3),
        end: addDays(today, 4),
        allDay: true,
        color: 'hsl(334, 75%, 50%)', // pink
    },
    {
        id: 7,
        title: 'Team Offsite',
        start: addDays(today, 7),
        end: addDays(today, 9),
        allDay: true,
        color: 'hsl(25, 95%, 45%)',
    },
    // Earlier this week
    {
        id: 8,
        title: 'Token Audit',
        start: setMinutes(setHours(addDays(today, -2), 11), 0),
        end: setMinutes(setHours(addDays(today, -2), 12), 0),
    },
    {
        id: 9,
        title: 'Dark Mode QA',
        start: setMinutes(setHours(addDays(today, -1), 15), 0),
        end: setMinutes(setHours(addDays(today, -1), 16), 30),
        color: 'hsl(142, 71%, 35%)',
    },
];

// ── Stories ───────────────────────────────────────────────────────────────────
export const MonthView: Story = {
    args: {
        events: SAMPLE_EVENTS,
        defaultView: 'month',
        height: 680,
    },
};

export const WeekView: Story = {
    args: {
        events: SAMPLE_EVENTS,
        defaultView: 'week',
        height: 680,
    },
};

export const DayView: Story = {
    args: {
        events: SAMPLE_EVENTS,
        defaultView: 'day',
        height: 680,
    },
};

export const AgendaView: Story = {
    args: {
        events: SAMPLE_EVENTS,
        defaultView: 'agenda',
        height: 680,
    },
};

// Interactive: click to add an event
const InteractiveTemplate = () => {
    const [events, setEvents] = useState<CalendarEvent[]>(SAMPLE_EVENTS);

    const handleSelectSlot = (start: Date, end: Date) => {
        const title = window.prompt('New event title:');
        if (title) {
            setEvents(prev => [...prev, {
                id: Date.now(),
                title,
                start,
                end,
                allDay: false,
            }]);
        }
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        if (window.confirm(`Delete "${event.title}"?`)) {
            setEvents(prev => prev.filter(e => e.id !== event.id));
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
                Click an empty slot to add an event. Click an event to delete it.
            </p>
            <BigCalendar
                events={events}
                defaultView="week"
                height={680}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
            />
        </div>
    );
};

export const Interactive: Story = {
    args: { events: SAMPLE_EVENTS },
    render: () => <InteractiveTemplate />,
};
