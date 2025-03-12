import { Component, Inject, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import {
  addPatientResponse,
  Address,
  CustomersService,
  Patient,
} from '../../../shared/customers.service';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { EditAddressComponent } from '../edit-address/edit-address.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { MatChipGrid, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatChipsModule } from '@angular/material/chips';

import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
export interface Fruit {
  name: string;
}

export interface Tags {
  tag: string;
  tag_id: number;
  transaction_table_id: number;
}

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [
    MatListModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatRadioModule,
    MatBottomSheetModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatChipGrid,
    MatButtonModule,
    MatTooltipModule,
  ],
  providers: [provideNativeDateAdapter(), DatePipe],
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.css',
})
export class EditPatientComponent {
  Patient!: Patient;
  Address: Address[] = [];
  defaultAdress!: Address;
  customer_tags: Tags[] = [];
  editPatientForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    mobile: new FormControl(''),
    dob: new FormControl(''),
    email: new FormControl(''),
    gender: new FormControl(''),
    aadhar_number: new FormControl(''),
    discount_percentage: new FormControl(),
    gstn_number: new FormControl(''),
    customer_tags: new FormControl(''),
  });
  today = new Date();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  //fruits: Fruit[] = [{ name: 'Lemon' }, { name: 'Lime' }, { name: 'Apple' }];

  tags = this.customer_tags;

  moreAddress = false;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add
    if ((value || '').trim()) {
      this.tags.push({
        tag_id: 0,
        tag: value.trim(),
        transaction_table_id: 0,
      });
    }

    if (input) {
      input.value = '';
    }

    this.editPatientForm.controls.customer_tags.setValue(
      JSON.stringify(this.tags)
    );
    console.log(this.editPatientForm);
  }

  remove(tag: any): void {
    const patientId = this.route.snapshot.paramMap.get('patient_id');
    let obj = {
      patient_id: this.Patient.id,
      tag_id: tag.tag_id,
    };

    this.customers.deleteTags(obj).subscribe((res) => console.log(res));

    console.log(tag);

    const index = this.tags.indexOf(tag);
    console.log(index);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }

    if (this.tags.length <= 5) {
      this.editPatientForm.controls.customer_tags.setValue(
        JSON.stringify(this.tags)
      );
    }
    console.log(this.editPatientForm);
  }

  constructor(
    private _bottomSheet: MatBottomSheet,
    private datePipe: DatePipe,
    private customers: CustomersService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.Patient = data;
    console.log(this.Patient);
    this.Address = this.Patient.addresses;
    this.Address.forEach((a) => {
      a.is_default === 'yes' ? (this.defaultAdress = a) : this.defaultAdress;
    });
    this.customer_tags = this.Patient.customer_tags;
  }

  ngOnInit(): void {
    this.Patient = this.data;
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.editPatientForm.controls.first_name.setValue(this.data.firstname);
    this.editPatientForm.controls.last_name.setValue(this.data.lastname);
    this.editPatientForm.controls.mobile.setValue(this.data.mobile);
    this.editPatientForm.controls.email.setValue(this.data.email);
    this.editPatientForm.controls.gender.setValue(this.data.gender);
    this.editPatientForm.controls.discount_percentage.setValue(
      this.data.discount_percentage
    );
    this.editPatientForm.controls.aadhar_number.setValue(
      this.data.aadhar_number
    );
    this.editPatientForm.controls.gstn_number.setValue(this.data.gstn_number);
    if (this.Patient.dob === '1900-01-01' || this.Patient.dob === '') {
      this.editPatientForm.controls.dob.setValue('');
    } else {
      this.editPatientForm.controls.dob.setValue(this.data.dob);
    }

    this.tags = this.customer_tags;
    this.editPatientForm.controls.customer_tags.setValue(
      JSON.stringify(this.tags)
    );
    //this.emailValidators();
    //this.AadharValidators();
    //console.log(this.customer_tags, this.Patient.customer_tags);
  }

  onSubmit() {
    let form = this.editPatientForm.value;
    console.log(this.editPatientForm);
    let obj = {
      user_id: this.Patient.user_id,
      ...form,
    };

    if (this.editPatientForm.valid) {
      this.customers.editPatient(obj).subscribe((res: addPatientResponse) => {
        console.log(res);

        if (res.status_code === '1') {
          this._snackBar.open('Edit successfully', 'Close')._dismissAfter(3000);
          this._bottomSheet.dismiss({ edited: true });
        }
      });
    }
  }
  onClose() {
    this._bottomSheet.dismiss({ edited: false });
  }

  onDateOfBirth(event: any) {
    if (event.value) {
      const formattedDate =
        this.datePipe.transform(event.value, 'yyyy-MM-dd') || '';
      console.log(formattedDate);
      this.editPatientForm.controls.dob.setValue(formattedDate);
    }
  }
  onEmailValueChange(event: any) {
    console.log(event.target.value);

    console.log('ValueChangeEvent');
    this.emailValidators();
    if (event.target.value === '') {
      this.editPatientForm.get('email')?.clearValidators();
      this.editPatientForm.get('email')?.updateValueAndValidity();
    }
  }
  emailValidators() {
    const emailControl = this.editPatientForm.get('email');

    if (emailControl) {
      emailControl.setValidators([
        Validators.required,
        Validators.email,
        // /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
        Validators.pattern(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm),
      ]);
      emailControl.updateValueAndValidity();
      console.log('validators updated');
    }
  }
  AadharValidators() {
    const aadhar_numberControl = this.editPatientForm.get('aadhar_number');
    if (aadhar_numberControl?.value === '') {
      this.editPatientForm.get('aadhar_number')?.clearValidators();
      this.editPatientForm.get('aadhar_number')?.updateValueAndValidity();
    } else {
      aadhar_numberControl?.setValidators([
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12),
      ]);
      aadhar_numberControl?.updateValueAndValidity();
      console.log('validators updated');
    }
  }
  onAadharValueChange(event: any) {
    console.log(event);
    console.log('ValueChangeEvent');
    this.AadharValidators();
    if (event.target.value === '') {
      this.editPatientForm.get('aadhar_number')?.clearValidators();
      this.editPatientForm.get('aadhar_number')?.updateValueAndValidity();
    }

    this.editPatientForm.get('aadhar_number')?.updateValueAndValidity();
  }

  onGSTINValueChange(event: any) {
    console.log(event);
    console.log('GSTIN Value change');

    this.gstinValidators();
    if (event.target.value === '') {
      this.editPatientForm.get('gstn_number')?.clearValidators();
      this.editPatientForm.get('gstn_number')?.updateValueAndValidity();
    }

    this.editPatientForm.get('gstn_number')?.updateValueAndValidity();
  }
  gstinValidators() {
    const GSTINControl = this.editPatientForm.get('gstn_number');
    if (GSTINControl?.value === '') {
      this.editPatientForm.get('gstn_number')?.clearValidators();
      this.editPatientForm.get('gstn_number')?.updateValueAndValidity();
    } else {
      GSTINControl?.setValidators([
        Validators.required,
        Validators.minLength(15),
        Validators.pattern(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
        ),
      ]);
      GSTINControl?.updateValueAndValidity();
      console.log('validators updated');
    }
  }

  addNewAddressBottomsheet() {
    //this._bottomSheet.open(EditAddressComponent);
    this._bottomSheet.open(EditAddressComponent, {
      data: {
        newAdress: true,
        patient: this.Patient,
      },
    });
    this._bottomSheet._openedBottomSheetRef
      ?.afterDismissed()
      .subscribe((res) => {
        console.log(res);

        if (res.back) {
          this._bottomSheet.open(EditPatientComponent, { data: this.Patient });
        }
        const event = new CustomEvent('addressUpdated');

        window.dispatchEvent(event);
      });
  }

  onMoreAddress() {
    this.moreAddress = !this.moreAddress;
  }

  onAddressEditClick(address: Address) {
    this._bottomSheet.open(EditAddressComponent, {
      data: {
        newAdress: false,
        address,
        patient: this.Patient,
      },
    });

    this._bottomSheet._openedBottomSheetRef
      ?.afterDismissed()
      .subscribe((res) => {
        console.log(res);

        if (res.addressedit) {
          const patientId = this.route.snapshot.paramMap.get('patient_id');
          let obj = {
            patient_id: patientId,
          };
          this.customers.getPatient(obj).subscribe((res) => {
            this.Patient = res.data;
          });
          this._bottomSheet.dismiss({ edited: true });
          console.log('Edited is true');
          const event = new CustomEvent('addressUpdated');
          //this.getPatientDetails();

          window.dispatchEvent(event);
        } else if (res.back) {
          this._bottomSheet.open(EditPatientComponent, { data: this.Patient });
        }
      });
  }

  editProfileName() {
    this._bottomSheet.open(EditAddressComponent, {
      data: {
        newAdress: false,
        patient: this.Patient,
      },
    });

    this._bottomSheet._openedBottomSheetRef
      ?.afterDismissed()
      .subscribe((res) => {
        console.log(res);

        if (res.back) {
          this._bottomSheet.open(EditPatientComponent, { data: this.Patient });
        }
        const event = new CustomEvent('addressUpdated');

        window.dispatchEvent(event);
      });
  }
  onAadharNumberInputChange(event: any) {
    this.editPatientForm.controls.aadhar_number.setValue(
      event.target.value.replace(/[^0-9]/g, '')
    );
  }
}
