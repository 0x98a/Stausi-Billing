import React, { useEffect, useRef, useState } from 'react';
import './CheckmarkButton.css';
import { BillingList } from './components/BillingList';

import "./App.css";
const devMode = !window.invokeNative;

const App = () => {
    //Smider alle const sammen her, eller samme dem som har noget med react at gøre, fx useRef og useState som er fra react.
    const [isDarkMode, setDarkMode] = useState(true);
    const [billings, setBillings] = useState([]);
    const appDiv = useRef(null);
    
    const { fetchNui, getSettings, onSettingsChange } = window;

    //Map billings i selve setBillings funktionen så vi har ikk brug for den anden ligegyldige funktion, bare mere clean
    const handleButtonClick = async (id) => {
        setBillings(billings.map(billing => 
            billing.id === id ? { ...billing, isAnimating: true } : billing
        ));

        await fetchNui("payBill", { id });
    };

    const handleIncomingMessages = (event) => {
        if (event.data.action === "refreshBillings") {
            setBillings(event.data.billings);
        }
    };

    useEffect(() => {
        if (devMode) {
            document.documentElement.style.visibility = "visible";
            document.body.style.visibility = "visible";
            return;
        }

        const setupSettings = async () => {
            if (!devMode) {
                const settings = await getSettings();

                setDarkMode(settings.display.theme === "dark");
                onSettingsChange(newSettings => setDarkMode(newSettings.display.theme === "dark"));
            }
        };

        const setupBillings = async () => {
            if (!devMode) {
                const newBillings = await fetchNui("setupApp", {});

                setBillings(newBillings);
            }
        };

        setupSettings();
        setupBillings();

        window.addEventListener("message", handleIncomingMessages);

        //Unmount her, så derfor fjerner vi vores event listeners og setbillings cleaner vi så den er klar til brug igen når den mountes for at undgå react fejl.
        return () => {
            window.removeEventListener("message", handleIncomingMessages);
            setBillings([]);
        };
    }, [fetchNui, getSettings, onSettingsChange]);

    return (
        <AppProvider>
            <div className={`app ${isDarkMode ? "dark" : "light"}`} ref={appDiv}>
                <div className={`app-content`}>
                    <h1 className="headline">Faktura/Bøder</h1>
                    <div className={`player-billings`}>
                        {/* Ændret fra === til være 0, hvis nogle bugger den og den på en mystisk måde bliver -1, så ville den ik prøve at render */}
                        {billings.length <= 0 ? (
                            <p className="no-bills">Du har ingen fakturaer/bøder at betale</p>
                        ) : (
                            <BillingList billings={billings} onButtonClick={handleButtonClick} />
                        )}
                    </div>
                </div>
            </div>
        </AppProvider>
    );
};

const AppProvider = ({ children }) => (
    devMode ? <div className='dev-wrapper'>{children}</div> : children
);

export default App;
