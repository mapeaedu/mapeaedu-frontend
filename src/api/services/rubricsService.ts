import { apiGet, apiPost, apiPut, apiDelete } from '../apiClient';
import {
  Rubric,
  RubricInput,
  RubricUpdate,
  RubricsResponse,
  RubricResponse
} from '../../types/rubric';

const BASE_URL = '/rubrics';

export const rubricsApi = {
  /**
   * Get all rubrics with optional filtering
   * @param filters Optional filters like domain_id
   * @returns Promise with rubrics data
   */
  getAllRubrics: (filters?: { domain_id?: string }) =>
    apiGet<RubricsResponse>(BASE_URL, { params: filters }),

  /**
   * Get a specific rubric by ID
   * @param id Rubric ID
   * @returns Promise with rubric data
   */
  getRubricById: (id: string) =>
    apiGet<RubricResponse>(`${BASE_URL}/${id}`),

  /**
   * Create a new rubric
   * @param rubric Rubric data without id, created_at, updated_at, deleted_at
   * @returns Promise with created rubric data
   */
  createRubric: (rubric: RubricInput) =>
    apiPost<RubricResponse>(BASE_URL, rubric),

  /**
   * Update an existing rubric
   * @param id Rubric ID
   * @param rubric Partial rubric data to update
   * @returns Promise with updated rubric data
   */
  updateRubric: (id: string, rubric: RubricUpdate) =>
    apiPut<RubricResponse>(`${BASE_URL}/${id}`, rubric),

  /**
   * Delete a rubric
   * @param id Rubric ID
   * @returns Promise with success message
   */
  deleteRubric: (id: string) =>
    apiDelete<{ success: boolean, message: string }>(`${BASE_URL}/${id}`)
};