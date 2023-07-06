package com.team3.ministore.controller;

import com.team3.ministore.common.responsehandler.ResponseHandler;
import com.team3.ministore.dto.CreateShiftTemplateDto;
import com.team3.ministore.model.ShiftTemplate;
import com.team3.ministore.service.ShiftTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/shift-templates")
public class ShiftTemplateController {
    
    @Autowired
    private ShiftTemplateService shiftTemplateService;

    @GetMapping("")
    public ResponseEntity<List<ShiftTemplate>> getAllShiftTemplates() {
        List<ShiftTemplate> shiftTemplateList = shiftTemplateService.getAllShiftTemplates();
        return new ResponseEntity<>(shiftTemplateList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Object> createShiftTemplates(@Valid @RequestBody CreateShiftTemplateDto dto, BindingResult errors) {
        if (errors.hasErrors()) return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);

        ShiftTemplate createdShiftTemplate = shiftTemplateService.createShiftTemplate(dto);
        return ResponseHandler.getResponse(createdShiftTemplate, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ShiftTemplate> updateShiftTemplates(@PathVariable("id") Integer id, @RequestBody ShiftTemplate shiftTemplate) {
        ShiftTemplate updatedShiftTemplate = shiftTemplateService.updateShiftTemplates(id, shiftTemplate);
        return new ResponseEntity<>(updatedShiftTemplate, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteShiftTemplates(@PathVariable("id") Integer id) {
        shiftTemplateService.deleteShiftTemplates(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
