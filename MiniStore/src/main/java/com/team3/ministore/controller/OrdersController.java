package com.team3.ministore.controller;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import com.team3.ministore.dto.PaymentItems;
import com.team3.ministore.model.Orders;
import com.team3.ministore.service.OrdersService;
import com.team3.ministore.service.PaypalService;
import com.team3.ministore.utils.PaypalPaymentIntent;
import com.team3.ministore.utils.PaypalPaymentMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
public class OrdersController {

    @Autowired
    private OrdersService ordersService;

    @Autowired
    private PaypalService paypalService;

    @PostMapping("/add")
    public ResponseEntity<Orders> createOrders(@RequestBody Orders orders) {
        Orders createdOrders = ordersService.createOrders(orders);
        return new ResponseEntity<>(createdOrders, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orders> getOrdersById(@PathVariable("id") Integer id) {
        Orders orders = ordersService.getOrdersById(id);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Orders> updateOrders(@PathVariable("id") Integer id, @RequestBody Orders orders) {
        Orders updatedOrders = ordersService.updateOrders(id, orders);
        return new ResponseEntity<>(updatedOrders, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrders(@PathVariable("id") Integer id) {
        ordersService.deleteOrders(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("")
    public ResponseEntity<Page<Orders>> getOrders(@RequestParam("ago") Optional<String> agoParam,
                                                  @RequestParam("from") Optional<String> fromDateParam,
                                                  @RequestParam("to") Optional<String> toDateParam,
                                                  @RequestParam("amount_from") Optional<Integer> fromAmountParam,
                                                  @RequestParam("amount_to") Optional<Integer> toAmountParam,
                                                  @RequestParam("curPage") Optional<Integer> curPageParam) {
        List<Orders> ordersList;
        Page<Orders> ordersPage;

        if (agoParam.isPresent()) {
            String ago = agoParam.get();
            ordersList = ordersService.getOrdersFromTimeAgo(ago);
        } else if (fromDateParam.isPresent() && toDateParam.isPresent()) {
            LocalDateTime fromDateTime = parseDateTime(fromDateParam.get());
            LocalDateTime toDateTime = parseDateTime(toDateParam.get()).plusDays(1).minusSeconds(1);

            ordersList = ordersService.getOrdersBetweenDate(fromDateTime, toDateTime);

        } else if (fromAmountParam.isPresent() && toAmountParam.isPresent()) {
            int fromAmount = fromAmountParam.get();
            int toAmount = toAmountParam.get();

            ordersList = ordersService.getOrdersBetweenAmount(fromAmount, toAmount);
        } else {
            ordersList = ordersService.getAllOrders();
        }

        if (fromAmountParam.isPresent() && toAmountParam.isPresent()) {
            int fromAmount = fromAmountParam.get();
            int toAmount = toAmountParam.get();

            ordersList = filterOrdersByAmount(ordersList, fromAmount, toAmount);
        }

        if (curPageParam.isPresent()) {
            int curPage = curPageParam.get();
            int perPage = 10;

            ordersPage = ordersService.findAllPagingOrders(curPage, perPage);
            if (ordersPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }
        else {
            int curPage = 1;
            int perPage = 10;

            ordersPage = ordersService.findAllPagingOrders(curPage, perPage);
            if (ordersPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }

        if (ordersList != null) {
            List<Orders> filteredOrders = ordersPage.stream().filter(ordersList::contains).collect(Collectors.toList());

            ordersPage = new PageImpl<>(filteredOrders, ordersPage.getPageable(), filteredOrders.size());
        }

        return new ResponseEntity<>(ordersPage, HttpStatus.OK);
    }

    @PostMapping("/payment")
    public ResponseEntity<?> paymentOrders(@RequestBody List<PaymentItems> paymentItems) {

        try {
            Payment payment = paypalService.createPayment(paymentItems, "USD", PaypalPaymentMethod.paypal, PaypalPaymentIntent.sale, "description payment", "/cancel", "/success");

            String approvalUrl = null;
            for (Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {
                    approvalUrl = link.getHref();
                    break;
                }
            }

            if (approvalUrl != null) {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header("Location", approvalUrl)
                        .build();
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to retrieve PayPal approval URL");
            }
        } catch (PayPalRESTException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/success")
    public ResponseEntity<?> successPay(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                HttpHeaders headers = new HttpHeaders();
                headers.add("Location", "/orders/success");
                return new ResponseEntity<>(headers, HttpStatus.FOUND);
            }
        } catch (PayPalRESTException e) {
            throw new RuntimeException(e);
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    private LocalDateTime parseDateTime(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date = LocalDate.parse(dateString, formatter);

        return date.atStartOfDay();
    }

    private List<Orders> filterOrdersByAmount(List<Orders> ordersList, int fromAmount, int toAmount) {
        List<Orders> filteredOrders = new ArrayList<>();

        for (Orders orders : ordersList) {
            int orderAmount = orders.getGrandTotal();

            if (orderAmount >= fromAmount && orderAmount <= toAmount) {
                filteredOrders.add(orders);
            }
        }

        return filteredOrders;
    }
}
