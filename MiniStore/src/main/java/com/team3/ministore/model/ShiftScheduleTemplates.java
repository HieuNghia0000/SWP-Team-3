package com.team3.ministore.model;

import com.team3.ministore.dto.ShiftScheduleTemplatesId;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Data
@Table(name = "shiftscheduletemplates")
@IdClass(ShiftScheduleTemplatesId.class)
public class ShiftScheduleTemplates implements Serializable {

    @Id
    @Column(name = "shift_template_id")
    private Integer shiftTemplateId;

    @Id
    @Column(name = "schedule_template_id", nullable = false)
    private int scheduleTemplateId;

    @ManyToOne
    @JoinColumn(name = "shift_template_id", referencedColumnName = "shift_template_id", insertable = false, updatable = false)
    private ShiftTemplates shiftTemplates;

    @ManyToOne
    @JoinColumn(name = "schedule_template_id", referencedColumnName = "schedule_template_id", insertable = false, updatable = false)
    private ScheduleTemplates scheduleTemplates;

    @Column(name = "date")
    private Date date;

    @Column(name = "staff_name", length = 100)
    private String staffName;
}
