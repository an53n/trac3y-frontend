import React from "react";

const DeliverySummary = ({ delivery: [receipt_temp, max_temp, receipt_acc, max_acc, reward_amount, penalty_amount, fee_amount] }) => {

    return (<>
        <div className="header">
            ✅ Deliver Summary
        </div>

        <div className="bio">
            The Package has been received by the recipient.
        </div>
        <br />

        <div className="delivery-summary">
            <div className="delivery-summary__header">
                <h2>Requirements</h2>
            </div>
            <div className="delivery-summary__body">
                <p>❌ Temperature: {receipt_temp.toNumber()}°F / {max_temp.toNumber()}°F</p>
                <p>✅ Acceleration: {receipt_acc.toNumber()}g / {max_acc.toNumber()}g</p>
            </div>

            <div className="delivery-summary__header">
                <h2>Payments</h2>
            </div>
            <div className="delivery-summary-body-item">
                <p>Reward (→ shipper): ${reward_amount.toNumber()}</p>
                <p>Penalty (→ sender): ${penalty_amount.toNumber()}</p>
                <p>Fee (→ TRAC3Y): ${fee_amount.toNumber()}</p>
            </div>
        </div>
    </>
    )
}

export default DeliverySummary;