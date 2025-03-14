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

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { NgScrollbarModule } from 'ngx-scrollbar';
@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    NgxDaterangepickerMd,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule,
    NgScrollbarModule,
  ],
  providers: [LocaleService, DatePipe],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  Customers: Customer[] = [];
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

  show_statistics = false;

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

  loader = false;
  customerListing() {
    this.loader = true;
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
      page: this.page,
      show_statistics: this.show_statistics ? 'yes' : 'no',
    };

    this.customers.listCustomers(obj).subscribe((res) => {
      this.Customers = res.data.results;
      console.log(this.Customers);
      this.loader = false;
    });
  }

  onUserSelect(customer: any) {
    console.log(customer);
    this.router.navigate(['/customers/view', customer.patient_id]);
  }

  patientNameSortColumn: string = '';
  patientNameSortOrder: 'asc' | 'desc' = 'asc';

  lastOrderDateSortColumn: string = '';
  lastOrderDateSortOrder: 'asc' | 'desc' = 'asc';

  dueOrdersAmountSortColumn: string = '';
  dueOrdersAmountSortOrder: 'asc' | 'desc' = 'asc';

  totalOrdersAmountSortColumn: string = '';
  totalOrdersAmountSortOrder: 'asc' | 'desc' = 'asc';

  totalOrdersCountSortColumn: string = '';
  totalOrdersCountSortOrder: 'asc' | 'desc' = 'asc';
  sortTable(column: string) {
    console.log(column);
    switch (column) {
      case 'patient_name':
        this.patientNameSortOrder =
          this.patientNameSortColumn === column
            ? this.patientNameSortOrder === 'asc'
              ? 'desc'
              : 'asc'
            : 'asc';
        this.patientNameSortColumn = column;
        this.sortColumn = column;
        this.sortOrder = this.patientNameSortOrder;
        break;

      case 'last_order_date':
        this.lastOrderDateSortOrder =
          this.lastOrderDateSortColumn === column
            ? this.lastOrderDateSortOrder === 'asc'
              ? 'desc'
              : 'asc'
            : 'asc';
        this.lastOrderDateSortColumn = column;
        this.sortColumn = column;
        this.sortOrder = this.lastOrderDateSortOrder;
        break;

      case 'due_orders_amount':
        this.dueOrdersAmountSortOrder =
          this.dueOrdersAmountSortColumn === column
            ? this.dueOrdersAmountSortOrder === 'asc'
              ? 'desc'
              : 'asc'
            : 'asc';
        this.dueOrdersAmountSortColumn = column;
        this.sortColumn = column;
        this.sortOrder = this.dueOrdersAmountSortOrder;
        break;

      case 'total_orders_amount':
        this.totalOrdersAmountSortOrder =
          this.totalOrdersAmountSortColumn === column
            ? this.totalOrdersAmountSortOrder === 'asc'
              ? 'desc'
              : 'asc'
            : 'asc';
        this.totalOrdersAmountSortColumn = column;
        this.sortColumn = column;
        this.sortOrder = this.totalOrdersAmountSortOrder;
        break;
      case 'total_orders_count':
        this.totalOrdersCountSortOrder =
          this.totalOrdersCountSortColumn === column
            ? this.totalOrdersCountSortOrder === 'asc'
              ? 'desc'
              : 'asc'
            : 'asc';
        this.totalOrdersCountSortColumn = column;
        this.sortColumn = column;
        this.sortOrder = this.totalOrdersCountSortOrder;
        break;
    }
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
    //this.customerListing();
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
    this.toggleSheet();
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
    if (this.Customers.length === 20) {
      console.log('next page');
      this.page++;
      this.customerListing();
    }
  }

  prev() {
    if (this.page > 1) {
      this.page--;
      this.customerListing();
    }
  }

  onClearDateFilter() {
    this.selectedRange = null;
    this.formated_start_date = '';
    this.formated_end_date = '';
    this.customerListing();
  }
  /* moreFilter = false;
  onMoreFilterClick() {
    this.moreFilter = !this.moreFilter;
  } */

  isOpen = false;

  toggleSheet() {
    this.isOpen = !this.isOpen;
  }
  onResetClick() {
    this.due = 0;
    this.preferred = 0;
    this.not_registered = 0;
    this.status = '';
    this.show_statistics = false;
    this.customerListing();
    this.toggleSheet();
  }
}
