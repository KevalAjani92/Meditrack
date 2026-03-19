-- CreateTable
CREATE TABLE "appointments" (
    "appointment_id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "appointment_no" VARCHAR(50) NOT NULL,
    "appointment_date" DATE NOT NULL,
    "appointment_time" TIME(6) NOT NULL,
    "appointment_status" VARCHAR(30) NOT NULL,
    "remarks" VARCHAR(250),
    "is_active" BOOLEAN DEFAULT true,
    "deleted_at" TIMESTAMP(6),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("appointment_id")
);

-- CreateTable
CREATE TABLE "bill_items" (
    "bill_item_id" SERIAL NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "item_type" VARCHAR(50) NOT NULL,
    "reference_id" INTEGER,
    "item_description" VARCHAR(250) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bill_items_pkey" PRIMARY KEY ("bill_item_id")
);

-- CreateTable
CREATE TABLE "billing" (
    "bill_id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "bill_number" VARCHAR(50) NOT NULL,
    "bill_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "subtotal_amount" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "payment_status" VARCHAR(50) NOT NULL,
    "billing_status" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "deleted_at" TIMESTAMP(6),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_pkey" PRIMARY KEY ("bill_id")
);

-- CreateTable
CREATE TABLE "blood_groups" (
    "blood_group_id" SERIAL NOT NULL,
    "blood_group_name" VARCHAR(10) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blood_groups_pkey" PRIMARY KEY ("blood_group_id")
);

-- CreateTable
CREATE TABLE "cities" (
    "city_id" SERIAL NOT NULL,
    "state_id" INTEGER NOT NULL,
    "city_name" VARCHAR(150) NOT NULL,
    "city_code" VARCHAR(20) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("city_id")
);

-- CreateTable
CREATE TABLE "daily_queues" (
    "daily_queue_id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "queue_date" DATE NOT NULL,
    "current_token" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL,
    "opened_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMPTZ(6),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_queues_pkey" PRIMARY KEY ("daily_queue_id")
);

-- CreateTable
CREATE TABLE "departments_master" (
    "department_id" SERIAL NOT NULL,
    "department_code" VARCHAR(50) NOT NULL,
    "department_name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(250),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_master_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "diagnoses" (
    "diagnosis_id" SERIAL NOT NULL,
    "diagnosis_code" VARCHAR(50) NOT NULL,
    "diagnosis_name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "department_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagnoses_pkey" PRIMARY KEY ("diagnosis_id")
);

-- CreateTable
CREATE TABLE "doctor_availability" (
    "availability_id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "max_appointments" INTEGER NOT NULL,
    "is_available" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctor_availability_pkey" PRIMARY KEY ("availability_id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "doctor_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "specialization_id" INTEGER NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "qualification" VARCHAR(150) NOT NULL,
    "medical_license_no" VARCHAR(100) NOT NULL,
    "experience_years" INTEGER NOT NULL DEFAULT 0,
    "consultation_fees" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_available" BOOLEAN NOT NULL DEFAULT false,
    "description" VARCHAR(500),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("doctor_id")
);

-- CreateTable
CREATE TABLE "employees" (
    "employee_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "hospital_group_id" INTEGER,
    "hospital_id" INTEGER,
    "employee_type" VARCHAR(30) NOT NULL,
    "joining_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "followups" (
    "followup_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "recommended_date" DATE NOT NULL,
    "reason" VARCHAR(250) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "followups_pkey" PRIMARY KEY ("followup_id")
);

-- CreateTable
CREATE TABLE "hospital_counters" (
    "counter_id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "counter_type" VARCHAR(50) NOT NULL,
    "prefix" VARCHAR(20),
    "current_value" INTEGER NOT NULL DEFAULT 0,
    "reset_policy" VARCHAR(50) NOT NULL,
    "last_reset_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_counters_pkey" PRIMARY KEY ("counter_id")
);

-- CreateTable
CREATE TABLE "hospital_departments" (
    "hospital_department_id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_departments_pkey" PRIMARY KEY ("hospital_department_id")
);

-- CreateTable
CREATE TABLE "hospital_diagnoses" (
    "hospital_diagnosis_id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "diagnosis_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_diagnoses_pkey" PRIMARY KEY ("hospital_diagnosis_id")
);

-- CreateTable
CREATE TABLE "hospital_groups" (
    "hospital_group_id" SERIAL NOT NULL,
    "group_name" VARCHAR(250) NOT NULL,
    "group_code" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500),
    "registration_no" VARCHAR(100),
    "contact_phone" VARCHAR(15),
    "contact_email" VARCHAR(150),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_groups_pkey" PRIMARY KEY ("hospital_group_id")
);

-- CreateTable
CREATE TABLE "hospital_medicines" (
    "hospital_medicine_id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "medicine_id" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_medicines_pkey" PRIMARY KEY ("hospital_medicine_id")
);

-- CreateTable
CREATE TABLE "hospital_procedures" (
    "hospital_procedure_id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "procedure_id" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_procedures_pkey" PRIMARY KEY ("hospital_procedure_id")
);

-- CreateTable
CREATE TABLE "hospital_tests" (
    "hospital_test_id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "test_id" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_tests_pkey" PRIMARY KEY ("hospital_test_id")
);

-- CreateTable
CREATE TABLE "hospital_treatments" (
    "hospital_treatment_id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "treatment_type_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_treatments_pkey" PRIMARY KEY ("hospital_treatment_id")
);

-- CreateTable
CREATE TABLE "hospitals" (
    "hospital_id" SERIAL NOT NULL,
    "hospital_group_id" INTEGER NOT NULL,
    "hospital_name" VARCHAR(250) NOT NULL,
    "hospital_code" VARCHAR(50) NOT NULL,
    "registration_validity_months" INTEGER NOT NULL DEFAULT 0,
    "receptionist_contact" VARCHAR(20) NOT NULL,
    "opening_date" DATE NOT NULL,
    "address" VARCHAR(500) NOT NULL,
    "city_id" INTEGER,
    "state_id" INTEGER,
    "pincode" VARCHAR(10) NOT NULL,
    "description" VARCHAR(250),
    "registration_no" VARCHAR(100),
    "license_no" VARCHAR(100),
    "gst_no" VARCHAR(20),
    "contact_phone" VARCHAR(20),
    "contact_email" VARCHAR(150),
    "opening_time" TIME(6),
    "closing_time" TIME(6),
    "is_24by7" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospitals_pkey" PRIMARY KEY ("hospital_id")
);

-- CreateTable
CREATE TABLE "medicines" (
    "medicine_id" SERIAL NOT NULL,
    "medicine_code" VARCHAR(50) NOT NULL,
    "medicine_name" VARCHAR(200) NOT NULL,
    "medicine_type" VARCHAR(100) NOT NULL,
    "strength" VARCHAR(100) NOT NULL,
    "manufacturer" VARCHAR(200),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("medicine_id")
);

-- CreateTable
CREATE TABLE "opd_diagnoses" (
    "opd_diagnosis_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "diagnosis_id" INTEGER NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "remarks" VARCHAR(250),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opd_diagnoses_pkey" PRIMARY KEY ("opd_diagnosis_id")
);

-- CreateTable
CREATE TABLE "opd_procedures" (
    "opd_procedure_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "procedure_id" INTEGER NOT NULL,
    "procedure_date" DATE NOT NULL,
    "remarks" VARCHAR(250),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opd_procedures_pkey" PRIMARY KEY ("opd_procedure_id")
);

-- CreateTable
CREATE TABLE "opd_tests" (
    "opd_test_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "test_id" INTEGER NOT NULL,
    "test_status" VARCHAR(50) NOT NULL,
    "result_summary" TEXT,
    "ordered_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "opd_tests_pkey" PRIMARY KEY ("opd_test_id")
);

-- CreateTable
CREATE TABLE "opd_visits" (
    "opd_id" SERIAL NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "appointment_id" INTEGER,
    "opd_no" VARCHAR(50) NOT NULL,
    "visit_datetime" TIMESTAMPTZ(6) NOT NULL,
    "is_follow_up" BOOLEAN NOT NULL DEFAULT false,
    "old_opd_id" INTEGER,
    "chief_complaint" VARCHAR(500) NOT NULL,
    "clinical_notes" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "deleted_at" TIMESTAMP(6),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opd_visits_pkey" PRIMARY KEY ("opd_id")
);

-- CreateTable
CREATE TABLE "patient_contact_details" (
    "patient_id" INTEGER NOT NULL,
    "address" VARCHAR(500),
    "city_id" INTEGER,
    "state_id" INTEGER,
    "pincode" VARCHAR(10),
    "phone_number" VARCHAR(20),
    "email" VARCHAR(150),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_contact_details_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "patient_emergency_contacts" (
    "emergency_contact_id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "contact_name" VARCHAR(150) NOT NULL,
    "contact_number" VARCHAR(20) NOT NULL,
    "relation" VARCHAR(50),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_emergency_contacts_pkey" PRIMARY KEY ("emergency_contact_id")
);

-- CreateTable
CREATE TABLE "patient_medical_details" (
    "patient_id" INTEGER NOT NULL,
    "blood_group_id" INTEGER,
    "allergies" TEXT,
    "chronic_conditions" TEXT,
    "current_medications" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_medical_details_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "patients" (
    "patient_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "hospital_group_id" INTEGER NOT NULL,
    "patient_no" VARCHAR(30) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "dob" DATE NOT NULL,
    "is_minor" BOOLEAN NOT NULL DEFAULT false,
    "is_walk_in" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_profile_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "payment_modes" (
    "payment_mode_id" SERIAL NOT NULL,
    "payment_mode_name" VARCHAR(100) NOT NULL,
    "requires_reference" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "payment_modes_pkey" PRIMARY KEY ("payment_mode_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" SERIAL NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "payment_mode_id" INTEGER NOT NULL,
    "payment_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount_paid" DECIMAL(10,2) NOT NULL,
    "reference_number" VARCHAR(100),
    "payment_status" VARCHAR(50) NOT NULL,
    "received_by" INTEGER NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "deleted_at" TIMESTAMP(6),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "prescription_items" (
    "prescription_item_id" SERIAL NOT NULL,
    "prescription_id" INTEGER NOT NULL,
    "medicine_id" INTEGER NOT NULL,
    "dosage" VARCHAR(100) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "instructions" VARCHAR(250),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescription_items_pkey" PRIMARY KEY ("prescription_item_id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "prescription_id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "prescribed_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "notes" VARCHAR(500),
    "is_active" BOOLEAN DEFAULT true,
    "deleted_at" TIMESTAMP(6),
    "created_by" INTEGER,
    "modified_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("prescription_id")
);

-- CreateTable
CREATE TABLE "procedures" (
    "procedure_id" SERIAL NOT NULL,
    "procedure_code" VARCHAR(50) NOT NULL,
    "procedure_name" VARCHAR(200) NOT NULL,
    "treatment_type_id" INTEGER NOT NULL,
    "description" VARCHAR(500),
    "is_surgical" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "procedures_pkey" PRIMARY KEY ("procedure_id")
);

-- CreateTable
CREATE TABLE "queue_tokens" (
    "token_id" SERIAL NOT NULL,
    "daily_queue_id" INTEGER NOT NULL,
    "opd_id" INTEGER,
    "token_number" INTEGER NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "queue_tokens_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(250),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "specializations" (
    "specialization_id" SERIAL NOT NULL,
    "specialization_name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(250),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("specialization_id")
);

-- CreateTable
CREATE TABLE "states" (
    "state_id" SERIAL NOT NULL,
    "state_name" VARCHAR(100) NOT NULL,
    "state_code" VARCHAR(10) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "states_pkey" PRIMARY KEY ("state_id")
);

-- CreateTable
CREATE TABLE "tests" (
    "test_id" SERIAL NOT NULL,
    "test_code" VARCHAR(50) NOT NULL,
    "test_name" VARCHAR(200) NOT NULL,
    "test_type" VARCHAR(100) NOT NULL,
    "department_id" INTEGER NOT NULL,
    "description" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("test_id")
);

-- CreateTable
CREATE TABLE "treatment_types" (
    "treatment_type_id" SERIAL NOT NULL,
    "department_id" INTEGER NOT NULL,
    "treatment_code" VARCHAR(50) NOT NULL,
    "treatment_name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "treatment_types_pkey" PRIMARY KEY ("treatment_type_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role_id" INTEGER NOT NULL,
    "profile_image_url" VARCHAR(255),
    "refresh_token" TEXT,
    "refresh_token_expires_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMPTZ(6),
    "password_changed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_appointment_no" ON "appointments"("appointment_no");

-- CreateIndex
CREATE UNIQUE INDEX "billing_bill_number_key" ON "billing"("bill_number");

-- CreateIndex
CREATE UNIQUE INDEX "uq_blood_group" ON "blood_groups"("blood_group_name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_city_state" ON "cities"("state_id", "city_name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_daily_queue" ON "daily_queues"("hospital_id", "doctor_id", "queue_date");

-- CreateIndex
CREATE UNIQUE INDEX "uq_department_code" ON "departments_master"("department_code");

-- CreateIndex
CREATE UNIQUE INDEX "diagnoses_diagnosis_code_key" ON "diagnoses"("diagnosis_code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_doctor_day" ON "doctor_availability"("doctor_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "uq_doctor_user" ON "doctors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_doctor_license" ON "doctors"("medical_license_no");

-- CreateIndex
CREATE UNIQUE INDEX "employees_user_id_key" ON "employees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_counter" ON "hospital_counters"("hospital_id", "counter_type");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hospital_department" ON "hospital_departments"("hospital_id", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hospital_diagnosis" ON "hospital_diagnoses"("hospital_id", "diagnosis_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_group_name" ON "hospital_groups"("group_name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_group_code" ON "hospital_groups"("group_code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_group_reg" ON "hospital_groups"("registration_no");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hospital_medicine" ON "hospital_medicines"("hospital_id", "medicine_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hospital_procedure" ON "hospital_procedures"("hospital_id", "procedure_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hospital_test" ON "hospital_tests"("hospital_id", "test_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hospital_treatment" ON "hospital_treatments"("hospital_id", "treatment_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hospital_code" ON "hospitals"("hospital_code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_receptionist_contact" ON "hospitals"("receptionist_contact");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hospital_reg" ON "hospitals"("registration_no");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hospital_license" ON "hospitals"("license_no");

-- CreateIndex
CREATE UNIQUE INDEX "uq_hospital_gst" ON "hospitals"("gst_no");

-- CreateIndex
CREATE UNIQUE INDEX "medicines_medicine_code_key" ON "medicines"("medicine_code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_opd_diagnosis" ON "opd_diagnoses"("visit_id", "diagnosis_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_opd_no" ON "opd_visits"("opd_no");

-- CreateIndex
CREATE UNIQUE INDEX "patients_user_id_key" ON "patients"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_patient_no" ON "patients"("patient_no");

-- CreateIndex
CREATE UNIQUE INDEX "uq_payment_mode" ON "payment_modes"("payment_mode_name");

-- CreateIndex
CREATE UNIQUE INDEX "procedures_procedure_code_key" ON "procedures"("procedure_code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_queue_token" ON "queue_tokens"("daily_queue_id", "token_number");

-- CreateIndex
CREATE UNIQUE INDEX "uq_role" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_specialization" ON "specializations"("specialization_name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_states_name" ON "states"("state_name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_states_code" ON "states"("state_code");

-- CreateIndex
CREATE UNIQUE INDEX "tests_test_code_key" ON "tests"("test_code");

-- CreateIndex
CREATE UNIQUE INDEX "treatment_types_treatment_code_key" ON "treatment_types"("treatment_code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_user_email" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uq_user_phone" ON "users"("phone_number");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("doctor_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bill_items" ADD CONSTRAINT "bill_items_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "billing"("bill_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "opd_visits"("opd_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("state_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "daily_queues" ADD CONSTRAINT "daily_queues_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "daily_queues" ADD CONSTRAINT "daily_queues_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("doctor_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "daily_queues" ADD CONSTRAINT "daily_queues_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "daily_queues" ADD CONSTRAINT "daily_queues_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diagnoses" ADD CONSTRAINT "diagnoses_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments_master"("department_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctor_availability" ADD CONSTRAINT "doctor_availability_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("doctor_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments_master"("department_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("specialization_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_hospital_group_id_fkey" FOREIGN KEY ("hospital_group_id") REFERENCES "hospital_groups"("hospital_group_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "followups" ADD CONSTRAINT "followups_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "opd_visits"("opd_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_counters" ADD CONSTRAINT "hospital_counters_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_counters" ADD CONSTRAINT "hospital_counters_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_counters" ADD CONSTRAINT "hospital_counters_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_departments" ADD CONSTRAINT "hospital_departments_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments_master"("department_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_departments" ADD CONSTRAINT "hospital_departments_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_diagnoses" ADD CONSTRAINT "hospital_diagnoses_diagnosis_id_fkey" FOREIGN KEY ("diagnosis_id") REFERENCES "diagnoses"("diagnosis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_diagnoses" ADD CONSTRAINT "hospital_diagnoses_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_groups" ADD CONSTRAINT "hospital_groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_groups" ADD CONSTRAINT "hospital_groups_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_medicines" ADD CONSTRAINT "hospital_medicines_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_medicines" ADD CONSTRAINT "hospital_medicines_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("medicine_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_procedures" ADD CONSTRAINT "hospital_procedures_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_procedures" ADD CONSTRAINT "hospital_procedures_procedure_id_fkey" FOREIGN KEY ("procedure_id") REFERENCES "procedures"("procedure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_tests" ADD CONSTRAINT "hospital_tests_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_tests" ADD CONSTRAINT "hospital_tests_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("test_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_treatments" ADD CONSTRAINT "hospital_treatments_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_treatments" ADD CONSTRAINT "hospital_treatments_treatment_type_id_fkey" FOREIGN KEY ("treatment_type_id") REFERENCES "treatment_types"("treatment_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospitals" ADD CONSTRAINT "hospitals_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("city_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospitals" ADD CONSTRAINT "hospitals_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospitals" ADD CONSTRAINT "hospitals_hospital_group_id_fkey" FOREIGN KEY ("hospital_group_id") REFERENCES "hospital_groups"("hospital_group_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospitals" ADD CONSTRAINT "hospitals_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospitals" ADD CONSTRAINT "hospitals_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("state_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_diagnoses" ADD CONSTRAINT "opd_diagnoses_diagnosis_id_fkey" FOREIGN KEY ("diagnosis_id") REFERENCES "diagnoses"("diagnosis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_diagnoses" ADD CONSTRAINT "opd_diagnoses_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "opd_visits"("opd_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_procedures" ADD CONSTRAINT "opd_procedures_procedure_id_fkey" FOREIGN KEY ("procedure_id") REFERENCES "procedures"("procedure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_procedures" ADD CONSTRAINT "opd_procedures_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "opd_visits"("opd_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_tests" ADD CONSTRAINT "opd_tests_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("test_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_tests" ADD CONSTRAINT "opd_tests_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "opd_visits"("opd_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_visits" ADD CONSTRAINT "opd_visits_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("appointment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_visits" ADD CONSTRAINT "opd_visits_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_visits" ADD CONSTRAINT "opd_visits_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("doctor_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_visits" ADD CONSTRAINT "opd_visits_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("hospital_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_visits" ADD CONSTRAINT "opd_visits_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_visits" ADD CONSTRAINT "opd_visits_old_opd_id_fkey" FOREIGN KEY ("old_opd_id") REFERENCES "opd_visits"("opd_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opd_visits" ADD CONSTRAINT "opd_visits_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_contact_details" ADD CONSTRAINT "patient_contact_details_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("city_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_contact_details" ADD CONSTRAINT "patient_contact_details_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_contact_details" ADD CONSTRAINT "patient_contact_details_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("state_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_emergency_contacts" ADD CONSTRAINT "patient_emergency_contacts_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_medical_details" ADD CONSTRAINT "patient_medical_details_blood_group_id_fkey" FOREIGN KEY ("blood_group_id") REFERENCES "blood_groups"("blood_group_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_medical_details" ADD CONSTRAINT "patient_medical_details_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_hospital_group_id_fkey" FOREIGN KEY ("hospital_group_id") REFERENCES "hospital_groups"("hospital_group_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "billing"("bill_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_mode_id_fkey" FOREIGN KEY ("payment_mode_id") REFERENCES "payment_modes"("payment_mode_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_received_by_fkey" FOREIGN KEY ("received_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("medicine_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("prescription_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("doctor_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "opd_visits"("opd_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedures" ADD CONSTRAINT "procedures_treatment_type_id_fkey" FOREIGN KEY ("treatment_type_id") REFERENCES "treatment_types"("treatment_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "queue_tokens" ADD CONSTRAINT "queue_tokens_daily_queue_id_fkey" FOREIGN KEY ("daily_queue_id") REFERENCES "daily_queues"("daily_queue_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "queue_tokens" ADD CONSTRAINT "queue_tokens_opd_id_fkey" FOREIGN KEY ("opd_id") REFERENCES "opd_visits"("opd_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments_master"("department_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "treatment_types" ADD CONSTRAINT "treatment_types_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments_master"("department_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
