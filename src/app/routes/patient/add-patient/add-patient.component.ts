import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { MatRadioModule } from '@angular/material/radio';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import {
  FormControl,
  FormGroup,
  PatternValidator,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomersService } from '../../../shared/customers.service';
@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter(), CustomersService, DatePipe],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css',
})
export class AddPatientComponent {
  addPatientForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl(''),
    email: new FormControl(''),
    dob: new FormControl(''),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[6-9]\d{9}$/),
    ]),
    otp: new FormControl(''),
    discount_percentage: new FormControl(0),
    gender: new FormControl(''),
    address: new FormControl(''),
    address_line2: new FormControl(''),
    city: new FormControl(''),
    zipcode: new FormControl(''),
    GSTIN_PAN: new FormControl(''),
  });

  today = new Date();
  submmited = false;
  addAddress = false;
  private _bottomSheetRef =
    inject<MatBottomSheetRef<AddPatientComponent>>(MatBottomSheetRef);

  constructor(
    private customerService: CustomersService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.addressValidations();
    //this.emailValidators();
  }

  addressValidations() {
    this.addPatientForm
      .get('address')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.addPatientForm
            .get('zipcode')
            ?.setValidators([
              Validators.required,
              Validators.pattern('^[0-9]{6}$'),
            ]);
          this.addPatientForm.get('city')?.setValidators([Validators.required]);
        } else {
          this.addPatientForm.get('zipcode')?.clearValidators();
          this.addPatientForm.get('city')?.clearValidators();
        }
        this.addPatientForm.get('zipcode')?.updateValueAndValidity();
        this.addPatientForm.get('city')?.updateValueAndValidity();
      });
  }
  emailValidators() {
    this.addPatientForm.get('email')?.valueChanges.subscribe((value) => {
      const emailControl = this.addPatientForm.get('email');

      if (value) {
        emailControl?.setValidators([Validators.required, Validators.email]);
      } else {
        emailControl?.clearValidators();
      }
      emailControl?.updateValueAndValidity();
    });
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  response = '';

  private _snackBar = inject(MatSnackBar);

  onSubmit() {
    this.submmited = true;
    console.log(this.addPatientForm);
    if (this.addPatientForm.valid) {
      this.customerService
        .addPatient(this.addPatientForm.value)
        .subscribe((res) => {
          console.log(res);
          this.response = res.status_message;
          if (res.status_code === '1') {
            this._bottomSheetRef.dismiss({ added: true });
          } else if (res.status_code === '0') {
            this._snackBar.open('Already existing Mobile number', 'Close');
          }
        });
    }
  }
  onClose() {
    this._bottomSheetRef.dismiss();
  }
  onDateOfBirth(event: any) {
    if (event.value) {
      const formattedDate =
        this.datePipe.transform(event.value, 'yyyy-MM-dd') || '';
      console.log(formattedDate);
      this.addPatientForm.controls.dob.setValue(formattedDate);
    }
  }

  onEmailValueChange() {
    this.emailValidators();
  }

  addAddressExtention() {
    this.addAddress = !this.addAddress;
  }
}
