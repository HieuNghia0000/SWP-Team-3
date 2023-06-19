package com.team3.ministore.service;

import com.team3.ministore.model.Location;

import java.util.List;

public interface LocationService {
    List<Location> getAllLocation();

    Location createLocation(Location location);

    Location getLocationById(String id);

    Location updateLocation(String id, Location location);

    void deleteLocation(String id);
}
