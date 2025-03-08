import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomersService, Patient } from '../../shared/customers.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [MatBottomSheetModule,CommonModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
})
export class PatientComponent {
  Patient!: Patient;
  constructor(
    private route: ActivatedRoute,
    private customers: CustomersService,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit() {
    this.getPatientDetails();
    this._bottomSheet._openedBottomSheetRef
      ?.afterDismissed()
      .subscribe((res) => {
        console.log(res);
      });
    this._bottomSheet._openedBottomSheetRef
      ?.afterDismissed()
      .subscribe((res) => {
        if (res.edited) {
          this.getPatientDetails();
        }
        console.log(res);
      });
    window.addEventListener('addressUpdated', () => {
      this.getPatientDetails();
    });
  }

  getPatientDetails() {
    const patientId = this.route.snapshot.paramMap.get('patient_id');
    let obj = {
      patient_id: patientId,
    };
    this.customers.getPatient(obj).subscribe((res) => {
      console.log(res.data);
      this.Patient = res.data;
    });
  }

  onEditProfile() {
    this._bottomSheet.open(EditPatientComponent, {
      data: this.Patient,
    });

    this._bottomSheet._openedBottomSheetRef
      ?.afterDismissed()
      .subscribe((res) => {
        if (res.edited) {
          this.getPatientDetails();
        }
        console.log(res);
      });
  }
}
