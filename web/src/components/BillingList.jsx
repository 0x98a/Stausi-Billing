import React from 'react';
import { BillingChild } from './BillingChild';

export const BillingList = ({ billings, onButtonClick }) => (
    <div className="player-billings">
        {billings.map((billing) => (
            <BillingChild 
                key={billing.id} 
                billing={billing} 
                onButtonClick={onButtonClick} 
            />
        ))}
    </div>
);