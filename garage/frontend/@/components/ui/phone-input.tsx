import React, { useState } from "react";
import InputMask from "react-input-mask";

interface PhoneInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const PhoneInput = ({ onChange, className }: PhoneInputProps) => {
  const [phone, setPhone] = useState("");

  return (
    <InputMask
      className={` w-full h-12 p-4 px-3 py-2 mt-1 mb-4 text-lg bg-white border rounded-md md:mt-2 border-slate-200 ring-offset-white
      file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      mask="+7 (999) 999-99-99"
      value={phone}
      onChange={(e) => {
        setPhone(e.target.value);
        onChange(e);
      }}
      type="tel"
      placeholder="+7 (999) 123-45-67"
    />
  );
};

export default PhoneInput;
