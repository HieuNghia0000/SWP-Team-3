package com.team3.ministore.controller;

import com.team3.ministore.model.Location;
import com.team3.ministore.service.LocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/location")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    //Create new location
    @PostMapping("/")
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        Location createLocation = locationService.createLocation(location);
        return new ResponseEntity<>(createLocation, HttpStatus.CREATED);
    }

    //Read all location
    @GetMapping("/")
    public ResponseEntity<List<Location>> getAllLocation(@RequestBody Location location) {
        List<Location> locationList = locationService.getAllLocation();
        return new ResponseEntity<>(locationList, HttpStatus.OK);
    }

    //Read a location by ID
    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable("id") Integer id) {
        Location location = locationService.getLocationById(id);
        return new ResponseEntity<>(location, HttpStatus.OK);
    }

    //Update an existing location
    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(@PathVariable("id") Integer id, @RequestBody Location location) {
        Location updatedLocation = locationService.updateLocation(id, location);
        return new ResponseEntity<>(updatedLocation, HttpStatus.OK);
    }

    //Delete a location
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable("id") Integer id) {
        locationService.deleteLocation(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
