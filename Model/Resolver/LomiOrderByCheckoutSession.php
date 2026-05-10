<?php

namespace Lomi\Payments\Model\Resolver;

use Magento\Sales\Model\OrderFactory;
use Magento\Sales\Model\ResourceModel\Order\Payment\CollectionFactory as OrderPaymentCollectionFactory;
use Lomi\Payments\Model\Payment\Lomi as LomiMethod;

/**
 * Finds a Magento order increment ID by stored Lomi checkout_session_id on payment additional_information.
 */
class LomiOrderByCheckoutSession
{
    /** @var OrderPaymentCollectionFactory */
    private $paymentCollectionFactory;

    /** @var OrderFactory */
    private $orderFactory;

    public function __construct(
        OrderPaymentCollectionFactory $paymentCollectionFactory,
        OrderFactory $orderFactory
    ) {
        $this->paymentCollectionFactory = $paymentCollectionFactory;
        $this->orderFactory = $orderFactory;
    }

    /**
     * Resolve increment_id for an order whose Lomi payment stores this checkout session id.
     */
    public function findIncrementIdByCheckoutSessionId(string $checkoutSessionId): ?string
    {
        $checkoutSessionId = trim($checkoutSessionId);
        if ($checkoutSessionId === '') {
            return null;
        }

        $collection = $this->paymentCollectionFactory->create();
        $collection->addFieldToFilter('method', ['eq' => LomiMethod::CODE]);
        // Narrow candidates; confirm via deserialized additional_information (avoids false positives).
        $likeSafe = str_replace(['%', '_', '\\'], ['\\%', '\\_', '\\\\'], $checkoutSessionId);
        $collection->addFieldToFilter(
            'additional_information',
            ['like' => '%' . $likeSafe . '%']
        );
        $collection->setOrder('entity_id', 'DESC');
        $collection->setPageSize(100);

        foreach ($collection as $payment) {
            $stored = $payment->getAdditionalInformation('lomi_checkout_session_id');
            if ($stored !== null && (string) $stored === $checkoutSessionId) {
                $order = $this->orderFactory->create()->load((int) $payment->getParentId());
                $incrementId = $order->getIncrementId();

                return $incrementId ? (string) $incrementId : null;
            }
        }

        return null;
    }
}
