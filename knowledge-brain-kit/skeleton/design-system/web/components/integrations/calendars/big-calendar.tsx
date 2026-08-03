'use client';

import * as React from 'react';
import { useCallback, useState } from 'react';
import { Calendar, dateFnsLocalizer, type View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfToday } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange, Square, List, type LucideIcon } from 'lucide-react';
import { Button } from '~/components/primitives/button';
import { cn } from '~/lib/utils';

import './big-calendar.css';

// ── date-fns localizer ────────────────────────────────────────────────────────
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }), // Monday
    getDay,
    locales: { 'en-US': enUS },
});

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CalendarEvent {
    id: string | number;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    color?: string; // optional custom color override
    resource?: any;
}

export interface BigCalendarProps {
    /** Initial events to display */
    events?: CalendarEvent[];
    /** Initial view: month | week | day | agenda */
    defaultView?: View;
    /** Height of the calendar container */
    height?: number | string;
    /** Called when a slot (empty area) is clicked/selected */
    onSelectSlot?: (start: Date, end: Date) => void;
    /** Called when an event is clicked */
    onSelectEvent?: (event: CalendarEvent) => void;
    /** Called when an event is dragged to a new slot (if using DnD addon) */
    onEventDrop?: (event: CalendarEvent, start: Date, end: Date) => void;
    className?: string;
}

// ── View icon + label map ─────────────────────────────────────────────────────
const VIEW_CONFIG: { view: View; label: string; Icon: LucideIcon }[] = [
    { view: Views.MONTH, label: 'Month', Icon: CalendarDays },
    { view: Views.WEEK, label: 'Week', Icon: CalendarRange },
    { view: Views.DAY, label: 'Day', Icon: Square },
    { view: Views.AGENDA, label: 'Agenda', Icon: List },
];

// ── Custom Toolbar ────────────────────────────────────────────────────────────
interface ToolbarProps {
    date: Date;
    view: View;
    onNavigate: (direction: 'PREV' | 'NEXT' | 'TODAY') => void;
    onView: (view: View) => void;
}

function CalendarToolbar({ date, view, onNavigate, onView }: ToolbarProps) {
    const label = React.useMemo(() => {
        if (view === Views.MONTH) return format(date, 'MMMM yyyy');
        if (view === Views.WEEK) return `Week of ${format(date, 'MMM d, yyyy')}`;
        if (view === Views.DAY) return format(date, 'EEEE, MMMM d, yyyy');
        return `${format(date, 'MMM d')} — Agenda`;
    }, [date, view]);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            {/* Left: prev / today / next */}
            <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onNavigate('PREV')}>
                    <ChevronLeft size={16} />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs font-medium"
                    onClick={() => onNavigate('TODAY')}
                >
                    Today
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onNavigate('NEXT')}>
                    <ChevronRight size={16} />
                </Button>
            </div>

            {/* Center: date label */}
            <h2 className="text-sm font-semibold text-foreground tabular-nums">{label}</h2>

            {/* Right: view switcher */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                {VIEW_CONFIG.map(({ view: v, label: l, Icon }) => (
                    <Button
                        key={v}
                        variant={view === v ? 'outline' : 'ghost'}
                        size="sm"
                        onClick={() => onView(v)}
                        iconLeft={<Icon size={13} />}
                        className={cn(
                            'h-7 text-xs',
                            view === v && 'shadow-sm',
                        )}
                    >
                        <span className="hidden sm:inline">{l}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
}

// ── Event style getter ────────────────────────────────────────────────────────
function eventStyleGetter(event: CalendarEvent) {
    if (!event.color) return {};
    return {
        style: {
            backgroundColor: event.color,
            borderColor: event.color,
        },
    };
}

// ── Main component ────────────────────────────────────────────────────────────
export function BigCalendar({
    events = [],
    defaultView = Views.MONTH,
    height = 680,
    onSelectSlot,
    onSelectEvent,
    className,
}: BigCalendarProps) {
    const [date, setDate] = useState(startOfToday());
    const [view, setView] = useState<View>(defaultView);

    const handleNavigate = useCallback((direction: 'PREV' | 'NEXT' | 'TODAY') => {
        if (direction === 'TODAY') {
            setDate(startOfToday());
            return;
        }
        const delta = direction === 'NEXT' ? 1 : -1;
        setDate(prev => {
            if (view === Views.MONTH) return delta > 0 ? addMonths(prev, 1) : subMonths(prev, 1);
            if (view === Views.WEEK) return delta > 0 ? addWeeks(prev, 1) : subWeeks(prev, 1);
            if (view === Views.DAY) return delta > 0 ? addDays(prev, 1) : subDays(prev, 1);
            return delta > 0 ? addMonths(prev, 1) : subMonths(prev, 1);
        });
    }, [view]);

    return (
        <div className={cn('font-sans rounded-xl border border-border overflow-hidden bg-background shadow-sm', className)}>
            <CalendarToolbar
                date={date}
                view={view}
                onNavigate={handleNavigate}
                onView={setView}
            />
            <div style={{ height }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    date={date}
                    view={view}
                    onNavigate={setDate}
                    onView={setView}
                    selectable
                    onSelectSlot={slot => onSelectSlot?.(slot.start, slot.end)}
                    onSelectEvent={event => onSelectEvent?.(event as CalendarEvent)}
                    eventPropGetter={eventStyleGetter as any}
                    components={{
                        toolbar: () => null, // We use our custom toolbar above
                    }}
                    style={{ height: '100%' }}
                    popup
                    showMultiDayTimes
                />
            </div>
        </div>
    );
}

export default BigCalendar;
