package com.team3.ministore.service;

import com.team3.ministore.model.Location;

import java.util.List;

public interface LocationService {
    List<Location> getAllLocation();

    Location createLocation(Location location);

    Location getLocationById(Integer id);

    Location updateLocation(Integer id, Location location);

    void deleteLocation(Integer id);
}
