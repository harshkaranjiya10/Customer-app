import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Customer, CustomersService } from '../../shared/customers.service';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { MatSelectModule } from '@angular/material/select';

import {
  LocaleService,
  NgxDaterangepickerMd,
} from 'ngx-daterangepicker-material';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddPatientComponent } from '../patient/add-patient/add-patient.component';
@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, NgxDaterangepickerMd, FormsModule, MatSelectModule],
  providers: [LocaleService, DatePipe],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  Customers: any;
  searchstring: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortColumn: string = '';

  ranges: any = {
    Today: [new Date(), new Date()],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'Last 90 Days': [moment().subtract(3, 'months'), moment()],
  };
  start_Date = new Date();
  end_Date = new Date();
  formated_start_date = '';
  formated_end_date = '';
  selectedRange: any = {};

  //Customer type
  due = 0;
  preferred = 0;
  not_registered = 0;
  customers_type = [
    { value: 'due', viewValue: 'Due only' },
    { value: 'preferred', viewValue: 'Show Preferred only' },
    { value: 'not_registered', viewValue: 'Not Registered ' },
  ];

  selectedCustomerType = [];

  // customer status
  status = '';
  // Page
  page = 1;
  //empty
  constructor(
    private customers: CustomersService,
    private http: HttpClient,
    private datePipe: DatePipe,
    private router: Router,
    private _bottomSheet: MatBottomSheet
  ) {
    this.selectedRange = null;
    this.formated_start_date = '';
    this.formated_end_date = '';

    this.DateFilterRange();
    this.customerListing();
  }

  DateFilterRange() {
    this.ranges = {
      Today: [moment(), moment()],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'Last 90 Days': [moment().subtract(3, 'months'), moment()],
    };
  }

  customerListing() {
    const obj = {
      searchstring: this.searchstring,
      orderby: this.sortColumn,
      order: this.sortOrder,
      start_date: this.formated_start_date,
      end_date: this.formated_end_date,
      due: this.due,
      preferred: this.preferred,
      not_registered: this.not_registered,
      status: this.status,
      current_page: this.page,
    };

    this.customers.listCustomers(obj).subscribe((res) => {
      this.Customers = res.data.results;
      console.log(this.Customers);
    });
  }

  onUserSelect(customer: any) {
    console.log(customer);
    this.router.navigate(['/customers/view', customer.patient_id]);
  }

  sortTable(column: string) {
    this.sortOrder =
      this.sortColumn === column
        ? this.sortOrder === 'asc'
          ? 'desc'
          : 'asc'
        : 'asc';
    this.sortColumn = column;

    this.customerListing();
  }
  onSubmitSearch(searchstring: string) {
    this.searchstring = searchstring;
    this.customerListing();
  }
  onCloseSearch(searchstring: string) {
    searchstring = '';
    this.searchstring = '';
    this.customerListing();
  }
  onCustomerTypeStatus(event: any) {
    this.status = event.value;
    if (event.value === 'all') {
      this.status = '';
    }
    if (event.value === 'unblocked') {
      this.status = 'active';
    }
    this.customerListing();
  }
  onCustomerTypeChange(event: any) {
    console.log(this.selectedCustomerType);
    this.due = 0;
    this.preferred = 0;
    this.not_registered = 0;
    this.selectedCustomerType.forEach((i) => {
      if (i === 'due') {
        this.due = 1;
      } else if (i === 'preferred') {
        this.preferred = 1;
      } else if (i === 'not_registered') {
        this.not_registered = 1;
      }
    });
    //this.customerListing();
  }
  onApplyFilter() {
    console.log('Applying filters with:');
    this.customerListing();
  }
  onDateChange(event: any) {
    if (!event || !event.startDate || !event.endDate) {
      this.selectedRange = null;
      this.formated_start_date = '';
      this.formated_end_date = '';
      return;
    }

    this.formated_start_date = event.startDate.format('YYYY-M-D');
    this.formated_end_date = event.endDate.format('YYYY-M-D');

    this.customerListing();
  }

  onAdd() {
    this._bottomSheet.open(AddPatientComponent);

    this._bottomSheet._openedBottomSheetRef
      ?.afterDismissed()
      .subscribe((res) => {
        if (res.added) {
          this.customerListing();
        }
        console.log();
      });
  }
  next() {
    if (this.Customers.length() === 20) {
      this.page++;
      this.customerListing();
    }
  }
  prev() {
    if (0 < this.Customers.length() && this.Customers.length() < 20) {
      this.page--;
      this.customerListing();
    }
  }
}
