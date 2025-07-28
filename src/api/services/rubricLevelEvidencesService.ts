import { apiGet, apiPost, apiPut, apiDelete } from '../apiClient';
import { 
  RubricLevelEvidence, 
  RubricLevelEvidenceInput, 
  RubricLevelEvidenceUpdate, 
  RubricLevelEvidencesResponse, 
  RubricLevelEvidenceResponse 
} from '../../types/rubric';

const BASE_URL = '/rubric-level-evidences';

export const rubricLevelEvidencesApi = {
  /**
   * Get all evidences for a specific rubric level
   * @param rubricLevelId Rubric Level ID
   * @returns Promise with rubric level evidences data
   */
  getEvidencesByLevelId: (rubricLevelId: string) => 
    apiGet<RubricLevelEvidencesResponse>(`${BASE_URL}`, { params: { rubric_level_id: rubricLevelId } }),
  
  /**
   * Get a specific rubric level evidence by ID
   * @param id Rubric Level Evidence ID
   * @returns Promise with rubric level evidence data
   */
  getRubricLevelEvidenceById: (id: string) => 
    apiGet<RubricLevelEvidenceResponse>(`${BASE_URL}/${id}`),
  
  /**
   * Create a new rubric level evidence
   * @param evidence Rubric level evidence data without id, created_at, updated_at, deleted_at
   * @returns Promise with created rubric level evidence data
   */
  createRubricLevelEvidence: (evidence: RubricLevelEvidenceInput) => 
    apiPost<RubricLevelEvidenceResponse>(BASE_URL, evidence),
  
  /**
   * Update an existing rubric level evidence
   * @param id Rubric Level Evidence ID
   * @param evidence Partial rubric level evidence data to update
   * @returns Promise with updated rubric level evidence data
   */
  updateRubricLevelEvidence: (id: string, evidence: RubricLevelEvidenceUpdate) => 
    apiPut<RubricLevelEvidenceResponse>(`${BASE_URL}/${id}`, evidence),
  
  /**
   * Delete a rubric level evidence
   * @param id Rubric Level Evidence ID
   * @returns Promise with success message
   */
  deleteRubricLevelEvidence: (id: string) => 
    apiDelete<{ success: boolean, message: string }>(`${BASE_URL}/${id}`)
};