import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rubricLevelsApi } from '../../api/services';
import { RubricLevel, RubricLevelInput, RubricLevelUpdate } from '../../types/rubric';
import { rubricKeys } from '../rubrics/useRubrics';

// Query keys
export const rubricLevelKeys = {
  all: ['rubricLevels'] as const,
  lists: () => [...rubricLevelKeys.all, 'list'] as const,
  list: (rubricId: string) => [...rubricLevelKeys.lists(), { rubricId }] as const,
  details: () => [...rubricLevelKeys.all, 'detail'] as const,
  detail: (id: string) => [...rubricLevelKeys.details(), id] as const,
};

export const useRubricLevels = (rubricId: string) => {
  return useQuery({
    queryKey: rubricLevelKeys.list(rubricId),
    queryFn: () => rubricLevelsApi.getLevelsByRubricId(rubricId).then(res => res.data),
    enabled: !!rubricId, // Only run the query if we have a rubricId
  });
};

export const useRubricLevel = (id: string) => {
  return useQuery({
    queryKey: rubricLevelKeys.detail(id),
    queryFn: () => rubricLevelsApi.getRubricLevelById(id).then(res => res.data),
    enabled: !!id, // Only run the query if we have an ID
  });
};

export const useCreateRubricLevel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newLevel: RubricLevelInput) => 
      rubricLevelsApi.createRubricLevel(newLevel).then(res => res.data),
    onSuccess: (data) => {
      // Invalidate the rubric levels list query to refetch
      if (data.rubric_id) {
        queryClient.invalidateQueries({ queryKey: rubricLevelKeys.list(data.rubric_id) });
        // Also invalidate the parent rubric to update nested data
        queryClient.invalidateQueries({ queryKey: rubricKeys.detail(data.rubric_id) });
      }
    },
  });
};

export const useUpdateRubricLevel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, level }: { id: string; level: RubricLevelUpdate }) => 
      rubricLevelsApi.updateRubricLevel(id, level).then(res => res.data),
    onSuccess: (data, variables) => {
      // Invalidate the specific level query
      queryClient.invalidateQueries({ queryKey: rubricLevelKeys.detail(variables.id) });
      
      // Invalidate the levels list for the parent rubric
      if (data.rubric_id) {
        queryClient.invalidateQueries({ queryKey: rubricLevelKeys.list(data.rubric_id) });
        // Also invalidate the parent rubric to update nested data
        queryClient.invalidateQueries({ queryKey: rubricKeys.detail(data.rubric_id) });
      }
    },
  });
};

export const useDeleteRubricLevel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => rubricLevelsApi.deleteRubricLevel(id).then(res => res),
    onSuccess: (_, id) => {
      // We need to get the rubric_id before deleting the level to invalidate the correct queries
      // This is a bit tricky since we don't have the rubric_id after deletion
      // One approach is to pass both id and rubricId to the mutation
      queryClient.removeQueries({ queryKey: rubricLevelKeys.detail(id) });
    },
  });
};

export const useReorderRubricLevels = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ rubricId, levelIds }: { rubricId: string; levelIds: string[] }) => 
      rubricLevelsApi.reorderLevels(rubricId, levelIds).then(res => res.data),
    onSuccess: (_, variables) => {
      // Invalidate the levels list for the rubric
      queryClient.invalidateQueries({ queryKey: rubricLevelKeys.list(variables.rubricId) });
      // Also invalidate the parent rubric to update nested data
      queryClient.invalidateQueries({ queryKey: rubricKeys.detail(variables.rubricId) });
    },
  });
};