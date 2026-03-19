import TreatmentDetailClient from "@/components/superadmin/treatment-types/detail/TreatmentDetailClient";

export default async function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ treatment_id: string }>;
}) {
  const { treatment_id } = await params;

  return (
    <TreatmentDetailClient
      treatmentId={Number(treatment_id)}
    />
  );
} 