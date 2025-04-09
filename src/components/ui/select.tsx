"use client";
import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  className,
  disabled = false
}: SelectProps) {
  const selectedOption = options.find(option => option.value === value);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button
          className={cn(
            "relative w-full cursor-default rounded-lg border border-stroke bg-white py-2 pl-4 pr-10 text-left focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-dark-3 dark:bg-boxdark sm:text-sm",
            className
          )}
        >
          <span className={cn(
            "block truncate",
            !selectedOption && "text-gray-500"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FontAwesomeIcon
              icon={faChevronDown}
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-boxdark dark:ring-dark-3 sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active }) =>
                  cn(
                    "relative cursor-default select-none py-2 pl-10 pr-4",
                    active 
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-gray-900 dark:text-gray-300"
                  )
                }
                value={option.value}
              >
                {({ selected, active }) => (
                  <>
                    <span className={cn(
                      "block truncate",
                      selected ? "font-medium" : "font-normal"
                    )}>
                      {option.label}
                    </span>
                    {selected ? (
                      <span className={cn(
                        "absolute inset-y-0 left-0 flex items-center pl-3",
                        active ? "text-primary" : "text-primary"
                      )}>
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}