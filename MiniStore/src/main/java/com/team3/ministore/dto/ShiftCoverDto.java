package com.team3.ministore.dto;

import com.team3.ministore.model.ShiftCoverRequest;
import com.team3.ministore.utils.ShiftCoverStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShiftCoverDto {
    private int shiftCoverRequestId;

    @NotNull(message = "Note is required")
    private String note;

    @NotNull(message = "Status is required")
    private ShiftCoverStatus status;

    @NotNull(message = "Staff ID is required")
    private int staffId;

    @NotNull(message = "Shift ID is required")
    private int shiftId;

    private StaffDto staff;

    private ShiftDto shift;

    public ShiftCoverDto(ShiftCoverRequest shiftCoverRequest) {
        this.shiftCoverRequestId = shiftCoverRequest.getShiftCoverRequestId();
        this.note = shiftCoverRequest.getNote();
        this.status = shiftCoverRequest.getStatus();
        this.staffId = shiftCoverRequest.getStaff().getStaffId();
        this.staff = new StaffDto(shiftCoverRequest.getStaff());
        this.shiftId = shiftCoverRequest.getShift().getShiftId();
        this.shift = new ShiftDto(shiftCoverRequest.getShift(),true);
    }

    public ShiftCoverDto(ShiftCoverRequest shiftCoverRequest, boolean withoutStaff, boolean withoutShift) {
        this.shiftCoverRequestId = shiftCoverRequest.getShiftCoverRequestId();
        this.note = shiftCoverRequest.getNote();
        this.status = shiftCoverRequest.getStatus();
        this.staffId = shiftCoverRequest.getStaff().getStaffId();
        this.shiftId = shiftCoverRequest.getShift().getShiftId();
        if (!withoutStaff) {
            this.staff = new StaffDto(shiftCoverRequest.getStaff());
        }
        if (!withoutShift) {
            this.shift = new ShiftDto(shiftCoverRequest.getShift(),true);
        }
    }
}
