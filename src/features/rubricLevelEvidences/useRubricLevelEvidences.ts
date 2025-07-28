import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rubricLevelEvidencesApi } from '../../api/services';
import { RubricLevelEvidenceInput, RubricLevelEvidenceUpdate } from '../../types/rubric';
import { rubricLevelKeys } from '../rubricLevels/useRubricLevels';

// Query keys
export const rubricLevelEvidenceKeys = {
  all: ['rubricLevelEvidences'] as const,
  lists: () => [...rubricLevelEvidenceKeys.all, 'list'] as const,
  list: (rubricLevelId: string) => [...rubricLevelEvidenceKeys.lists(), { rubricLevelId }] as const,
  details: () => [...rubricLevelEvidenceKeys.all, 'detail'] as const,
  detail: (id: string) => [...rubricLevelEvidenceKeys.details(), id] as const,
};

export const useRubricLevelEvidences = (rubricLevelId: string) => {
  return useQuery({
    queryKey: rubricLevelEvidenceKeys.list(rubricLevelId),
    queryFn: () => rubricLevelEvidencesApi.getEvidencesByLevelId(rubricLevelId).then(res => res.data),
    enabled: !!rubricLevelId, // Only run the query if we have a rubricLevelId
  });
};

export const useRubricLevelEvidence = (id: string) => {
  return useQuery({
    queryKey: rubricLevelEvidenceKeys.detail(id),
    queryFn: () => rubricLevelEvidencesApi.getRubricLevelEvidenceById(id).then(res => res.data),
    enabled: !!id, // Only run the query if we have an ID
  });
};

export const useCreateRubricLevelEvidence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newEvidence: RubricLevelEvidenceInput) => 
      rubricLevelEvidencesApi.createRubricLevelEvidence(newEvidence).then(res => res.data),
    onSuccess: (data) => {
      // Invalidate the evidences list query to refetch
      queryClient.invalidateQueries({ 
        queryKey: rubricLevelEvidenceKeys.list(data.rubric_level_id) 
      });
      
      // Also invalidate the parent level to update nested data
      queryClient.invalidateQueries({ 
        queryKey: rubricLevelKeys.detail(data.rubric_level_id) 
      });
    },
  });
};

export const useUpdateRubricLevelEvidence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, evidence }: { id: string; evidence: RubricLevelEvidenceUpdate }) => 
      rubricLevelEvidencesApi.updateRubricLevelEvidence(id, evidence).then(res => res.data),
    onSuccess: (data, variables) => {
      // Invalidate the specific evidence query
      queryClient.invalidateQueries({ 
        queryKey: rubricLevelEvidenceKeys.detail(variables.id) 
      });
      
      // Invalidate the evidences list for the parent level
      queryClient.invalidateQueries({ 
        queryKey: rubricLevelEvidenceKeys.list(data.rubric_level_id) 
      });
      
      // Also invalidate the parent level to update nested data
      queryClient.invalidateQueries({ 
        queryKey: rubricLevelKeys.detail(data.rubric_level_id) 
      });
    },
  });
};

export const useDeleteRubricLevelEvidence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id }: { id: string; rubricLevelId: string }) => 
      rubricLevelEvidencesApi.deleteRubricLevelEvidence(id).then(res => res),
    onSuccess: (_, variables) => {
      // Remove the specific evidence from the cache
      queryClient.removeQueries({ 
        queryKey: rubricLevelEvidenceKeys.detail(variables.id) 
      });
      
      // Invalidate the evidences list for the parent level
      queryClient.invalidateQueries({ 
        queryKey: rubricLevelEvidenceKeys.list(variables.rubricLevelId) 
      });
      
      // Also invalidate the parent level to update nested data
      queryClient.invalidateQueries({ 
        queryKey: rubricLevelKeys.detail(variables.rubricLevelId) 
      });
    },
  });
};