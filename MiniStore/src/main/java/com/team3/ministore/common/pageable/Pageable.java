package com.team3.ministore.common.pageable;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

@Component
public class Pageable {

	public final  org.springframework.data.domain.Pageable firstPageWithFiveElements=PageRequest.of(1, 5);
}
