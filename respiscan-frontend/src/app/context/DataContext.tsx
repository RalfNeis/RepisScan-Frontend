import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────

export type PatientStatus = 'Positive' | 'Negative' | 'Pending';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  civilStatus: string;
  nationality: string;
  occupation: string;
  contactNumber: string;
  email: string;
  residentialAddress: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyContact: string;
  chiefComplaint: string;
  medicalHistory: string[];
  allergies: string;
  currentMedications: string;
  smokingStatus: string;
  referringPhysician: string;
  philhealthNumber: string;
  registeredAt: string;
  lastScanDate?: string;
  status: PatientStatus;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  jobTitle: string;
  department: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface DiagnosisRecord {
  id: string;
  patientId: string;
  patientName: string;
  performedBy: string;
  date: string;
  result: 'Positive' | 'Negative';
  confidence: number;
  radiologistNotes: string;
  gradCamPath?: string;
}

interface DataContextType {
  patients: Patient[];
  employees: Employee[];
  diagnosisRecords: DiagnosisRecord[];
  addPatient: (patient: Omit<Patient, 'id' | 'registeredAt' | 'status'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addDiagnosisRecord: (record: Omit<DiagnosisRecord, 'id'>) => DiagnosisRecord;
  getPatientById: (id: string) => Patient | undefined;
  getEmployeeByCredentials: (email: string, password: string) => Employee | undefined;
}

// ─── Seed Data ──────────────────────────────────────────────────────────────

const seedEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Dr. Maria Santos',
    email: 'admin@repiscan.com',
    password: 'admin123',
    role: 'admin',
    jobTitle: 'Administrator',
    department: 'Radiology',
    status: 'Active',
    createdAt: '2024-01-10',
  },
  {
    id: 'EMP-002',
    name: 'Juan Dela Cruz',
    email: 'employee@repiscan.com',
    password: 'employee123',
    role: 'employee',
    jobTitle: 'Radiologic Technologist',
    department: 'Imaging',
    status: 'Active',
    createdAt: '2024-02-14',
  },
  {
    id: 'EMP-003',
    name: 'Ana Reyes',
    email: 'ana.reyes@repiscan.com',
    password: 'reyes123',
    role: 'employee',
    jobTitle: 'Pulmonologist',
    department: 'Respiratory',
    status: 'Inactive',
    createdAt: '2024-03-01',
  },
  {
    id: 'EMP-004',
    name: 'Dr. Carlos Mendoza',
    email: 'carlos.mendoza@repiscan.com',
    password: 'mendoza123',
    role: 'admin',
    jobTitle: 'Administrator',
    department: 'Management',
    status: 'Active',
    createdAt: '2024-01-05',
  },
];

const seedPatients: Patient[] = [
  {
    id: 'PT-2024-001',
    firstName: 'Antonio',
    lastName: 'Garcia',
    middleName: 'R.',
    dateOfBirth: '1979-03-15',
    gender: 'Male',
    civilStatus: 'Married',
    nationality: 'Filipino',
    occupation: 'Teacher',
    contactNumber: '+63 912 345 6789',
    email: 'antonio.garcia@email.com',
    residentialAddress: '123 Rizal St., Quezon City, Metro Manila',
    emergencyName: 'Maria Garcia',
    emergencyRelationship: 'Spouse',
    emergencyContact: '+63 912 999 0000',
    chiefComplaint: 'Persistent cough and fever for 5 days',
    medicalHistory: ['Hypertension'],
    allergies: 'None',
    currentMedications: 'Amlodipine 5mg OD',
    smokingStatus: 'Former smoker',
    referringPhysician: 'Dr. Lopez',
    philhealthNumber: '01-234567890-1',
    registeredAt: '2026-06-01',
    lastScanDate: '2026-06-15',
    status: 'Positive',
  },
  {
    id: 'PT-2024-002',
    firstName: 'Carmen',
    lastName: 'Bautista',
    middleName: 'L.',
    dateOfBirth: '1962-07-22',
    gender: 'Female',
    civilStatus: 'Widowed',
    nationality: 'Filipino',
    occupation: 'Retired',
    contactNumber: '+63 917 654 3210',
    email: 'carmen.bautista@email.com',
    residentialAddress: '456 Mabini Ave., Pasig City, Metro Manila',
    emergencyName: 'Luis Bautista',
    emergencyRelationship: 'Child',
    emergencyContact: '+63 917 111 2222',
    chiefComplaint: 'Shortness of breath',
    medicalHistory: ['Diabetes Mellitus', 'Cardiac Disease'],
    allergies: 'Penicillin',
    currentMedications: 'Metformin 500mg BD, Losartan 50mg OD',
    smokingStatus: 'Non-smoker',
    referringPhysician: '',
    philhealthNumber: '02-987654321-0',
    registeredAt: '2026-06-02',
    lastScanDate: '2026-06-12',
    status: 'Negative',
  },
  {
    id: 'PT-2024-003',
    firstName: 'Roberto',
    lastName: 'Villanueva',
    middleName: 'M.',
    dateOfBirth: '1986-11-05',
    gender: 'Male',
    civilStatus: 'Single',
    nationality: 'Filipino',
    occupation: 'Engineer',
    contactNumber: '+63 920 777 8888',
    email: 'roberto.v@email.com',
    residentialAddress: '789 Luna Blvd., Makati City, Metro Manila',
    emergencyName: 'Rosa Villanueva',
    emergencyRelationship: 'Parent',
    emergencyContact: '+63 920 333 4444',
    chiefComplaint: 'Routine chest X-ray',
    medicalHistory: [],
    allergies: 'None',
    currentMedications: 'None',
    smokingStatus: 'Current smoker',
    referringPhysician: 'Dr. Tan',
    philhealthNumber: '03-111222333-4',
    registeredAt: '2026-06-04',
    lastScanDate: '2026-06-10',
    status: 'Pending',
  },
  {
    id: 'PT-2024-004',
    firstName: 'Elena',
    lastName: 'Cruz',
    middleName: 'T.',
    dateOfBirth: '1969-04-18',
    gender: 'Female',
    civilStatus: 'Married',
    nationality: 'Filipino',
    occupation: 'Nurse',
    contactNumber: '+63 918 222 3333',
    email: 'elena.cruz@email.com',
    residentialAddress: '321 Bonifacio St., Caloocan City',
    emergencyName: 'Pedro Cruz',
    emergencyRelationship: 'Spouse',
    emergencyContact: '+63 918 000 1111',
    chiefComplaint: 'Annual check-up CXR',
    medicalHistory: ['Asthma / COPD'],
    allergies: 'Sulfa drugs',
    currentMedications: 'Salbutamol inhaler PRN',
    smokingStatus: 'Non-smoker',
    referringPhysician: '',
    philhealthNumber: '04-555666777-8',
    registeredAt: '2026-06-05',
    lastScanDate: '2026-06-08',
    status: 'Negative',
  },
  {
    id: 'PT-2024-005',
    firstName: 'Miguel',
    lastName: 'Torres',
    middleName: 'A.',
    dateOfBirth: '1953-09-30',
    gender: 'Male',
    civilStatus: 'Married',
    nationality: 'Filipino',
    occupation: 'Farmer',
    contactNumber: '+63 919 444 5555',
    email: '',
    residentialAddress: '55 Aguinaldo St., Cavite City, Cavite',
    emergencyName: 'Lourdes Torres',
    emergencyRelationship: 'Spouse',
    emergencyContact: '+63 919 666 7777',
    chiefComplaint: 'Chronic cough, weight loss, night sweats',
    medicalHistory: ['Tuberculosis', 'Previous Pneumonia'],
    allergies: 'None',
    currentMedications: 'Anti-TB medications',
    smokingStatus: 'Former smoker',
    referringPhysician: 'Dr. Reyes',
    philhealthNumber: '05-999888777-6',
    registeredAt: '2026-06-06',
    lastScanDate: '2026-06-05',
    status: 'Positive',
  },
];

const seedDiagnosisRecords: DiagnosisRecord[] = [
  {
    id: 'DX-001',
    patientId: 'PT-2024-001',
    patientName: 'Antonio Garcia',
    performedBy: 'Dr. Maria Santos',
    date: '2026-06-15',
    result: 'Positive',
    confidence: 94.2,
    radiologistNotes: 'Consolidation observed in right middle lobe consistent with bacterial pneumonia. Grad-CAM confirms model focus on opacity.',
  },
  {
    id: 'DX-002',
    patientId: 'PT-2024-002',
    patientName: 'Carmen Bautista',
    performedBy: 'Juan Dela Cruz',
    date: '2026-06-12',
    result: 'Negative',
    confidence: 87.5,
    radiologistNotes: 'No significant consolidation or infiltrates noted. Lung fields clear bilaterally.',
  },
  {
    id: 'DX-003',
    patientId: 'PT-2024-004',
    patientName: 'Elena Cruz',
    performedBy: 'Juan Dela Cruz',
    date: '2026-06-08',
    result: 'Negative',
    confidence: 91.0,
    radiologistNotes: 'Hyperinflation noted consistent with COPD history. No acute pneumonia findings.',
  },
  {
    id: 'DX-004',
    patientId: 'PT-2024-005',
    patientName: 'Miguel Torres',
    performedBy: 'Dr. Maria Santos',
    date: '2026-06-05',
    result: 'Positive',
    confidence: 97.8,
    radiologistNotes: 'Dense infiltrates in bilateral upper lobes. Consistent with active pulmonary infection. Recommend urgent specialist review.',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function generatePatientId(patients: Patient[]): string {
  const year = new Date().getFullYear();
  const nums = patients
    .map(p => parseInt(p.id.split('-')[2] ?? '0', 10))
    .filter(n => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `PT-${year}-${String(next).padStart(3, '0')}`;
}

function generateEmployeeId(employees: Employee[]): string {
  const nums = employees
    .map(e => parseInt(e.id.split('-')[1] ?? '0', 10))
    .filter(n => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `EMP-${String(next).padStart(3, '0')}`;
}

function generateDiagnosisId(records: DiagnosisRecord[]): string {
  const nums = records
    .map(r => parseInt(r.id.split('-')[1] ?? '0', 10))
    .filter(n => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `DX-${String(next).padStart(3, '0')}`;
}

function loadFromStorage<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
  } catch {
    // ignore parse errors
  }
  return seed;
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Context ────────────────────────────────────────────────────────────────

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() =>
    loadFromStorage('repiscan_patients', seedPatients)
  );
  const [employees, setEmployees] = useState<Employee[]>(() =>
    loadFromStorage('repiscan_employees', seedEmployees)
  );
  const [diagnosisRecords, setDiagnosisRecords] = useState<DiagnosisRecord[]>(() =>
    loadFromStorage('repiscan_diagnosis', seedDiagnosisRecords)
  );

  useEffect(() => { saveToStorage('repiscan_patients', patients); }, [patients]);
  useEffect(() => { saveToStorage('repiscan_employees', employees); }, [employees]);
  useEffect(() => { saveToStorage('repiscan_diagnosis', diagnosisRecords); }, [diagnosisRecords]);

  const addPatient = (data: Omit<Patient, 'id' | 'registeredAt' | 'status'>): Patient => {
    const newPatient: Patient = {
      ...data,
      id: generatePatientId(patients),
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const addEmployee = (data: Omit<Employee, 'id' | 'createdAt'>): Employee => {
    const newEmployee: Employee = {
      ...data,
      id: generateEmployeeId(employees),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const addDiagnosisRecord = (data: Omit<DiagnosisRecord, 'id'>): DiagnosisRecord => {
    const newRecord: DiagnosisRecord = {
      ...data,
      id: generateDiagnosisId(diagnosisRecords),
    };
    setDiagnosisRecords(prev => [...prev, newRecord]);
    // Update the patient's status and last scan date
    updatePatient(data.patientId, {
      status: data.result,
      lastScanDate: data.date,
    });
    return newRecord;
  };

  const getPatientById = (id: string) => patients.find(p => p.id === id);

  const getEmployeeByCredentials = (email: string, password: string) =>
    employees.find(
      e => e.email.toLowerCase() === email.toLowerCase() && e.password === password && e.status === 'Active'
    );

  return (
    <DataContext.Provider
      value={{
        patients,
        employees,
        diagnosisRecords,
        addPatient,
        updatePatient,
        deletePatient,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addDiagnosisRecord,
        getPatientById,
        getEmployeeByCredentials,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
