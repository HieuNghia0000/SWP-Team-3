package com.team3.ministore.model;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Table(name = "locations")
public class Location {

    @Id
    @Column(name = "location_id", length = 100)
    private int locationId;

    @Column(name = "description", length = 100)
    private String description;
}
