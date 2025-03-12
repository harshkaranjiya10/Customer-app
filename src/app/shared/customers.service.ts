import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tags } from '../routes/patient/edit-patient/edit-patient.component';

export interface Customer {
  patient_id: string;
  firstname: string;
  lastname: string;
  patient_name: string;
  mobile: string;
  due_orders_amount: number;
  preferred: string;
  profile_picture: string;
  is_registered: string;
  last_order_date: string;
  registration_date: string;
  balance: number;
  status: string;
  total_orders_count: number;
  total_orders_amount: number;
  share_msg: string;
  due_message: string;
}

export interface listingResponse {
  status_code: string;
  data: {
    rrp: string;
    current_page: number;
    results: Customer[];
  };
}
export interface Patient {
  aadhar_number: string;
  address: string;
  address_id: number;
  address_line2: string;
  addresses: Address[];
  balance: number;
  city: string;
  country: string;
  customer_tags: Tags[];
  discount_percentage: number;
  dob: string;
  due_message: string;
  email: string;
  firstname: string;
  gender: string;
  gstn_number: string;
  id: number;
  is_registered: string;
  lastname: string;
  mobile: string;

  patient_code: string;
  preferred_chemist_id: number;
  profile_picture: string;
  state: string;
  status: string;
  user_id: number;
  verified: number;
  zipcode: string;
}

export interface Address {
  id: number;
  user_id: number;
  address_name: string;
  address: string;
  address_line2: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
  is_default: string;
}

export interface getPatientResponse {
  status_code: string;
  data: Patient;
  status_message: string;
}

export interface addPatientResponse {
  status_code: string;
  status_message: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private http: HttpClient) {}

  listCustomers(obj: any) {
    return this.http.post<listingResponse>(
      'https://staging.evitalrx.in:3000/v3/patients',
      {
        accesstoken: 'uxkimxpcd4ah8tsm',
        chemist_id: 11146,
        device_id: '5c096697-2134-44f9-a843-80ac7ee69ba9',
        login_parent_id: 11146,
        ...obj,
      }
    );
  }

  getPatient(obj: any) {
    return this.http.post<getPatientResponse>(
      'https://staging.evitalrx.in:3000/v3/patients/get',
      {
        accesstoken: 'uxkimxpcd4ah8tsm',
        chemist_id: 11146,
        device_id: '5c096697-2134-44f9-a843-80ac7ee69ba9',
        login_parent_id: 11146,
        ...obj,
      }
    );
  }

  addPatient(obj: any) {
    return this.http.post<addPatientResponse>(
      'https://staging.evitalrx.in:3000/v3/patients/add_patient',
      {
        accesstoken: 'uxkimxpcd4ah8tsm',
        chemist_id: 11146,
        device_id: '5c096697-2134-44f9-a843-80ac7ee69ba9',
        login_parent_id: 11146,
        ...obj,
      }
    );
  }
  editPatient(obj: any) {
    return this.http.post<addPatientResponse>(
      'https://staging.evitalrx.in:3000/v3/patients/edit_customer_details',
      {
        accesstoken: 'uxkimxpcd4ah8tsm',
        chemist_id: 11146,
        device_id: '5c096697-2134-44f9-a843-80ac7ee69ba9',
        login_parent_id: 11146,
        ...obj,
      }
    );
  }
  editPatientDetails(obj: any) {
    return this.http.post<addPatientResponse>(
      'https://staging.evitalrx.in:3000/v3/patients/edit_patient',
      {
        accesstoken: 'uxkimxpcd4ah8tsm',
        chemist_id: 11146,
        device_id: '5c096697-2134-44f9-a843-80ac7ee69ba9',
        login_parent_id: 11146,
        ...obj,
      }
    );
  }

  deleteTags(obj: any) {
    return this.http.post<addPatientResponse>(
      'https://staging.evitalrx.in:3000/v3/patients/delete_tag',
      {
        accesstoken: 'uxkimxpcd4ah8tsm',
        chemist_id: 11146,
        device_id: '5c096697-2134-44f9-a843-80ac7ee69ba9',
        login_parent_id: 11146,
        ...obj,
      }
    );
  }
  sendOtp(obj: any) {
    return this.http.post<addPatientResponse>(
      'https://staging.evitalrx.in:3000/v3/patients/send_otp',
      {
        accesstoken: 'uxkimxpcd4ah8tsm',
        chemist_id: 11146,
        device_id: '5c096697-2134-44f9-a843-80ac7ee69ba9',
        login_parent_id: 11146,
        ...obj,
      }
    );
  }
  
  otpSendToPatient(obj: any) {
    return this.http.post<addPatientResponse>(
      'https://staging.evitalrx.in:3000/v3/patients/otp_to_patient',
      {
        accesstoken: 'uxkimxpcd4ah8tsm',
        chemist_id: 11146,
        device_id: '5c096697-2134-44f9-a843-80ac7ee69ba9',
        login_parent_id: 11146,
        ...obj,
      }
    );

  }
}
