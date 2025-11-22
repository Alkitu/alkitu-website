"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type DropdownType = 'language' | 'theme' | null;

interface DropdownContextType {
  activeDropdown: DropdownType;
  openDropdown: (dropdown: DropdownType) => void;
  closeDropdown: () => void;
  toggleDropdown: (dropdown: DropdownType) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export function DropdownProvider({ children }: { children: ReactNode }) {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);

  const openDropdown = (dropdown: DropdownType) => {
    setActiveDropdown(dropdown);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown: DropdownType) => {
    setActiveDropdown(prev => prev === dropdown ? null : dropdown);
  };

  return (
    <DropdownContext.Provider value={{ activeDropdown, openDropdown, closeDropdown, toggleDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
}

export function useDropdown() {
  const context = useContext(DropdownContext);
  if (context === undefined) {
    throw new Error('useDropdown must be used within a DropdownProvider');
  }
  return context;
}
