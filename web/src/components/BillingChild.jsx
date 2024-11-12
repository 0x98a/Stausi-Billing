import React from 'react';

export const BillingChild = ({ billing, onButtonClick }) => (
    <div className="billing-container">
        <div className="container-header">
            <h1>{billing.label}</h1>
            <h1>{billing.amount}</h1>
            <div 
                className={`checkmark-wrapper ${billing.isAnimating ? 'checkmarked' : ''}`} 
                onClick={() => onButtonClick(billing.id)}
            >
                <span className={`checkmark ${billing.isAnimating ? 'animate-checkmark' : ''}`}></span>
            </div>
        </div>
    </div>
);