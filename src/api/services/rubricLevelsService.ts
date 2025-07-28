import { apiGet, apiPost, apiPut, apiDelete } from '../apiClient';
import { 
  RubricLevel, 
  RubricLevelInput, 
  RubricLevelUpdate, 
  RubricLevelsResponse, 
  RubricLevelResponse 
} from '../../types/rubric';

const BASE_URL = '/rubric-levels';

export const rubricLevelsApi = {
  /**
   * Get all levels for a specific rubric
   * @param rubricId Rubric ID
   * @returns Promise with rubric levels data
   */
  getLevelsByRubricId: (rubricId: string) => 
    apiGet<RubricLevelsResponse>(`${BASE_URL}`, { params: { rubric_id: rubricId } }),
  
  /**
   * Get a specific rubric level by ID
   * @param id Rubric Level ID
   * @returns Promise with rubric level data
   */
  getRubricLevelById: (id: string) => 
    apiGet<RubricLevelResponse>(`${BASE_URL}/${id}`),
  
  /**
   * Create a new rubric level
   * @param level Rubric level data without id, created_at, updated_at, deleted_at
   * @returns Promise with created rubric level data
   */
  createRubricLevel: (level: RubricLevelInput) => 
    apiPost<RubricLevelResponse>(BASE_URL, level),
  
  /**
   * Update an existing rubric level
   * @param id Rubric Level ID
   * @param level Partial rubric level data to update
   * @returns Promise with updated rubric level data
   */
  updateRubricLevel: (id: string, level: RubricLevelUpdate) => 
    apiPut<RubricLevelResponse>(`${BASE_URL}/${id}`, level),
  
  /**
   * Delete a rubric level
   * @param id Rubric Level ID
   * @returns Promise with success message
   */
  deleteRubricLevel: (id: string) => 
    apiDelete<{ success: boolean, message: string }>(`${BASE_URL}/${id}`),
  
  /**
   * Reorder rubric levels
   * @param rubricId Rubric ID
   * @param levelIds Array of level IDs in the desired order
   * @returns Promise with updated levels
   */
  reorderLevels: (rubricId: string, levelIds: string[]) => 
    apiPut<RubricLevelsResponse>(`/rubrics/${rubricId}/reorder-levels`, { level_ids: levelIds })
};