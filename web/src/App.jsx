import React, { useEffect, useRef, useState } from 'react';
import './CheckmarkButton.css';
import { BillingList } from './components/BillingList';

import "./App.css";
const devMode = !window.invokeNative;

const App = () => {
    const [isDarkMode, setDarkMode] = useState(true);
    const [billings, setBillings] = useState([]);

    const appDiv = useRef(null);
    const { fetchNui, getSettings, onSettingsChange } = window;

    async function handleButtonClick(id) {
        const updatedBillings = billings.map(billing => {
            if (billing.id === id) {
                return { ...billing, isAnimating: true };
            }
            return billing;
        });
        
        setBillings(updatedBillings);
        await fetchNui("payBill", { id: id });
    };

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
                <div className="app-content">
                    <h1 className="headline">Faktura/Bøder</h1>
                    <BillingList billings={billings} onButtonClick={handleButtonClick} />
                </div>
            </div>
        </AppProvider>
    );
};

const AppProvider = ({ children }) => (
    devMode ? <div className='dev-wrapper'>{children}</div> : children
);

export default App;
