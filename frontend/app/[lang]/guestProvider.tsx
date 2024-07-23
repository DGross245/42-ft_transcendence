
import React, { createContext, useState } from 'react';
import { ProvidersProps } from './providers';

interface GuestContextvalue {
	updateData: (guest: boolean) => void,
	isGuest: boolean
}

const guestContext = createContext({} as GuestContextvalue);

export function GuestProvider({ children }: ProvidersProps) {
  const [isGuest, setIsGuest] = useState(false);

  const updateData = (guest: boolean) => setIsGuest(guest);

  return (
    <guestContext.Provider value={{ isGuest, updateData }}>
      {children}
    </guestContext.Provider>
  );
}

export default guestContext;
