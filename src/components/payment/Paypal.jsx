import React, { useEffect, useRef } from 'react';

function Paypal({ totalAmount }) {
    const paypalRef = useRef();

    useEffect(() => {


        const paypalButton = window.paypal.Buttons({
            createOrder: (data, actions, err) => {
                return actions.order.create({
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            description: 'cool looking table',
                            amount: {
                                currency_code: 'CAD',
                                value: totalAmount,
                            },
                        },
                    ],
                });
            },
            onApprove: async (data, actions) => {
                const order = await actions.order.capture();
            },
            onError: (err) => {
                console.error(err);
            },
        });

        // Render the PayPal button
        paypalButton.render(paypalRef.current);

        return () => paypalButton.close();
    }, []);

    return (
        <div>
            <div ref={paypalRef}></div>
        </div>
    );
}

export default Paypal;
