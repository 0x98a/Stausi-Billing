import React from 'react';
import { BillingChild } from './BillingChild';

export const BillingList = ({ billings, onButtonClick }) => (
    <div className="player-billings">
        {billings.length > 0 ? (
            billings.map((billing) => (
                <BillingChild 
                    key={billing.id} 
                    billing={billing} 
                    onButtonClick={onButtonClick} 
                />
            ))
        ) : (
            <h3 className="text-center-white">Ingen fakturaer eller bøder til at betale.</h3>
        )}
    </div>
);