import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { UpdateMedicalDto } from './dto/update-medical.dto';
import { CreateEmergencyContactDto } from './dto/create-emergency-contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-emergency-contact.dto';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { CounterService } from 'src/common/services/counter/counter.service';
import { GetPatientsQueryDto } from './dto/get-patients-query.dto';
import { PatientSearchDto } from './dto/patient-search.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PatientsService {
  constructor(
    private prisma: PrismaService,
    private counterService: CounterService,
  ) {}

  /**
   * Get the full patient profile (personal + contact + medical + emergency contacts).
   */
  async getMyProfile(userId: number) {
    const patient = await this.prisma.patients.findFirst({
      where: { user_id: userId },
      include: {
        patient_contact_details: {
          include: {
            cities: { select: { city_name: true } },
            states: { select: { state_name: true } },
          },
        },
        patient_medical_details: {
          include: {
            blood_groups: { select: { blood_group_name: true } },
          },
        },
        patient_emergency_contacts: {
          orderBy: [{ is_primary: 'desc' }, { emergency_contact_id: 'asc' }],
        },
        users_patients_user_idTousers: {
          select: { email: true, phone_number: true, profile_image_url: true },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    const contact = patient.patient_contact_details;
    const medical = patient.patient_medical_details;
    const user = patient.users_patients_user_idTousers;

    // Compute profile completion percentage
    const profileCompletion = this.computeProfileCompletion(
      patient,
      contact,
      medical,
    );

    return {
      data: {
        id: patient.patient_no,
        patient_id: patient.patient_id,
        name: patient.full_name,
        gender: patient.gender,
        dob: patient.dob,
        is_minor: patient.is_minor,
        status: patient.is_active ? 'Active' : 'Inactive',
        avatarUrl: user?.profile_image_url ?? null,
        profileCompletion,

        // Contact details
        email: contact?.email ?? user?.email ?? '',
        phone: contact?.phone_number ?? user?.phone_number ?? '',
        address: contact?.address ?? '',
        city: contact?.cities?.city_name ?? '',
        city_id: contact?.city_id ?? null,
        state: contact?.states?.state_name ?? '',
        state_id: contact?.state_id ?? null,
        pincode: contact?.pincode ?? '',

        // Medical details
        bloodGroup: medical?.blood_groups?.blood_group_name ?? '',
        blood_group_id: medical?.blood_group_id ?? null,
        allergies: medical?.allergies ?? '',
        chronicConditions: medical?.chronic_conditions ?? '',
        currentMedications: medical?.current_medications ?? '',

        // Emergency contacts
        emergencyContacts: patient.patient_emergency_contacts.map((ec) => ({
          id: ec.emergency_contact_id,
          name: ec.contact_name,
          relation: ec.relation ?? '',
          phone: ec.contact_number,
          isPrimary: ec.is_primary,
        })),
      },
    };
  }

  async registerPatient(dto: RegisterPatientDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      /*
    Get hospital group from receptionist
    */

      const employee = await tx.employees.findFirst({
        where: { user_id: userId },
      });

      if (!employee) {
        throw new BadRequestException('Employee not found');
      }
      if (!employee.hospital_group_id) {
        throw new BadRequestException(
          'Receptionist is not assigned to hospital group',
        );
      }

      const patientNo = await this.counterService.generatePatientNumber(
        tx,
        1,
        userId,
      );

      /*
    Get blood group id
    */

      const bloodGroup = await tx.blood_groups.findFirst({
        where: {
          blood_group_name: dto.bloodGroup,
        },
      });

      /*
    Create Patient
    */

      const patient = await tx.patients.create({
        data: {
          hospital_group_id: employee.hospital_group_id,

          patient_no: patientNo,

          full_name: dto.fullName,
          gender: dto.gender,

          dob: new Date(dto.dob),

          is_minor: false,
          is_walk_in: true,

          created_by: userId,
          modified_by: userId,
        },
      });

      /*
    Contact Details
    */

      await tx.patient_contact_details.create({
        data: {
          patient_id: patient.patient_id,

          address: dto.address,
          state_id: dto.state_id,
          city_id: dto.city_id,
          pincode: dto.pincode,

          phone_number: dto.phone,
          email: dto.email || null,
        },
      });

      /*
    Medical Details
    */

      await tx.patient_medical_details.create({
        data: {
          patient_id: patient.patient_id,

          blood_group_id: bloodGroup?.blood_group_id || null,

          allergies: dto.allergies,
          chronic_conditions: dto.chronicConditions,
          current_medications: dto.currentMedications,
        },
      });

      /*
    Emergency Contacts
    */

      if (dto.emergencyContacts?.length) {
        await tx.patient_emergency_contacts.createMany({
          data: dto.emergencyContacts.map((c) => ({
            patient_id: patient.patient_id,
            contact_name: c.name,
            contact_number: c.phone,
            relation: c.relation,
            is_primary: c.isPrimary || false,
          })),
        });
      }

      return {
        success: true,

        message: 'Patient registered successfully',

        data: {
          patient_id: patient.patient_id,
          patient_no: patient.patient_no,
        },
      };
    });
  }

  /**
   * Update personal information (name, gender, dob).
   */
  async updatePersonal(userId: number, dto: UpdatePersonalDto) {
    const patient = await this.findPatientByUserId(userId);

    const updateData: any = {};
    if (dto.full_name) updateData.full_name = dto.full_name;
    if (dto.gender) updateData.gender = dto.gender;
    if (dto.dob) {
      const dobDate = new Date(dto.dob);
      updateData.dob = dobDate;

      // Auto-compute is_minor
      const ageDifMs = Date.now() - dobDate.getTime();
      const ageDate = new Date(ageDifMs);
      updateData.is_minor = Math.abs(ageDate.getUTCFullYear() - 1970) < 18;
    }

    await this.prisma.patients.update({
      where: { patient_id: patient.patient_id },
      data: {
        ...updateData,
        modified_by: userId,
        modified_at: new Date(),
      },
    });

    return { message: 'Personal information updated successfully' };
  }

  /**
   * Update contact details (email, phone, address, city, state, pincode).
   */
  async updateContact(userId: number, dto: UpdateContactDto) {
    const patient = await this.findPatientByUserId(userId);

    await this.prisma.patient_contact_details.upsert({
      where: { patient_id: patient.patient_id },
      create: {
        patient_id: patient.patient_id,
        email: dto.email,
        phone_number: dto.phone_number,
        address: dto.address,
        city_id: dto.city_id,
        state_id: dto.state_id,
        pincode: dto.pincode,
      },
      update: {
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.phone_number !== undefined && {
          phone_number: dto.phone_number,
        }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.city_id !== undefined && { city_id: dto.city_id }),
        ...(dto.state_id !== undefined && { state_id: dto.state_id }),
        ...(dto.pincode !== undefined && { pincode: dto.pincode }),
        modified_at: new Date(),
      },
    });

    return { message: 'Contact details updated successfully' };
  }

  /**
   * Update medical details (blood group, allergies, chronic conditions, medications).
   */
  async updateMedical(userId: number, dto: UpdateMedicalDto) {
    const patient = await this.findPatientByUserId(userId);

    await this.prisma.patient_medical_details.upsert({
      where: { patient_id: patient.patient_id },
      create: {
        patient_id: patient.patient_id,
        blood_group_id: dto.blood_group_id,
        allergies: dto.allergies,
        chronic_conditions: dto.chronic_conditions,
        current_medications: dto.current_medications,
      },
      update: {
        ...(dto.blood_group_id !== undefined && {
          blood_group_id: dto.blood_group_id,
        }),
        ...(dto.allergies !== undefined && { allergies: dto.allergies }),
        ...(dto.chronic_conditions !== undefined && {
          chronic_conditions: dto.chronic_conditions,
        }),
        ...(dto.current_medications !== undefined && {
          current_medications: dto.current_medications,
        }),
        modified_at: new Date(),
      },
    });

    return { message: 'Medical details updated successfully' };
  }

  /**
   * List emergency contacts for the logged-in patient.
   */
  async getEmergencyContacts(userId: number) {
    const patient = await this.findPatientByUserId(userId);

    const contacts = await this.prisma.patient_emergency_contacts.findMany({
      where: { patient_id: patient.patient_id },
      orderBy: [{ is_primary: 'desc' }, { emergency_contact_id: 'asc' }],
    });

    return {
      data: contacts.map((ec) => ({
        id: ec.emergency_contact_id,
        name: ec.contact_name,
        relation: ec.relation ?? '',
        phone: ec.contact_number,
        isPrimary: ec.is_primary,
      })),
    };
  }

  /**
   * Add a new emergency contact.
   */
  async createEmergencyContact(userId: number, dto: CreateEmergencyContactDto) {
    const patient = await this.findPatientByUserId(userId);

    // If setting as primary, unset all others
    if (dto.is_primary) {
      await this.prisma.patient_emergency_contacts.updateMany({
        where: { patient_id: patient.patient_id, is_primary: true },
        data: { is_primary: false },
      });
    }

    const contact = await this.prisma.patient_emergency_contacts.create({
      data: {
        patient_id: patient.patient_id,
        contact_name: dto.contact_name,
        contact_number: dto.contact_number,
        relation: dto.relation,
        is_primary: dto.is_primary ?? false,
      },
    });

    return {
      message: 'Emergency contact added successfully',
      data: {
        id: contact.emergency_contact_id,
        name: contact.contact_name,
        relation: contact.relation ?? '',
        phone: contact.contact_number,
        isPrimary: contact.is_primary,
      },
    };
  }

  /**
   * Update an existing emergency contact.
   */
  async updateEmergencyContact(
    userId: number,
    contactId: number,
    dto: UpdateEmergencyContactDto,
  ) {
    const patient = await this.findPatientByUserId(userId);

    const existing = await this.prisma.patient_emergency_contacts.findUnique({
      where: { emergency_contact_id: contactId },
    });

    if (!existing || existing.patient_id !== patient.patient_id) {
      throw new NotFoundException('Emergency contact not found.');
    }

    // If setting as primary, unset all others
    if (dto.is_primary) {
      await this.prisma.patient_emergency_contacts.updateMany({
        where: {
          patient_id: patient.patient_id,
          is_primary: true,
          emergency_contact_id: { not: contactId },
        },
        data: { is_primary: false },
      });
    }

    await this.prisma.patient_emergency_contacts.update({
      where: { emergency_contact_id: contactId },
      data: {
        ...(dto.contact_name !== undefined && {
          contact_name: dto.contact_name,
        }),
        ...(dto.contact_number !== undefined && {
          contact_number: dto.contact_number,
        }),
        ...(dto.relation !== undefined && { relation: dto.relation }),
        ...(dto.is_primary !== undefined && { is_primary: dto.is_primary }),
        modified_at: new Date(),
      },
    });

    return { message: 'Emergency contact updated successfully' };
  }

  /**
   * Delete an emergency contact.
   */
  async deleteEmergencyContact(userId: number, contactId: number) {
    const patient = await this.findPatientByUserId(userId);

    const existing = await this.prisma.patient_emergency_contacts.findUnique({
      where: { emergency_contact_id: contactId },
    });

    if (!existing || existing.patient_id !== patient.patient_id) {
      throw new NotFoundException('Emergency contact not found.');
    }

    await this.prisma.patient_emergency_contacts.delete({
      where: { emergency_contact_id: contactId },
    });

    return { message: 'Emergency contact deleted successfully' };
  }

  async getAllPatients(query: GetPatientsQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        {
          full_name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },

        {
          patient_no: {
            contains: query.search,
            mode: 'insensitive',
          },
        },

        {
          patient_contact_details: {
            phone_number: {
              contains: query.search,
            },
          },
        },
      ];
    }

    const [patients, total] = await this.prisma.$transaction([
      this.prisma.patients.findMany({
        where,

        skip,
        take: limit,

        orderBy: {
          created_at: 'desc',
        },

        include: {
          users_patients_user_idTousers: true,

          patient_contact_details: true,

          patient_medical_details: {
            include: {
              blood_groups: true,
            },
          },

          patient_emergency_contacts: true,
        },
      }),

      this.prisma.patients.count({ where }),
    ]);

    return {
      success: true,

      data: patients,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPatientSummary(patientId: number) {
    const patient = await this.prisma.patients.findUnique({
      where: { patient_id: patientId },
      include: {
        patient_contact_details: {
          include: {
            cities: true,
            states: true,
          },
        },
        patient_medical_details: {
          include: {
            blood_groups: true,
          },
        },
        patient_emergency_contacts: {
          where: { is_primary: true },
          take: 1,
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    /*
    Get Last OPD Visit
    */

    const lastVisit = await this.prisma.opd_visits.findFirst({
      where: {
        patient_id: patientId,
      },
      orderBy: {
        visit_datetime: 'desc',
      },
      select: {
        visit_datetime: true,
        opd_no: true,
      },
    });

    /*
    Calculate Age
    */

    const dob = new Date(patient.dob);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return {
      patient_id: patient.patient_id,
      patient_no: patient.patient_no,
      name: patient.full_name,

      age,
      gender: patient.gender,

      blood_group:
        patient.patient_medical_details?.blood_groups?.blood_group_name ?? null,

      allergies: patient.patient_medical_details?.allergies ?? null,

      chronic_conditions:
        patient.patient_medical_details?.chronic_conditions ?? null,

      current_medications:
        patient.patient_medical_details?.current_medications ?? null,

      phone: patient.patient_contact_details?.phone_number ?? null,

      email: patient.patient_contact_details?.email ?? null,

      address: patient.patient_contact_details?.address ?? null,

      city: patient.patient_contact_details?.cities?.city_name ?? null,

      state: patient.patient_contact_details?.states?.state_name ?? null,

      pincode: patient.patient_contact_details?.pincode ?? null,

      emergency_contact: patient.patient_emergency_contacts?.[0]
        ? {
            name: patient.patient_emergency_contacts[0].contact_name,
            phone: patient.patient_emergency_contacts[0].contact_number,
            relation: patient.patient_emergency_contacts[0].relation,
          }
        : null,
      last_visit: lastVisit ? lastVisit.visit_datetime : null,
      // last_visit: lastVisit
      //   ? {
      //       opd_no: lastVisit.opd_no,
      //       date: lastVisit.visit_datetime,
      //     }
      //   : null,
    };
  }

  async searchPatients(query: PatientSearchDto) {
    const { search, page, limit } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.patientsWhereInput = search
      ? {
          OR: [
            { full_name: { contains: search, mode: 'insensitive' } },
            { patient_no: { contains: search, mode: 'insensitive' } },
            {
              patient_contact_details: {
                phone_number: { contains: search },
              },
            },
          ],
        }
      : {};

    const [patients, total] = await this.prisma.$transaction([
      this.prisma.patients.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient_contact_details: true,
          patient_medical_details: {
            include: {
              blood_groups: true,
            },
          },
          opd_visits: {
            orderBy: { visit_datetime: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.patients.count({ where }),
    ]);

    const data = patients.map((p) => {
      const dob = new Date(p.dob);
      const age = new Date().getFullYear() - dob.getFullYear();

      return {
        id: p.patient_id,
        patientNo: p.patient_no,
        name: p.full_name,
        phone: p.patient_contact_details?.phone_number,
        age,
        gender: p.gender,
        bloodGroup: p.patient_medical_details?.blood_groups?.blood_group_name,
        allergies: p.patient_medical_details?.allergies,
        chronicConditions: p.patient_medical_details?.chronic_conditions,
        lastVisit: p.opd_visits[0]?.visit_datetime,
      };
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async getOpdHistory(patientId: number) {
    const visits = await this.prisma.opd_visits.findMany({
      where: { patient_id: patientId },

      orderBy: {
        visit_datetime: 'desc',
      },

      include: {
        doctors: {
          include: {
            users_doctors_user_idTousers: true,
          },
        },
        opd_diagnoses: {
          include: {
            diagnoses: true,
          },
        },
      },
    });

    const data = visits.map((v) => ({
      opdNo: v.opd_no,
      date: v.visit_datetime,
      doctorId: v.doctor_id,
      doctorName: v.doctors.users_doctors_user_idTousers.full_name,
      diagnosis: v.opd_diagnoses[0]?.diagnoses?.diagnosis_name,
    }));

    return { data };
  }

  // ─── Helpers ────────────────────────────────────────────────

  private async findPatientByUserId(userId: number) {
    const patient = await this.prisma.patients.findFirst({
      where: { user_id: userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile not found.');
    }

    return patient;
  }

  /**
   * Compute profile completion as a percentage (0-100).
   */
  private computeProfileCompletion(
    patient: any,
    contact: any,
    medical: any,
  ): number {
    let filled = 0;
    const total = 10;

    // Personal (3 fields)
    if (patient.full_name) filled++;
    if (patient.gender) filled++;
    if (patient.dob) filled++;

    // Contact (4 fields)
    if (contact?.phone_number || contact?.email) filled++;
    if (contact?.address) filled++;
    if (contact?.city_id) filled++;
    if (contact?.pincode) filled++;

    // Medical (3 fields)
    if (medical?.blood_group_id) filled++;
    if (medical?.allergies) filled++;
    if (medical?.chronic_conditions || medical?.current_medications) filled++;

    return Math.round((filled / total) * 100);
  }
}
