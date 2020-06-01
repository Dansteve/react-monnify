declare type Currency = 'NGN' | 'GHS' | 'USD';
declare type PaymentChannels = 'bank' | 'card' | 'qr' | 'ussd' | 'mobile_money';
declare type Bearer = 'account' | 'subaccount';
export interface GladepayProps {
    /**
     * development status
     */
    is_production?: true | false;
    /**
     * Merchant ID
     */
    MID?: string;
    /**
     * Amount to charge the customer
     */
    amount: number;
    /**
     * Transaction currency
     * Default `NGN`
     */
    currency?: Currency | string;
    /**
     * Default `NG`
     */
    country?: string;
    /**
     * The customer's email address
     */
    email: string;
    /**
     * The customer's First name
     */
    firstname?: string;
    /**
     * The customer's Last name
     */
    lastname?: string;
    /**
     * Text to be displayed as the title of the payment modal.
     */
    title?: string;
    /**
     * Text to be displayed as a short modal description.
     */
    description?: string;
    /**
     *
     * When you need to pass extra data to the API.
     *
     */
    metadata?: string;
    /**
     * You can select which payment method you want available on the checkout,
     * pass array of the payment methods you want available
     * e.g ['card', 'bank', 'ussd', 'qr', 'mobilemoney']
     */
    payment_method?: PaymentChannels | string[] | string;
    /**
     * You can use this option to determide who pay for the charges
     * on the transaction default is set to the merchants account.
     * customer or account
     */
    bearer?: Bearer | string;
    /**
     * Link to the Logo image.
     */
    logo?: string;
    /**
     * Optional Paramter
     *  The Inline Checkout can also be configured for advance requirements like Recurring payment, Split payment and Installment
     */
    /**
     * Recurring Payment
     * Recurring payment can be configured directly into the payment system that will be carried out automatically by the our
     * system and send the results back to your Webhook as payment notification.
     * To use the recurring feature within the inline checkout simply add these configuration options
     * to the embeded inline checkout configurations.
     *
     * N.B: Recurring feature works only with card payments.
     */
    recurrent?: GladepayRecurrentOptions;
    /**
     * Installment Payment
     * Installment payment allows you to collect payment in bit's to reach accumulate to a final amount.
     */
    installment?: GladepayInstallmentOptions;
    /**
     *
     * Split Payment
     * With split payments you can decide how you want the settlements to be handled when you provide a service to a third party.
     * Before you can split payment you have generate a reference code on the dashboard that will be used to divide the payment
     * into the account that was specified at the point of generating the code.
     *
     */
    split?: GladepaySplitOptions[];
    /**
     *
     * Redirect URL
     *
     */
    redirect_post?: string;
    'data-custom-button'?: string;
}
export interface GladepayRecurrentOptions {
    /**
     * The frequency at which the recurring
     * payment should occurs options available are
     * daily or weekly or monthly
     */
    frequency: 'daily' | 'weekly' | 'monthly' | string;
    /**
     * The value will determide when the charge should occur based on the frequency that has been set.
     * Daily (Hours): 0 - 23
     * Weekly (Day): 1 - 7
     * Monthly (Day): 1 - 30
     */
    value: string;
}
export interface GladepayInstallmentOptions {
    /**
     *
     * This option will be used to determide how the system will handle
     * This option should be used for initial transaction.
     *
     * Dependant
     * eg { `31-11-2017` : 20,`31-12-2017` : 30,`30-01-2017` : 50 }
     *
     */
    payment_schedule?: {};
    /**
     *
     * The total amount to be collect over a period of time.
     * This option should be used for initial transaction.
     *
     */
    total?: string;
    /**
     *
     * The reference of the initial transaction that you
     * want the user or customer to complete to the total amount.
     *
     */
    txnRef?: string;
}
export interface GladepaySplitOptions {
    /**
     *
     * Reference code that was generated at the point of setting up the split payment accounts.
     *
     */
    ref_code: string;
    /**
     *
     * The percentage of the transaction to be settled in the account.
     *
     */
    percentage: string;
    /**
     *
     * A fixed amount of the transaction to be settled in the account.
     *
     */
    fixed: string;
}
export {};
