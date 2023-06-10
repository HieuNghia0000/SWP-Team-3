package com.team3.ministore.service.impl;

import com.team3.ministore.model.Location;
import com.team3.ministore.repository.LocationRepository;
import com.team3.ministore.service.LocationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;

    public LocationServiceImpl(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Override
    public List<Location> getAllLocation() {
        return locationRepository.findAll();
    }

    @Override
    public Location createLocation(Location location) {
        return locationRepository.save(location);
    }

    @Override
    public Location getLocationById(Integer id) {
        return locationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid location ID: " + id));
    }

    @Override
    public Location updateLocation(Integer id, Location location) {
        Location existingLocation = getLocationById(id);

        existingLocation.setComputerId(location.getComputerId());

        return locationRepository.save(existingLocation);
    }

    @Override
    public void deleteLocation(Integer id) {
        locationRepository.deleteById(id);
    }
}
