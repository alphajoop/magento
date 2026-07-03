define(
    [
        'jquery',
        'mage/url',
        'Magento_Checkout/js/view/payment/default',
        'Magento_Checkout/js/action/place-order',
        'Magento_Checkout/js/model/payment/additional-validators',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/full-screen-loader',
        'Magento_Checkout/js/action/redirect-on-success'
    ],
    function (
        $,
        mageUrl,
        Component,
        placeOrderAction,
        additionalValidators,
        quote,
        fullScreenLoader,
        redirectOnSuccessAction
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'Lomi_Payments/payment/lomi'
            },
            redirectAfterPlaceOrder: false,

            isActive: function () {
                return true;
            },

            getLomiConfig: function () {
                var checkoutConfig = window.checkoutConfig || {};

                return checkoutConfig.payment && checkoutConfig.payment.lomi
                    ? checkoutConfig.payment.lomi
                    : {};
            },

            usesBrandingCard: function () {
                return !!this.getLomiConfig().uses_branding_card;
            },

            payWithImageUrl: function () {
                return this.getLomiConfig().pay_with_image_url || '';
            },

            paymentIconUrls: function () {
                return this.getLomiConfig().payment_icon_urls || [];
            },

            getPaymentIconClass: function (iconUrl) {
                var css = 'wc-lomi-checkout-branding__method';

                if (typeof iconUrl === 'string'
                    && (iconUrl.indexOf('apple-pay') !== -1 || iconUrl.indexOf('google-pay') !== -1)
                ) {
                    css += ' wc-lomi-checkout-branding__method--wide';
                }

                return css;
            },

            markRedirectPending: function () {
                var config = this.getLomiConfig();
                var storageKey = config.storage_key || 'lomi_checkout_redirect';

                try {
                    window.sessionStorage.setItem(
                        storageKey,
                        JSON.stringify({
                            startedAt: Date.now()
                        })
                    );
                } catch (error) {
                    // Ignore storage errors in private browsing.
                }
            },

            redirectToCustomAction: function (url) {
                this.markRedirectPending();
                fullScreenLoader.startLoader();
                window.location.replace(mageUrl.build(url));
            },

            /**
             * Hosted checkout: redirect to server route that creates lomi. session.
             */
            afterPlaceOrder: function () {
                var lomiConfiguration = this.getLomiConfig();

                this.redirectToCustomAction(lomiConfiguration.setup_url);
            }
        });
    }
);
