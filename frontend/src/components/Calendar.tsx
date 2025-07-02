import React from "react";

interface CalendarProps {
    onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const currentDay = today.getDate();

    const [selectedDay, setSelectedDay] = React.useState<number | null>(null);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleClick = (day: number) => {
        if (day < currentDay) return;
        setSelectedDay(day);
        const selectedDate = new Date(year, month, day);
        onDateSelect(selectedDate);
    };


    return (
        <div className="calendar-grid">
            {daysArray.map((day) => {
                const isPast = day < currentDay;
                return (
                    <div
                        key={day}
                        onClick={() => !isPast && handleClick(day)}
                        className={`calendar-day 
                            ${isPast ? "day-disabled" : "day-active"} 
                            ${selectedDay === day && !isPast ? "day-selected" : ""}
                        `}
                    >
                        {day}
                    </div>
                );
            })}
        </div>
    );
};

export default Calendar;
