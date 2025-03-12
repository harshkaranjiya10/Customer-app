import { Component, inject, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
} from '@angular/material/bottom-sheet';
import { Address, CustomersService } from '../../../shared/customers.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-address.component.html',
  styleUrl: './edit-address.component.css',
})
export class EditAddressComponent {
  address!: Address;
  firstname: '';
  lastname: '';
  profileVerified;
  editAddressForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    address: new FormControl(''),
    address_line2: new FormControl(''),
    city: new FormControl(''),
    zipcode: new FormControl(''),
  });
  submmited = false;
  constructor(
    private _bottomSheet: MatBottomSheet,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private customers: CustomersService
  ) {
    console.log(data);
    console.log(data.patient.verified);

    if (data.address) this.address = data.address;
    this.firstname = data.patient.firstname;
    this.lastname = data.patient.lastname;
    //console.log(this.address);

    this.profileVerified = data.patient.verified;
  }
  private _snackBar = inject(MatSnackBar);
  newAddress = false;
  ngOnInit(): void {
    if (this.data.address) this.address = this.data.address;
    this.firstname = this.data.patient.firstname;
    this.lastname = this.data.patient.lastname;
    this.newAddress = this.data.newAdress;
    this.profileVerified = this.data.patient.verified;

    this.editAddressForm.controls.first_name.setValue(this.firstname);
    this.editAddressForm.controls.last_name.setValue(this.lastname);
    if (this.data.address) {
      this.editAddressForm.controls.address.setValue(this.address.address);
      this.editAddressForm.controls.address_line2.setValue(
        this.address.address_line2
      );
      this.editAddressForm.controls.zipcode.setValue(this.address.zipcode);
      this.editAddressForm.controls.city.setValue(this.address.city);
    }
    this.addressValidations();
  }

  addressValidations() {
    this.editAddressForm.get('address')?.valueChanges.subscribe((value) => {
      console.log(value);

      if (value) {
        this.editAddressForm
          .get('zipcode')
          ?.setValidators([
            Validators.required,
            Validators.pattern('^[0-9]{6}$'),
          ]);
        this.editAddressForm.get('city')?.setValidators([Validators.required]);
      } else {
        this.editAddressForm.get('zipcode')?.clearValidators();
        this.editAddressForm.get('city')?.clearValidators();
      }
      this.editAddressForm.get('zipcode')?.updateValueAndValidity();
      this.editAddressForm.get('city')?.updateValueAndValidity();
    });
  }

  onAddressValueChange(event: any) {
    if (this.editAddressForm.get('address')?.value !== '') {
      this.addressValidations();
    } else {
      this.editAddressForm.get('zipcode')?.clearValidators();
      this.editAddressForm.get('city')?.clearValidators();
    }
    this.editAddressForm.get('zipcode')?.updateValueAndValidity();
    this.editAddressForm.get('city')?.updateValueAndValidity();
  }

  onSubmit() {
    this.submmited = true;
    let form = this.editAddressForm.value;
    let obj = {};
    if (this.newAddress) {
      obj = {
        user_id: this.data.patient.user_id,
        address_id: this.data.address?.id,
        email: this.data.patient.email,
        new_address: 'yes',
        ...form,
      };
    } else {
      obj = {
        user_id: this.data.patient.user_id,
        address_id: this.data.address?.id,
        email: this.data.patient.email,
        ...form,
      };
    }
    console.log(this.editAddressForm);

    if (this.editAddressForm.valid) {
      this.customers.editPatientDetails(obj).subscribe((res) => {
        if (res.status_code === '1') {
          this._bottomSheet.dismiss({
            addressedit: true,
          });
        } else {
          if (res.status_message === '') this._snackBar.open('');
        }
      });
    }
  }
  onClose() {
    this._bottomSheet.dismiss();
  }
  onBack() {
    this._bottomSheet.dismiss({
      back: true,
    });
    //console.log('back');
  }
  otpSend = false;
  verfiyOtp() {
    this.otpSend = true;
    if (!this.editAddressForm.contains('otp')) {
      (this.editAddressForm as FormGroup).addControl(
        'otp',
        new FormControl('', Validators.required)
      );
    }
    let obj = {};

    obj = {
      mobile: this.data.patient.mobile,
      patient_id: this.data.patient.id,
    };

    this.customers.otpSendToPatient(obj).subscribe((res) => console.log(res));
  }
}
