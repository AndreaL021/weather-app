import { createContext, type ReactNode, useContext, useState } from 'react';



type Units = { 
    temperature: 'celsius' | 'fahrenheit'; 
    wind: 'kmh' | 'mph'; 
    precipitation: 'mm' | 'in' 
};
const metric: Units = { 
    temperature: 'celsius', 
    wind: 'kmh', 
    precipitation: 'mm' 
};
const imperial: Units = { 
    temperature: 'fahrenheit', 
    wind: 'mph', 
    precipitation: 'in' 
};
type UnitsContextValue = {
    units: Units;
    system: 'metric' | 'imperial' | 'custom';
    setSystem: (system: 'metric' | 'imperial') => void;
    setUnit: <K extends keyof Units>(key: K, value: Units[K]) => void;
    temperature: (celsius: number, withUnit?: boolean) => string;
    wind: (kmh: number) => string;
    precipitation: (mm: number) => string;
};



const UnitsContext = createContext<UnitsContextValue | null>(null);

export default function UnitsProvider({ children }: { children: ReactNode }) {

    const [units, setUnits] = useState<Units>(metric);

    const system = units.temperature === 'celsius' && units.wind === 'kmh' && units.precipitation === 'mm'
        ? 'metric' : units.temperature === 'fahrenheit' && units.wind === 'mph' && units.precipitation === 'in' ? 'imperial' : 'custom';

    const setUnit = <K extends keyof Units,>(key: K, value: Units[K]) => setUnits(current => ({ ...current, [key]: value }));

    return (

        // Dati condivisi
        <UnitsContext.Provider value={{
            units, system, setUnit,
            setSystem: next => setUnits(next === 'metric' ? metric : imperial),
            temperature: (celsius, withUnit = false) => `${Math.round(units.temperature === 'celsius' ? celsius : celsius * 9 / 5 + 32)}°${withUnit ? units.temperature === 'celsius' ? 'C' : 'F' : ''}`,
            wind: kmh => `${Math.round(units.wind === 'kmh' ? kmh : kmh / 1.609344)} ${units.wind === 'kmh' ? 'km/h' : 'mph'}`,
            precipitation: mm => `${Number((units.precipitation === 'mm' ? mm : mm / 25.4).toFixed(units.precipitation === 'mm' ? 1 : 2))} ${units.precipitation}`,

        }}>
            {children}
        </UnitsContext.Provider>
    );
}

// Ogni file importa questo hook per leggere il contesto
export function useUnits() {
    const context = useContext(UnitsContext);
    if (!context) throw new Error('useUnits deve essere dentro UnitsProvider.');
    return context;
}
