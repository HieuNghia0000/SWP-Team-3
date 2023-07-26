package com.team3.ministore.controller;

import com.team3.ministore.common.responsehandler.ResponseHandler;
import com.team3.ministore.config.VnPayConfig;
import com.team3.ministore.dto.OrderDto;
import com.team3.ministore.dto.PaymentDto;
import com.team3.ministore.model.Order;
import com.team3.ministore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
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
    private OrderService orderService;

    @PostMapping("/add")
    public ResponseEntity<Object> createOrders(@Valid @RequestBody OrderDto dto, BindingResult errors) {
        if (errors.hasErrors()) return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);

        try {
            Order createdOrder = orderService.createOrders(dto);
            return ResponseHandler.getResponse(new OrderDto(createdOrder), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseHandler.getResponse(e, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return ResponseHandler.getResponse(e, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getOrdersById(@PathVariable("id") Integer id) {
        Optional<Order> order = orderService.getOrdersById(id);

        return order.map(value -> ResponseHandler.getResponse(new OrderDto(value), HttpStatus.OK))
                .orElseGet(() -> ResponseHandler.getResponse(new Exception("Order not found."), HttpStatus.NOT_FOUND));

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateOrders(@PathVariable("id") Integer id, @RequestBody Order order) {
        Optional<Order> updatedOrder = orderService.updateOrders(id, order);
        return updatedOrder.map(value -> ResponseHandler.getResponse(new OrderDto(value), HttpStatus.OK))
                .orElseGet(() -> ResponseHandler.getResponse(new Exception("Order not found"), HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteOrders(@PathVariable("id") Integer id) {
        orderService.deleteOrders(id);
        return ResponseHandler.getResponse(HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<Page<Order>> getOrders(@RequestParam("ago") Optional<String> agoParam,
                                                 @RequestParam("from") Optional<String> fromDateParam,
                                                 @RequestParam("to") Optional<String> toDateParam,
                                                 @RequestParam("amount_from") Optional<Integer> fromAmountParam,
                                                 @RequestParam("amount_to") Optional<Integer> toAmountParam,
                                                 @RequestParam("curPage") Optional<Integer> curPageParam) {
        List<Order> orderList;
        Page<Order> ordersPage;

        if (agoParam.isPresent()) {
            String ago = agoParam.get();
            orderList = orderService.getOrdersFromTimeAgo(ago);
        } else if (fromDateParam.isPresent() && toDateParam.isPresent()) {
            LocalDateTime fromDateTime = parseDateTime(fromDateParam.get());
            LocalDateTime toDateTime = parseDateTime(toDateParam.get()).plusDays(1).minusSeconds(1);

            orderList = orderService.getOrdersBetweenDate(fromDateTime, toDateTime);

        } else if (fromAmountParam.isPresent() && toAmountParam.isPresent()) {
            int fromAmount = fromAmountParam.get();
            int toAmount = toAmountParam.get();

            orderList = orderService.getOrdersBetweenAmount(fromAmount, toAmount);
        } else {
            orderList = orderService.getAllOrders();
        }

        if (fromAmountParam.isPresent() && toAmountParam.isPresent()) {
            int fromAmount = fromAmountParam.get();
            int toAmount = toAmountParam.get();

            orderList = filterOrdersByAmount(orderList, fromAmount, toAmount);
        }

        if (curPageParam.isPresent()) {
            int curPage = curPageParam.get();
            int perPage = 10;

            ordersPage = orderService.findAllPagingOrders(curPage, perPage);
            if (ordersPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        } else {
            int curPage = 1;
            int perPage = 10;

            ordersPage = orderService.findAllPagingOrders(curPage, perPage);
            if (ordersPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }

        if (orderList != null) {
            List<Order> filteredOrders = ordersPage.stream().filter(orderList::contains).collect(Collectors.toList());

            ordersPage = new PageImpl<>(filteredOrders, ordersPage.getPageable(), filteredOrders.size());
        }

        return new ResponseEntity<>(ordersPage, HttpStatus.OK);
    }

    @PostMapping("/payment")
    public ResponseEntity<Object> createPayment(HttpServletRequest request, @RequestBody PaymentDto paymentDto) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";

        long vnpAmount = paymentDto.getGrandTotal() * 100;
        String vnp_TxnRef = String.valueOf(paymentDto.getOrderId());
        String vnp_IpAddr = VnPayConfig.getIpAddress(request);
        String vnp_TmnCode = VnPayConfig.vnp_TmnCode;
        String bankCode = "NCB";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(vnpAmount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", bankCode);

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", paymentDto.getOrderType());
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

        Map<String, Object> job = new HashMap<>();
        job.put("code", "00");
        job.put("message", "success");
        job.put("paymentUrl", paymentUrl);
        return ResponseHandler.getResponse(job, HttpStatus.OK);
    }

    private LocalDateTime parseDateTime(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date = LocalDate.parse(dateString, formatter);

        return date.atStartOfDay();
    }

    private List<Order> filterOrdersByAmount(List<Order> orderList, int fromAmount, int toAmount) {
        List<Order> filteredOrders = new ArrayList<>();

        for (Order order : orderList) {
            long orderAmount = order.getGrandTotal();

            if (orderAmount >= fromAmount && orderAmount <= toAmount) {
                filteredOrders.add(order);
            }
        }

        return filteredOrders;
    }
}
