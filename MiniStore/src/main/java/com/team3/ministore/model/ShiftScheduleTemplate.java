package com.team3.ministore.model;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Data
@Table(name = "shiftscheduletemplates")
public class ShiftScheduleTemplate {
    @EmbeddedId
    private Pk pk;

    @Column(name = "date")
    private Date date;

    @Column(name = "staff_name", length = 100)
    private String staffName;

    @Data
    @Embeddable
    public static class Pk implements Serializable {
        private static final long serialVersionUID = 1L;

        @Column(name = "shift_template_id")
        private Integer shiftTemplateId;

        @Column(name = "schedule_template_id")
        private int scheduleTemplateId;
    }
}
