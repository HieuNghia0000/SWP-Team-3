package com.team3.ministore.model;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Table(name = "check_in_locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private int locationId;

    @OneToMany(mappedBy = "location")
    private List<WorkSchedules> workSchedules;

    @Column(name = "name")
    private String name;

    @Column(name = "value")
    private String value;

    @Column(name = "location_type")
    private int locationType;

}
