package com.team3.ministore.service;

import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.team3.ministore.dto.PaymentItems;
import com.team3.ministore.utils.PaypalPaymentIntent;
import com.team3.ministore.utils.PaypalPaymentMethod;

import java.util.List;

public interface PaypalService {
    Payment createPayment(List<PaymentItems> items,
                          String currency,
                          PaypalPaymentMethod method,
                          PaypalPaymentIntent intent,
                          String description,
                          String cancelUrl,
                          String successUrl) throws PayPalRESTException;

    Payment executePayment(String paymentId, String payerId) throws PayPalRESTException;
}
