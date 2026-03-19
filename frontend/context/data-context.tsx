"use client";

import React, { createContext, useContext, useState } from "react";

// --- Database Schema Types ---

export type UserRole = 'SuperAdmin' | 'GroupAdmin' | 'HospitalAdmin' | 'Doctor' | 'Patient' | 'Receptionist';

export interface User {
    userid: string;
    email: string;
    phoneno: string;
    role: UserRole;
    isactive: boolean;
    name: string; // Helper
    hospitalgroupid?: string;
    hospitalid?: string;
}

export interface HospitalGroup {
    hospitalgroupid: string;
    groupname: string;
    contactemail: string;
    contactno: string;
    address: string;
}

export interface Hospital {
    hospitalid: string;
    hospitalgroupid: string; // Linked to Group
    hospitalname: string;
    address: string;
    receptionistcontact: string;
    type: "General" | "Specialized" | "Clinic";
    bedCount: number;
}

// ... Existing Interfaces ...
export interface BloodGroup {
    bloodgroupid: string;
    bloodgroupname: string;
}

export interface Specialization {
    specializationid: string;
    specializationname: string;
}

export interface DiagnosisType {
    diagnosistypeid: string;
    diagnosisname: string;
}

export interface TreatmentType {
    treatmenttypeid: string;
    treatmentname: string;
}

export interface SubTreatmentType {
    subtreatmenttypeid: string;
    treatmenttypeid: string;
    subtreatmentname: string;
    rate: number;
}

export interface Doctor {
    doctorid: string;
    userid: string;
    hospitalid: string;
    doctorname: string;
    specializationid: string;
    isactive: boolean;
    specializationName?: string;
    email?: string;
    contact?: string;
    availability?: string;
}

export interface Patient {
    patientid: string;
    userid: string;
    hospitalid: string;
    patientno: number;
    patientname: string;
    gender: "Male" | "Female" | "Other";
    age: number;
    bloodgroupid: string;
    registrationdate: string;
    isactive: boolean;
    bloodgroupName?: string;
    contact?: string;
    email?: string;
    condition?: string;
    lastVisit?: string;
}

export interface Appointment {
    appointmentid: string;
    hospitalid: string;
    patientid: string;
    doctorid: string;
    appointmentdatetime: string;
    status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-Show' | 'Rescheduled';
    patientName?: string;
    doctorName?: string;
    type?: string;
}

export interface OPDVisit {
    opdid: string;
    hospitalid: string;
    patientid: string;
    doctorid: string;
    opdno: number;
    visitdatetime: string;
    isfollowup: boolean;
    notes?: string;
    diagnosis?: string;
    status: "Active" | "Discharged";
    patientName?: string;
    doctorName?: string;
}

export interface ReceiptItem {
    receiptitemid?: string;
    subtreatmenttypeid: string;
    description: string;
    qty: number;
    rate: number;
    amount: number;
}

export interface Receipt {
    receiptid: string;
    hospitalid: string;
    opdid?: string;
    receiptnumber: number;
    receiptdate: string;
    totalamount: number;
    paymentmodeid: string;
    status: 'Paid' | 'Pending' | 'Refunded' | 'Cancelled';
    items: ReceiptItem[];
    patientName?: string;
    paymentModeName?: string;
}

// --- CONSTANTS ---
const BLOOD_GROUPS: BloodGroup[] = [
    { bloodgroupid: '1', bloodgroupname: 'A+' },
    { bloodgroupid: '2', bloodgroupname: 'A-' },
    { bloodgroupid: '3', bloodgroupname: 'B+' },
    { bloodgroupid: '4', bloodgroupname: 'B-' },
    { bloodgroupid: '5', bloodgroupname: 'O+' },
    { bloodgroupid: '6', bloodgroupname: 'O-' },
    { bloodgroupid: '7', bloodgroupname: 'AB+' },
    { bloodgroupid: '8', bloodgroupname: 'AB-' },
];

const SPECIALIZATIONS: Specialization[] = [
    { specializationid: '1', specializationname: 'General Physician' },
    { specializationid: '2', specializationname: 'Cardiologist' },
    { specializationid: '3', specializationname: 'Dermatologist' },
    { specializationid: '4', specializationname: 'Orthopedic' },
    { specializationid: '5', specializationname: 'Dentist' },
    { specializationid: '6', specializationname: 'Neurologist' },
];

// --- MOCK DATA SEEDING ---
const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const getRelativeDate = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return formatDate(d);
};

// 1. Hospital Groups
const MOCK_GROUPS: HospitalGroup[] = [
    { hospitalgroupid: 'g1', groupname: 'Max Healthcare Group', contactemail: 'corporate@maxhealthcare.com', contactno: '1800-MAX-111', address: 'Max Tower, Saket District Centre, New Delhi' },
    { hospitalgroupid: 'g2', groupname: 'Manipal Hospitals Group', contactemail: 'info@manipalhospitals.com', contactno: '1800-MANIPAL', address: 'Manipal Corporate House, Bangalore' }
];

// 2. Hospitals (2 per group)
const MOCK_HOSPITALS: Hospital[] = [
    { hospitalid: 'h1', hospitalgroupid: 'g1', hospitalname: 'Max Super Speciality Hospital, Saket', address: 'Saket, New Delhi', receptionistcontact: '011-26515050', type: 'Specialized', bedCount: 530 },
    { hospitalid: 'h2', hospitalgroupid: 'g1', hospitalname: 'Max Hospital, Vaishali', address: 'Vaishali, Ghaziabad', receptionistcontact: '0120-4188000', type: 'Specialized', bedCount: 370 },
    { hospitalid: 'h3', hospitalgroupid: 'g2', hospitalname: 'Manipal Hospital, Whitefield', address: 'Whitefield, Bangalore', receptionistcontact: '080-22221111', type: 'Specialized', bedCount: 280 },
    { hospitalid: 'h4', hospitalgroupid: 'g2', hospitalname: 'Manipal Hospital, Old Airport Road', address: 'Old Airport Road, Bangalore', receptionistcontact: '080-40004000', type: 'Specialized', bedCount: 600 },
];

// 3. Admin Users (Group & Hospital) - Simplified representation
const MOCK_ADMINS: User[] = [
    { userid: 'ga1', name: 'Max Group Admin', email: 'admin@maxgroup.com', role: 'GroupAdmin', hospitalgroupid: 'g1', phoneno: '9999900001', isactive: true },
    { userid: 'ga2', name: 'Manipal Group Admin', email: 'admin@manipalgroup.com', role: 'GroupAdmin', hospitalgroupid: 'g2', phoneno: '9999900002', isactive: true },
    { userid: 'ha1', name: 'Saket Admin', email: 'admin@max-saket.com', role: 'HospitalAdmin', hospitalgroupid: 'g1', hospitalid: 'h1', phoneno: '8888800001', isactive: true },
    { userid: 'ha2', name: 'Vaishali Admin', email: 'admin@max-vaishali.com', role: 'HospitalAdmin', hospitalgroupid: 'g1', hospitalid: 'h2', phoneno: '8888800002', isactive: true },
    { userid: 'ha3', name: 'Whitefield Admin', email: 'admin@manipal-whitefield.com', role: 'HospitalAdmin', hospitalgroupid: 'g2', hospitalid: 'h3', phoneno: '8888800003', isactive: true },
    { userid: 'ha4', name: 'Old Airport Admin', email: 'admin@manipal-oar.com', role: 'HospitalAdmin', hospitalgroupid: 'g2', hospitalid: 'h4', phoneno: '8888800004', isactive: true },
];

// 4. Doctors (linked to hospitals)
const MOCK_DOCTORS: Doctor[] = [
    { doctorid: 'd1', userid: 'u_d1', hospitalid: 'h1', doctorname: 'Dr. Prathap', specializationid: '2', isactive: true, specializationName: 'Cardiologist', email: 'prathap@apollo.com', availability: 'Mon, Wed, Fri (9am - 1pm)' },
    { doctorid: 'd2', userid: 'u_d2', hospitalid: 'h1', doctorname: 'Dr. Sita', specializationid: '3', isactive: true, specializationName: 'Dermatologist', email: 'sita@apollo.com', availability: 'Tue, Thu (10am - 4pm)' },
    { doctorid: 'd3', userid: 'u_d3', hospitalid: 'h3', doctorname: 'Dr. Trehan', specializationid: '2', isactive: true, specializationName: 'Cardiologist', email: 'trehan@fortis.com', availability: 'Mon-Sat (8am - 12pm)' },
    { doctorid: 'd4', userid: 'u_d4', hospitalid: 'h2', doctorname: 'Dr. Anita', specializationid: '5', isactive: false, specializationName: 'Dentist', email: 'anita@apollo.com', availability: 'Mon-Fri (5pm - 9pm)' },
    { doctorid: 'd5', userid: 'u_d5', hospitalid: 'h4', doctorname: 'Dr. Riya', specializationid: '6', isactive: true, specializationName: 'Neurologist', email: 'riya@fortis.com', availability: 'On Call' },
];

// 5. Patients
const MOCK_PATIENTS: Patient[] = [
    { patientid: 'p1', userid: 'u_p1', hospitalid: 'h1', patientno: 1001, patientname: 'Rahul Dravid', gender: 'Male', age: 50, bloodgroupid: '5', registrationdate: getRelativeDate(-30), isactive: true, bloodgroupName: 'O+', contact: '9876543210', email: 'rahul@mail.com', lastVisit: getRelativeDate(0) },
    { patientid: 'p2', userid: 'u_p2', hospitalid: 'h3', patientno: 2001, patientname: 'Virat Kohli', gender: 'Male', age: 35, bloodgroupid: '1', registrationdate: getRelativeDate(-15), isactive: true, bloodgroupName: 'A+', contact: '9998887776', email: 'virat@mail.com', lastVisit: getRelativeDate(-2) },
];

// 6. Config Data (Treatments)
const MOCK_TREATMENTS: TreatmentType[] = [
    { treatmenttypeid: '1', treatmentname: 'Consultation' },
    { treatmenttypeid: '2', treatmentname: 'Diagnostics & Imaging' },
    { treatmenttypeid: '3', treatmentname: 'Cardiology Procedures' },
    { treatmenttypeid: '4', treatmentname: 'Dental Procedures' },
    { treatmenttypeid: '5', treatmentname: 'Orthopedic Procedures' },
    { treatmenttypeid: '6', treatmentname: 'Laboratory Tests' },
];

const MOCK_SUB_TREATMENTS: SubTreatmentType[] = [
    // Consultations
    { subtreatmenttypeid: '101', treatmenttypeid: '1', subtreatmentname: 'General Consultation', rate: 500 },
    { subtreatmenttypeid: '102', treatmenttypeid: '1', subtreatmentname: 'Specialist Consultation', rate: 1000 },
    { subtreatmenttypeid: '103', treatmenttypeid: '1', subtreatmentname: 'Emergency Consultation', rate: 1500 },
    { subtreatmenttypeid: '104', treatmenttypeid: '1', subtreatmentname: 'Follow-up Visit', rate: 300 },

    // Diagnostics & Imaging
    { subtreatmenttypeid: '201', treatmenttypeid: '2', subtreatmentname: 'Digital X-Ray (Chest)', rate: 800 },
    { subtreatmenttypeid: '202', treatmenttypeid: '2', subtreatmentname: 'MRI Scan (Brain/Spine)', rate: 6500 },
    { subtreatmenttypeid: '203', treatmenttypeid: '2', subtreatmentname: 'CT Scan (Whole Body)', rate: 4500 },
    { subtreatmenttypeid: '204', treatmenttypeid: '2', subtreatmentname: 'Ultrasound (Abdomen)', rate: 1200 },

    // Cardiology
    { subtreatmenttypeid: '301', treatmenttypeid: '3', subtreatmentname: 'ECG (Electrocardiogram)', rate: 600 },
    { subtreatmenttypeid: '302', treatmenttypeid: '3', subtreatmentname: 'Echocardiography (2D Echo)', rate: 2500 },
    { subtreatmenttypeid: '303', treatmenttypeid: '3', subtreatmentname: 'TMT (Treadmill Test)', rate: 2000 },

    // Dental
    { subtreatmenttypeid: '401', treatmenttypeid: '4', subtreatmentname: 'Root Canal Treatment', rate: 4000 },
    { subtreatmenttypeid: '402', treatmenttypeid: '4', subtreatmentname: 'Dental Scaling & Cleaning', rate: 1500 },
    { subtreatmenttypeid: '403', treatmenttypeid: '4', subtreatmentname: 'Tooth Extraction', rate: 1200 },

    // Orthopedic
    { subtreatmenttypeid: '501', treatmenttypeid: '5', subtreatmentname: 'Plaster Cast (Arm/Leg)', rate: 1800 },
    { subtreatmenttypeid: '502', treatmenttypeid: '5', subtreatmentname: 'Physiotherapy Session', rate: 800 },

    // Lab Tests
    { subtreatmenttypeid: '601', treatmenttypeid: '6', subtreatmentname: 'Complete Blood Count (CBC)', rate: 400 },
    { subtreatmenttypeid: '602', treatmenttypeid: '6', subtreatmentname: 'Lipid Profile', rate: 900 },
    { subtreatmenttypeid: '603', treatmenttypeid: '6', subtreatmentname: 'Liver Function Test (LFT)', rate: 850 },
    { subtreatmenttypeid: '604', treatmenttypeid: '6', subtreatmentname: 'Blood Sugar (Fasting/PP)', rate: 150 },
    { subtreatmenttypeid: '605', treatmenttypeid: '6', subtreatmentname: 'Thyroid Profile (T3, T4, TSH)', rate: 1100 },
    { subtreatmenttypeid: '606', treatmenttypeid: '6', subtreatmentname: 'Urinalysis', rate: 250 },
];

// 7. Appointments & Visits
const MOCK_APPOINTMENTS: Appointment[] = [
    { appointmentid: 'a1', hospitalid: 'h1', patientid: 'p1', doctorid: 'd1', appointmentdatetime: `${getRelativeDate(1)}T10:00:00`, status: 'Scheduled', patientName: 'Rahul Dravid', doctorName: 'Dr. Prathap', type: 'Consultation' },
    { appointmentid: 'a2', hospitalid: 'h1', patientid: 'p2', doctorid: 'd2', appointmentdatetime: `${getRelativeDate(-1)}T14:30:00`, status: 'Completed', patientName: 'Virat Kohli', doctorName: 'Dr. Sita', type: 'Consultation' },
    { appointmentid: 'a3', hospitalid: 'h3', patientid: 'p2', doctorid: 'd3', appointmentdatetime: `${getRelativeDate(2)}T09:00:00`, status: 'Scheduled', patientName: 'Virat Kohli', doctorName: 'Dr. Trehan', type: 'Checkup' },
    { appointmentid: 'a4', hospitalid: 'h2', patientid: 'p1', doctorid: 'd4', appointmentdatetime: `${getRelativeDate(-5)}T18:00:00`, status: 'Cancelled', patientName: 'Rahul Dravid', doctorName: 'Dr. Anita', type: 'Dental' },
];

const MOCK_OPD: OPDVisit[] = [
    { opdid: 'opd1', hospitalid: 'h1', patientid: 'p1', doctorid: 'd1', opdno: 101, visitdatetime: `${getRelativeDate(0)}T10:00:00`, isfollowup: false, notes: 'Regular checkup', diagnosis: 'Healthy', status: 'Active', patientName: 'Rahul Dravid', doctorName: 'Dr. Prathap' } as any
];

const MOCK_RECEIPTS: Receipt[] = [
    {
        receiptid: 'r1',
        hospitalid: 'h1',
        receiptnumber: 1001,
        receiptdate: getRelativeDate(0),
        totalamount: 1500,
        paymentmodeid: '1',
        status: 'Paid',
        patientName: 'Rahul Dravid',
        paymentModeName: 'Cash',
        items: [
            { subtreatmenttypeid: '102', description: 'Specialist Consultation', qty: 1, rate: 1000, amount: 1000 },
            { subtreatmenttypeid: '601', description: 'Complete Blood Count (CBC)', qty: 1, rate: 500, amount: 500 }
        ]
    },
    {
        receiptid: 'r2',
        hospitalid: 'h1',
        receiptnumber: 1002,
        receiptdate: getRelativeDate(-1),
        totalamount: 6500,
        paymentmodeid: '2',
        status: 'Paid',
        patientName: 'Virat Kohli',
        paymentModeName: 'Card',
        items: [
            { subtreatmenttypeid: '202', description: 'MRI Scan (Brain/Spine)', qty: 1, rate: 6500, amount: 6500 }
        ]
    },
    {
        receiptid: 'r3',
        hospitalid: 'h3',
        receiptnumber: 2001,
        receiptdate: getRelativeDate(-2),
        totalamount: 5200,
        paymentmodeid: '1',
        status: 'Pending',
        patientName: 'Virat Kohli',
        paymentModeName: 'Cash',
        items: [
            { subtreatmenttypeid: '401', description: 'Root Canal Treatment', qty: 1, rate: 4000, amount: 4000 },
            { subtreatmenttypeid: '403', description: 'Tooth Extraction', qty: 1, rate: 1200, amount: 1200 }
        ]
    },
    {
        receiptid: 'r4',
        hospitalid: 'h2',
        receiptnumber: 3001,
        receiptdate: getRelativeDate(-5),
        totalamount: 2300,
        paymentmodeid: '3',
        status: 'Paid',
        patientName: 'Rahul Dravid',
        paymentModeName: 'UPI',
        items: [
            { subtreatmenttypeid: '501', description: 'Plaster Cast (Arm/Leg)', qty: 1, rate: 1800, amount: 1800 },
            { subtreatmenttypeid: '101', description: 'General Consultation', qty: 1, rate: 500, amount: 500 }
        ]
    },
];


interface DataContextType {
    // Entities
    hospitalGroups: HospitalGroup[];
    hospitals: Hospital[];
    admins: User[];
    doctors: Doctor[];
    patients: Patient[];
    treatments: TreatmentType[];
    subTreatments: SubTreatmentType[];
    appointments: Appointment[];
    opdVisits: OPDVisit[];
    receipts: Receipt[];

    // Masters
    bloodGroups: BloodGroup[];
    specializations: Specialization[];

    // Actions
    addHospitalGroup: (g: any) => void;
    updateHospitalGroup: (id: string, g: Partial<HospitalGroup>) => void;
    addHospital: (h: any) => void;
    addAdmin: (u: any) => void; // For Group/Hospital Admins
    updateAdmin: (id: string, u: Partial<User>) => void;
    addDoctor: (d: any) => void;
    updateDoctor: (id: string, d: Partial<Doctor>) => void;
    addTreatmentType: (t: any) => void;
    updateTreatmentType: (id: string, t: Partial<TreatmentType>) => void;
    deleteTreatmentType: (id: string) => void;
    addSubTreatmentType: (st: any) => void;
    updateSubTreatmentType: (id: string, st: Partial<SubTreatmentType>) => void;
    deleteSubTreatmentType: (id: string) => void;

    // Existing Action Wrappers
    addPatient: (p: any) => void;
    updatePatient: (id: string, p: Partial<Patient>) => void;
    deleteDoctor: (id: string) => void;
    addAppointment: (a: any) => void;
    updateAppointment: (id: string, a: Partial<Appointment>) => void;
    deleteAppointment: (id: string) => void;
    updateOPDVisit: (id: string, d: Partial<OPDVisit>) => void;
    addReceipt: (r: any) => void;
    updateReceipt: (id: string, r: Partial<Receipt>) => void;
    updateHospital: (id: string, h: Partial<Hospital>) => void;
    deleteHospital: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    // State
    const [hospitalGroups, setHospitalGroups] = useState<HospitalGroup[]>(MOCK_GROUPS);
    const [hospitals, setHospitals] = useState<Hospital[]>(MOCK_HOSPITALS);
    const [admins, setAdmins] = useState<User[]>(MOCK_ADMINS);
    const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
    const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
    const [treatments, setTreatments] = useState<TreatmentType[]>(MOCK_TREATMENTS);
    const [subTreatments, setSubTreatments] = useState<SubTreatmentType[]>(MOCK_SUB_TREATMENTS);
    const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
    const [opdVisits, setOpdVisits] = useState<OPDVisit[]>(MOCK_OPD);
    const [receipts, setReceipts] = useState<Receipt[]>(MOCK_RECEIPTS);

    // -- Actions --

    const addHospitalGroup = (g: any) => {
        const newG = { ...g, hospitalgroupid: `g${hospitalGroups.length + 1}` };
        setHospitalGroups([...hospitalGroups, newG]);
    };

    const updateHospitalGroup = (id: string, g: Partial<HospitalGroup>) => {
        setHospitalGroups(groups => groups.map(group => group.hospitalgroupid === id ? { ...group, ...g } : group));
    };

    const addHospital = (h: any) => {
        const newH = { ...h, hospitalid: `h${hospitals.length + 1}` };
        setHospitals([...hospitals, newH]);
    };

    const addAdmin = (u: any) => {
        const newA = { ...u, userid: `admin${admins.length + 1}`, isactive: true };
        setAdmins([...admins, newA]);
    };

    const updateAdmin = (id: string, u: Partial<User>) => {
        setAdmins(prev => prev.map(a => a.userid === id ? { ...a, ...u } : a));
    };

    const addDoctor = (d: any) => {
        const newD = { ...d, doctorid: `d${doctors.length + 1}` };
        setDoctors([...doctors, newD]);
    };

    const updateDoctor = (id: string, d: Partial<Doctor>) => setDoctors(docs => docs.map(doc => doc.doctorid === id ? { ...doc, ...d } : doc));
    const deleteDoctor = (id: string) => setDoctors(docs => docs.filter(doc => doc.doctorid !== id));

    const addPatient = (p: any) => {
        const newP = { ...p, patientid: `p${patients.length + 1}`, patientno: 3000 + patients.length };
        setPatients([...patients, newP]);
    };
    const updatePatient = (id: string, p: Partial<Patient>) => setPatients(pats => pats.map(pat => pat.patientid === id ? { ...pat, ...p } : pat));

    const addTreatmentType = (t: any) => {
        const newT = { ...t, treatmenttypeid: `tt${treatments.length + 1}` };
        setTreatments([...treatments, newT]);
    };
    const updateTreatmentType = (id: string, t: Partial<TreatmentType>) => setTreatments(prev => prev.map(item => item.treatmenttypeid === id ? { ...item, ...t } : item));
    const deleteTreatmentType = (id: string) => setTreatments(prev => prev.filter(item => item.treatmenttypeid !== id));

    const addSubTreatmentType = (st: any) => {
        const newST = { ...st, subtreatmenttypeid: `st${subTreatments.length + 1}` };
        setSubTreatments([...subTreatments, newST]);
    };
    const updateSubTreatmentType = (id: string, st: Partial<SubTreatmentType>) => setSubTreatments(prev => prev.map(item => item.subtreatmenttypeid === id ? { ...item, ...st } : item));
    const deleteSubTreatmentType = (id: string) => setSubTreatments(prev => prev.filter(item => item.subtreatmenttypeid !== id));

    // Appointment Actions
    const addAppointment = (a: any) => setAppointments([...appointments, { ...a, appointmentid: `a${appointments.length + 1}` }]);
    const updateAppointment = (id: string, a: Partial<Appointment>) => setAppointments(apps => apps.map(app => app.appointmentid === id ? { ...app, ...a } : app));
    const deleteAppointment = (id: string) => setAppointments(apps => apps.filter(app => app.appointmentid !== id));

    // Others
    const updateOPDVisit = (id: string, d: Partial<OPDVisit>) => setOpdVisits(ov => ov.map(o => o.opdid === id ? { ...o, ...d } : o));
    const addReceipt = (r: any) => setReceipts([...receipts, { ...r, receiptid: `r${receipts.length + 1}` }]);
    const updateReceipt = (id: string, r: Partial<Receipt>) => setReceipts(prev => prev.map(item => item.receiptid === id ? { ...item, ...r } : item));

    const updateHospital = (id: string, h: Partial<Hospital>) => setHospitals(hosps => hosps.map(hh => hh.hospitalid === id ? { ...hh, ...h } : hh));
    const deleteHospital = (id: string) => setHospitals(hosps => hosps.filter(hh => hh.hospitalid !== id));

    return (
        <DataContext.Provider value={{
            hospitalGroups, hospitals, admins, doctors, patients,
            treatments, subTreatments, appointments, opdVisits, receipts,
            bloodGroups: BLOOD_GROUPS, specializations: SPECIALIZATIONS,
            addHospitalGroup, updateHospitalGroup, addHospital, addAdmin, updateAdmin,
            addDoctor, updateDoctor, deleteDoctor,
            addPatient, updatePatient,
            addTreatmentType, updateTreatmentType, deleteTreatmentType,
            addSubTreatmentType, updateSubTreatmentType, deleteSubTreatmentType,
            addAppointment, updateAppointment, deleteAppointment,
            updateOPDVisit, addReceipt, updateReceipt,
            updateHospital, deleteHospital
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within DataProvider");
    return context;
}
