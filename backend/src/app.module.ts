import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { GroupAdminsModule } from './modules/group-admins/group-admins.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { DiagnosisModule } from './modules/diagnosis/diagnosis.module';
import { TreatmentTypesModule } from './modules/treatment-types/treatment-types.module';
import { MedicalTestsModule } from './modules/medical-tests/medical-tests.module';
import { MedicinesModule } from './modules/medicines/medicines.module';
import { ProceduresModule } from './modules/procedures/procedures.module';
import { HospitalAdminsModule } from './modules/hospital-admins/hospital-admins.module';
import { LocationModule } from './modules/location/location.module';
import { HospitalsModule } from './modules/hospitals/hospitals.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { PatientsModule } from './modules/patients/patients.module';
import { DoctorsAdminModule } from './modules/doctors/doctors.module';
import { ReceptionistsAdminModule } from './modules/receptionists/receptionists.module';
import { CommonModule } from './common/common.module';
import { OpdModule } from './modules/opd/opd.module';
import { DoctorOpdModule } from './modules/doctor-opd/doctor-opd.module';
import { OpdConsultationModule } from './modules/opd-consultation/opd-consultation.module';
import { EventsModule } from './modules/events/events.module';
import { BillingModule } from './modules/billing/billing.module';
import { BillingPaymentsModule } from './modules/billing-payments/billing-payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    GroupsModule,
    GroupAdminsModule,
    DepartmentsModule,
    DiagnosisModule,
    TreatmentTypesModule,
    MedicalTestsModule,
    MedicinesModule,
    ProceduresModule,
    HospitalAdminsModule,
    LocationModule,
    HospitalsModule,
    AuthModule,
    AppointmentsModule,
    PatientsModule,
    DoctorsAdminModule,
    ReceptionistsAdminModule,
    CommonModule,
    OpdModule,
    DoctorOpdModule,
    OpdConsultationModule,
    EventsModule,
    BillingModule,
    BillingPaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
