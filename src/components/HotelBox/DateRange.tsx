import React from "react";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch } from "@/Redux/store";
import { setDateRangeDetails } from "@/Redux/slices/hotelcard.slice";

// Type for date range values
type DateRange = [Dayjs | null, Dayjs | null] | null;

const { RangePicker } = DatePicker;

type Props = {
  dates: string[] | undefined;
  setDates: React.Dispatch<React.SetStateAction<string[] | undefined>>;
};

const DateRange: React.FC<Props> = ({ dates, setDates }) => {
  const dispatch = useDispatch();

  // Disable dates before today
  const disabledDate = (current: Dayjs) => {
    return current && current.isBefore(dayjs().startOf("day"));
  };

  // Handle date change
  const handleDateChange = (values: DateRange) => {
    if (values && values[0] && values[1]) {
      const formattedDates = values.map(date => date?.format("YYYY-MM-DD") || "");
      setDates(formattedDates as string[]);
      dispatch(setDateRangeDetails({ dates: formattedDates as string[] }));
    } else {
      setDates(undefined);
      dispatch(setDateRangeDetails({ dates: [] }));
    }
  };

  // Convert string dates to Dayjs objects if they exist
  const dayjsDates: DateRange = dates && dates.length === 2
    ? [dayjs(dates[0]), dayjs(dates[1])]
    : null;

  return (
    <div className="date-range-picker">
      <RangePicker
        value={dayjsDates}
        onChange={handleDateChange}
        disabledDate={disabledDate}
        format="YYYY-MM-DD"
        picker="date"
        separator=" - "
        allowClear={false}
        placeholder={["Check-in Date", "Check-out Date"]}
        suffixIcon={<></>}
        style={{ border: "none", animation: "fade-in 0.3s ease-in-out" }} // Cool animation
        className="custom-date-picker"
      />
      <style jsx>{`
        .custom-date-picker {
          animation: fade-in 0.3s ease-in-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .ant-picker-dropdown {
          animation: slide-down 0.3s ease-in-out;
        }

        @keyframes slide-down {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default DateRange;
