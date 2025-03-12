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
import { LocaleService } from 'ngx-daterangepicker-material';
@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    CustomersService,
    DatePipe,
    LocaleService,
  ],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css',
})
export class AddPatientComponent {
  addPatientForm = new FormGroup({
    first_name: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9\\-\\s]+$'),
    ]),
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
    gstn_number: new FormControl(''),
  });

  today = new Date();
  submmited = false;
  addAddress = false;
  private _bottomSheetRef =
    inject<MatBottomSheetRef<AddPatientComponent>>(MatBottomSheetRef);

  verifyMobile = false;
  constructor(
    private customerService: CustomersService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //this.addressValidations();
    //this.emailValidators();
  }

  addressValidations() {
    this.addPatientForm.get('address')?.valueChanges.subscribe((value) => {
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
  /* emailValidators() {
    this.addPatientForm.get('email')?.valueChanges.subscribe((value) => {
      const emailControl = this.addPatientForm.get('email');

      if (value) {
        emailControl?.setValidators([Validators.required, Validators.email]);
      } else {
        emailControl?.clearValidators();
      }
      emailControl?.updateValueAndValidity();
    });
  } */

  onGSTINValueChange(event: any) {
    console.log(event);
    console.log('GSTIN Value change');

    this.gstinValidators();
    if (event.target.value === '') {
      this.addPatientForm.get('gstn_number')?.clearValidators();
      this.addPatientForm.get('gstn_number')?.updateValueAndValidity();
    }

    this.addPatientForm.get('gstn_number')?.updateValueAndValidity();
  }
  gstinValidators() {
    const GSTINControl = this.addPatientForm.get('gstn_number');
    if (GSTINControl?.value === '') {
      this.addPatientForm.get('gstn_number')?.clearValidators();
      this.addPatientForm.get('gstn_number')?.updateValueAndValidity();
    } else {
      GSTINControl?.setValidators([
        Validators.required,
        Validators.minLength(15),
        Validators.pattern(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
        ),
      ]);
      GSTINControl?.updateValueAndValidity();
    }
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
    if (event.value != '') {
      const formattedDate =
        this.datePipe.transform(event.value, 'yyyy-MM-dd') || '';
      console.log(formattedDate);
      this.addPatientForm.controls.dob.setValue(formattedDate);
    }
  }

  onEmailValueChange(event: any) {
    console.log(event.target.value);

    console.log('ValueChangeEvent');
    if (event.target.value === '') {
      this.addPatientForm.get('email')?.clearValidators();
      this.addPatientForm.get('email')?.updateValueAndValidity();
    } else {
      this.emailValidators();
    }
  }
  emailValidators() {
    const emailControl = this.addPatientForm.get('email');

    if (emailControl) {
      emailControl.setValidators([
        Validators.required,
        Validators.email,
        Validators.pattern(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm),
      ]);
      emailControl.updateValueAndValidity();
      console.log('validators updated');
    }
  }

  addAddressExtention() {
    this.addAddress = !this.addAddress;

    if (this.addAddress) {
      this.addressValidations();
    } else {
      this.addPatientForm.get('zipcode')?.clearValidators();
      this.addPatientForm.get('city')?.clearValidators();
      this.addPatientForm.get('gstn_number')?.clearValidators();
      this.addPatientForm.get('gstn_number')?.updateValueAndValidity();
    }
    this.addPatientForm.get('zipcode')?.updateValueAndValidity();
    this.addPatientForm.get('city')?.updateValueAndValidity();
  }

  noSpecialChar(event: KeyboardEvent) {
    const pattern = /^[a-zA-Z ]+$/;
    if (!pattern.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onVerfyMobile() {
    if (this.addPatientForm.controls.mobile.invalid) {
      this._snackBar.open('Invalid Phone number', 'Close');
    } else if (this.addPatientForm.controls.first_name.invalid) {
      this._snackBar.open('Invalid Name', 'Close');
    } else if (this.addPatientForm.controls.email.invalid) {
      this._snackBar.open('Invalid Email', 'Close');
    } else {
      this.customerService
        .sendOtp(this.addPatientForm.value)
        .subscribe((res) => {
          console.log(res);
          if (
            res.status_code === '0' &&
            res.status_message === 'This Mobile is already exist.'
          ) {
            this._snackBar.open('This Mobile is already exist.', 'Close');
          } else {
            this.verifyMobile = true;
          }
        });
    }
  }

  onMobileInputChange(event: any) {
    this.addPatientForm.controls.mobile.setValue(
      event.target.value.replace(/[^0-9]/g, '')
    );
  }
}
