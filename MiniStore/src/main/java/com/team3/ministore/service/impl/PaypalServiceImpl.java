package com.team3.ministore.service.impl;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import com.team3.ministore.dto.PaymentItems;
import com.team3.ministore.service.PaypalService;
import com.team3.ministore.utils.PaypalPaymentIntent;
import com.team3.ministore.utils.PaypalPaymentMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PaypalServiceImpl implements PaypalService {

    @Autowired
    private APIContext apiContext;

    @Override
    public Payment createPayment(List<PaymentItems> items, String currency, PaypalPaymentMethod method, PaypalPaymentIntent intent, String description, String cancelUrl, String successUrl) throws PayPalRESTException {
        List<Item> itemList = new ArrayList<>();

        for (PaymentItems paymentItems : items) {
            Item item = new Item();
            item.setName(paymentItems.getName());
            item.setPrice(String.format("%.2f", paymentItems.getPrice()));
            item.setCurrency(currency);
            item.setQuantity(String.valueOf(paymentItems.getQuantity()));
            itemList.add(item);
        }

        ItemList itemListObj = new ItemList();
        itemListObj.setItems(itemList);

        Double totalAmount = items.stream()
                .mapToDouble(paymentItem -> paymentItem.getPrice() * paymentItem.getQuantity())
                .sum();

        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(String.format("%.2f", totalAmount));

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);
        transaction.setItemList(itemListObj);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method.toString());

        Payment payment = new Payment();
        payment.setIntent(intent.toString());
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);

        apiContext.setMaskRequestId(true);

        return payment.create(apiContext);
    }

    @Override
    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
        Payment payment = new Payment();
        payment.setId(paymentId);
        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId);
        return payment.execute(apiContext, paymentExecution);
    }
}
