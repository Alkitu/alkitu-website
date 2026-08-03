'use client';

import * as React from 'react';
import { format, isSameDay, parseISO, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '~/components/primitives/calendar';
import { Button } from '~/components/primitives/button';
import { cn } from '~/lib/utils';
import { ScrollArea } from '~/components/primitives/scroll-area';

export interface TimeSlot {
    time: string;
    available: boolean;
}

export interface DayAvailability {
    dateString: string;
    slots: TimeSlot[];
}

export interface BookingCalendarProps {
    availability: DayAvailability[];
    onSelectSlot?: (date: Date, time: string) => void;
    defaultDate?: Date;
    className?: string;
    dateLabel?: string;
    timeLabel?: string;
}

export function BookingCalendar({
    availability = [],
    onSelectSlot,
    className,
    defaultDate,
    dateLabel = 'Selecciona fecha',
    timeLabel = 'Selecciona hora',
}: BookingCalendarProps) {
    const defaultInitDate = defaultDate || new Date();
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(defaultInitDate);
    const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
    const [month, setMonth] = React.useState<Date>(defaultInitDate);
    const [calendarHeight, setCalendarHeight] = React.useState<number | undefined>(undefined);
    const [calendarWidth, setCalendarWidth] = React.useState<number | undefined>(undefined);
    const calendarRef = React.useRef<HTMLDivElement>(null);

    // Measure the calendar card's natural height and sync it to the time slots pane
    React.useEffect(() => {
        const el = calendarRef.current;
        if (!el) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setCalendarHeight(entry.borderBoxSize[0].blockSize);
                setCalendarWidth(entry.borderBoxSize[0].inlineSize);
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
        if (defaultDate) {
            setMonth(defaultDate);
            setSelectedDate(defaultDate);
        }
    }, [defaultDate]);

    const getAvailabilityForDate = (date: Date) => {
        return availability.find((day) => {
            const dayDate = parseISO(day.dateString);
            return isSameDay(dayDate, date);
        });
    };

    const isDateDisabled = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return true;
        const dayAvail = getAvailabilityForDate(date);
        if (!dayAvail || dayAvail.slots.length === 0) return true;
        return !dayAvail.slots.some(slot => slot.available);
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            setMonth(date);
            setSelectedTime(null);
        }
    };

    const handleTimeSelect = (time: string, date: Date | undefined) => {
        if (!date) return;
        setSelectedTime(time);
        onSelectSlot?.(date, time);
    };

    const selectedDayAvailability = selectedDate ? getAvailabilityForDate(selectedDate) : null;
    const slots = selectedDayAvailability?.slots || [];

    const modifiers = {
        available: (date: Date) => {
            if (isDateDisabled(date)) return false;
            const dayAvail = getAvailabilityForDate(date);
            return dayAvail ? dayAvail.slots.some(s => s.available) : false;
        }
    };

    const modifiersClassNames = {
        available: "bg-primary/10 text-primary font-semibold hover:bg-primary/20",
    };

    return (
        <div className={cn("w-full max-w-5xl mx-auto", className)}>
            {/* Section Labels Row */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-10 mb-4">
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground text-center md:text-left">
                        {dateLabel}
                    </h3>
                </div>
                <div className="flex-1 hidden md:block">
                    <h3 className="text-base font-semibold text-foreground text-center md:text-left">
                        {timeLabel}
                    </h3>
                </div>
            </div>

            {/* Main Content: Flex layout, calendar dictates height */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-10 md:items-start md:justify-center">

                {/* ─── Left Pane: Calendar (height authority) ─── */}
                <div
                    ref={calendarRef}
                    className="w-full md:w-auto rounded-2xl border border-border/60 bg-card p-5 md:p-6"
                >
                    {/* Header: Month LEFT, arrows RIGHT */}
                    <div className="flex items-center justify-between w-full mb-4">
                        <h4 className="text-base md:text-lg font-semibold capitalize text-foreground whitespace-nowrap">
                            {format(month, "MMMM yyyy", { locale: es })}
                        </h4>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Mes anterior"
                                className="h-8 w-8"
                                onClick={() => setMonth(addMonths(month, -1))}
                                iconLeft={<ChevronLeft className="h-4 w-4" />}
                                iconOnly
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Mes siguiente"
                                className="h-8 w-8"
                                onClick={() => setMonth(addMonths(month, 1))}
                                iconLeft={<ChevronRight className="h-4 w-4" />}
                                iconOnly
                            />
                        </div>
                    </div>

                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        month={month}
                        onMonthChange={setMonth}
                        disabled={isDateDisabled}
                        locale={es}
                        showOutsideDays={false}
                        modifiers={modifiers}
                        modifiersClassNames={modifiersClassNames}
                        className="p-0 w-full bg-transparent"
                        classNames={{
                            months: "w-full flex-col",
                            month: "w-full",
                            month_caption: "hidden",
                            nav: "hidden",
                            table: "w-full border-collapse",
                            head_row: "flex w-full justify-between mb-2",
                            head_cell: "text-muted-foreground font-semibold text-xs w-full uppercase tracking-wider text-center",
                            row: "flex w-full mt-1 justify-between",
                            cell: "text-center text-sm p-0.5 w-full relative focus-within:relative focus-within:z-20",
                            day: cn(
                                "h-10 w-10 md:h-11 md:w-11 mx-auto p-0 font-normal rounded-full hover:bg-muted transition-colors text-sm md:text-base flex items-center justify-center"
                            ),
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold shadow-md",
                            day_today: "text-foreground font-semibold relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:bg-primary after:rounded-full",
                            day_outside: "text-muted-foreground opacity-70",
                            day_disabled: "text-muted-foreground opacity-70 cursor-not-allowed hover:bg-transparent",
                            day_hidden: "invisible",
                        }}
                    />
                </div>

                {/* ─── Right Pane: Time Slots (height synced to calendar) ─── */}
                <div className="w-full md:w-auto flex flex-col">
                    {/* Mobile-only label */}
                    <h3 className="text-base font-semibold text-foreground text-center mb-4 md:hidden">
                        {timeLabel}
                    </h3>

                    <div
                        className="rounded-2xl border border-border/60 bg-card overflow-hidden"
                        style={{
                            height: calendarHeight || undefined,
                            width: calendarWidth || undefined,
                        }}
                    >
                        <ScrollArea className="h-full">
                            <div className="p-4 md:p-5">
                                {!selectedDate ? (
                                    <div className="flex min-h-[200px] items-center justify-center text-center text-sm text-muted-foreground px-4">
                                        Selecciona un día en el calendario para ver los horarios disponibles.
                                    </div>
                                ) : slots.length === 0 ? (
                                    <div className="flex min-h-[200px] items-center justify-center text-center text-sm text-muted-foreground px-4">
                                        No hay horarios disponibles para el {format(selectedDate, "d 'de' MMMM", { locale: es })}.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {slots.map((slot, index) => {
                                            const isSelected = selectedTime === slot.time;
                                            if (!slot.available) return null;

                                            return (
                                                <Button
                                                    key={`${selectedDate.toISOString()}-${slot.time}-${index}`}
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-center transition-all duration-200 h-12 text-sm font-medium rounded-lg",
                                                        isSelected
                                                            ? "bg-primary text-primary-foreground shadow-md border-primary hover:bg-primary hover:text-primary-foreground"
                                                            : "bg-card text-foreground hover:bg-muted hover:border-border border-border/80",
                                                    )}
                                                    onClick={() => handleTimeSelect(slot.time, selectedDate)}
                                                >
                                                    <span className="tabular-nums">{slot.time}</span>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingCalendar;
