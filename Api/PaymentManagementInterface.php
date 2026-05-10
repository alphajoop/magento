<?php

namespace Lomi\Payments\Api;

/**
 * @api
 */
interface PaymentManagementInterface
{
    /**
     * @param string $checkoutSessionId Lomi checkout session UUID
     * @return string JSON
     */
    public function verifyPayment($checkoutSessionId);
}
