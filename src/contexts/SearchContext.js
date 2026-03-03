import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [departure, setDeparture] = useState("");
    const [destination, setDestination] = useState("");
    const [trainNumber, setTrainNumber] = useState("");
    const [activeTab, setActiveTab] = useState("oneway");

    return (
        <SearchContext.Provider value={{
            departure, setDeparture,
            destination, setDestination,
            trainNumber, setTrainNumber,
            activeTab, setActiveTab
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
