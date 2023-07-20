package com.team3.ministore.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.team3.ministore.config.VnPayConfig;
import com.team3.ministore.dto.PaymentItems;
import com.team3.ministore.model.Orders;
import com.team3.ministore.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
public class OrdersController {

    @Autowired
    private OrdersService ordersService;

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
    public ResponseEntity<String> createPayment(HttpServletRequest request, @RequestBody PaymentItems paymentItems) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";

        long vnpAmount = paymentItems.getGrandTotal() * 100;
        String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
        String vnp_IpAddr = VnPayConfig.getIpAddress(request);
        String vnp_TmnCode = VnPayConfig.vnp_TmnCode;
        String bankCode = "";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(vnpAmount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", paymentItems.getOrderType());
        vnp_Params.put("vnp_Locale", "vn");

        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_Returnurl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 10);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                // Build hash data
                hashData.append(fieldName).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString())).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;

        com.google.gson.JsonObject job = new JsonObject();
        job.addProperty("code", "00");
        job.addProperty("message", "success");
        job.addProperty("data", paymentUrl);
        Gson gson = new Gson();
        return new ResponseEntity<>(gson.toJson(job), HttpStatus.OK);
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
