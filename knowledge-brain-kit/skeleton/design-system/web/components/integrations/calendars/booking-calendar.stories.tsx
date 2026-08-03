import type { Meta, StoryObj } from '@storybook/react';
import { BookingCalendar, DayAvailability } from './booking-calendar';
import { addDays, format } from 'date-fns';

const meta = {
    title: 'Integrations/Calendars/Booking Calendar',
    component: BookingCalendar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onSelectSlot: { action: 'selected' },
    },
} satisfies Meta<typeof BookingCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to generate some mock availability data
const generateMockAvailability = (): DayAvailability[] => {
    const data: DayAvailability[] = [];
    const today = new Date();

    // Generate for the next 14 days
    for (let i = 0; i < 14; i++) {
        const date = addDays(today, i);
        const dateString = format(date, 'yyyy-MM-dd');

        // Skip some days entirely (e.g., weekends or random days) to simulate fully booked / closed days
        if (date.getDay() === 0) continue; // Skip Sundays

        // Generate some random slots
        const slots = [
            { time: "09:00", available: Math.random() > 0.3 },
            { time: "09:30", available: Math.random() > 0.3 },
            { time: "10:00", available: Math.random() > 0.3 },
            { time: "10:30", available: Math.random() > 0.3 },
            { time: "11:00", available: Math.random() > 0.3 },
            { time: "11:30", available: Math.random() > 0.3 },
            { time: "12:00", available: false }, // Lunch break
            { time: "12:30", available: false }, // Lunch break
            { time: "13:00", available: Math.random() > 0.3 },
            { time: "13:30", available: Math.random() > 0.3 },
            { time: "14:00", available: Math.random() > 0.3 },
            { time: "14:30", available: Math.random() > 0.3 },
            { time: "15:00", available: Math.random() > 0.3 },
            { time: "15:30", available: Math.random() > 0.3 },
            { time: "16:00", available: Math.random() > 0.3 },
            { time: "16:30", available: Math.random() > 0.3 },
        ];

        // Ensure at least one day has exactly 0 available slots to test the completely unavailable logic
        if (i === 3) {
            slots.forEach(s => s.available = false);
        }

        data.push({ dateString, slots });
    }

    return data;
};

const mockData = generateMockAvailability();

export const Default: Story = {
    args: {
        availability: mockData,
        defaultDate: new Date(),
    },
};

export const NoAvailability: Story = {
    args: {
        availability: [],
        defaultDate: new Date(),
    },
};
