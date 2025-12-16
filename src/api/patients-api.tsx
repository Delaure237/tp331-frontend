// src/app/api/patients-api.ts
export async function deletePatientsByIds(patientIds: string[]): Promise<void> {
  console.log("deletePatientsByIds called with:", patientIds);
  // ici on pourrait ajouter un timeout simulé si on veut
  return Promise.resolve();
}

export async function exportPatients(format: "pdf" | "csv"): Promise<void> {
  console.log(`exportPatients called with format: ${format}`);
  return Promise.resolve();
}

export async function addPatient(patientData: any): Promise<void> {
  console.log("addPatient called with:", patientData);
  return Promise.resolve();
}

export async function updatePatient(patientId: string, patientData: any): Promise<void> {
  console.log(`updatePatient called for id ${patientId} with:`, patientData);
  return Promise.resolve();
}
