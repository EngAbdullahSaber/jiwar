import React, { useState, useEffect } from 'react';
// @ts-ignore
import moment from 'moment-hijri';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface HijriDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const HijriDatePicker: React.FC<HijriDatePickerProps> = ({
  value,
  onChange,
  placeholder,
  className
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    moment.locale(i18n.language === 'ar' ? 'ar-SA' : 'en');
  }, [i18n.language]);

  const [viewDate, setViewDate] = useState(value ? moment(value, 'iYYYY/iMM/iDD') : moment());
  
  // Format the display value
  const displayValue = value ? value : "";

  const iMonth = viewDate.iMonth();
  const iYear = viewDate.iYear();

  const daysInMonth = moment.iDaysInMonth(iYear, iMonth);
  const firstDayOfMonth = moment().iYear(iYear).iMonth(iMonth).iDate(1).day();

  const months = [
    "محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الآخرة",
    "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
  ];

  const weekDays = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

  const handlePrevMonth = () => {
    setViewDate((prev:any) => moment(prev).subtract(1, 'iMonth'));
  };

  const handleNextMonth = () => {
    setViewDate((prev:any) => moment(prev).add(1, 'iMonth'));
  };

  const handleSelectDay = (day: number) => {
    const selected = moment().iYear(iYear).iMonth(iMonth).iDate(day);
    const formatted = selected.format('iYYYY/iMM/iDD');
    onChange(formatted);
    setIsOpen(false);
  };

  const days = [];
  // Fill empty slots for the first week
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
  }
  // Fill days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = value === moment().iYear(iYear).iMonth(iMonth).iDate(d).format('iYYYY/iMM/iDD');
    days.push(
      <button
        key={d}
        type="button"
        onClick={() => handleSelectDay(d)}
        className={cn(
          "h-9 w-9 flex items-center justify-center rounded-md text-sm transition-colors",
          isSelected 
            ? "bg-[#4A1B1B] text-[#B39371] font-bold" 
            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        )}
      >
        {d}
      </button>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full h-12 px-4 flex items-center gap-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-[#4A1B1B]/20 outline-none transition-all text-start",
              !value && "text-gray-400"
            )}
          >
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className="flex-1">{displayValue || placeholder || "اختر تاريخ هجري"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-7 w-7">
                <ChevronRight className="h-4 h-4" />
              </Button>
              <div className="font-semibold text-sm">
                {months[iMonth]} {iYear}
              </div>
              <Button variant="outline" size="icon" onClick={handlePrevMonth} className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center">
              {weekDays.map(day => (
                <div key={day} className="text-[10px] font-medium text-gray-400 uppercase">
                  {day}
                </div>
              ))}
              {days}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default HijriDatePicker;
