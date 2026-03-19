"use client"

import React, { createContext, useContext, useState } from 'react';

type SnowContextType = {
    showSnow: boolean;
    toggleSnow: () => void;
};

const SnowContext = createContext<SnowContextType | undefined>(undefined);

export function SnowProvider({ children }: { children: React.ReactNode }) {
    const [showSnow, setShowSnow] = useState(false);

    const toggleSnow = () => setShowSnow(prev => !prev);

    return (
        <SnowContext.Provider value={{ showSnow, toggleSnow }}>
            {children}
        </SnowContext.Provider>
    );
}

export const useSnow = () => {
    const context = useContext(SnowContext);
    if (context === undefined) {
        throw new Error('useSnow must be used within a SnowProvider');
    }
    return context;
};
