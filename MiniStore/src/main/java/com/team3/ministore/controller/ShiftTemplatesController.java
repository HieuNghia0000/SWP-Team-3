package com.team3.ministore.controller;

import com.team3.ministore.model.ShiftTemplates;
import com.team3.ministore.service.ShiftTemplatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shift-templates")
public class ShiftTemplatesController {
    
    @Autowired
    private ShiftTemplatesService shiftTemplatesService;

    @GetMapping("")
    public ResponseEntity<List<ShiftTemplates>> getAllShiftTemplates() {
        List<ShiftTemplates> shiftTemplatesList = shiftTemplatesService.getAllShiftTemplates();
        return new ResponseEntity<>(shiftTemplatesList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<ShiftTemplates> createShiftTemplates(@RequestBody ShiftTemplates shiftTemplates) {
        ShiftTemplates createdShiftTemplates = shiftTemplatesService.createShiftTemplates(shiftTemplates);
        return new ResponseEntity<>(createdShiftTemplates, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ShiftTemplates> updateShiftTemplates(@PathVariable("id") Integer id, @RequestBody ShiftTemplates shiftTemplates) {
        ShiftTemplates updatedShiftTemplates = shiftTemplatesService.updateShiftTemplates(id, shiftTemplates);
        return new ResponseEntity<>(updatedShiftTemplates, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteShiftTemplates(@PathVariable("id") Integer id) {
        shiftTemplatesService.deleteShiftTemplates(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
