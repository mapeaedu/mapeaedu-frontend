import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {rubricsApi} from '../../api/services';
import {Rubric, RubricInput, RubricUpdate} from '../../types/rubric';

// Query keys
export const rubricKeys = {
    all: ['rubrics'] as const,
    lists: () => [...rubricKeys.all, 'list'] as const,
    list: (filters: { domain_id?: string } = {}) => [...rubricKeys.lists(), filters] as const,
    details: () => [...rubricKeys.all, 'detail'] as const,
    detail: (id: string) => [...rubricKeys.details(), id] as const,
};

export const useRubrics = (filters?: { domain_id?: string }) => {
    return useQuery({
        queryKey: rubricKeys.list(filters),
        queryFn: () => rubricsApi.getAllRubrics(filters).then(res => res.data),
    });
};

export const useRubric = (id: string) => {
    return useQuery({
        queryKey: rubricKeys.detail(id),
        queryFn: () => rubricsApi.getRubricById(id).then(res => res.data),
        enabled: !!id, // Only run the query if we have an ID
    });
};

export const useCreateRubric = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newRubric: RubricInput) => rubricsApi.createRubric(newRubric).then(res => res.data),
        onSuccess: () => {
            // Invalidate the rubrics list query to refetch
            queryClient.invalidateQueries({queryKey: rubricKeys.lists()});
        },
    });
};

export const useUpdateRubric = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, rubric}: { id: string; rubric: RubricUpdate }) =>
            rubricsApi.updateRubric(id, rubric).then(res => res.data),
        onSuccess: (data, variables) => {
            // Invalidate the specific rubric query and the list
            queryClient.invalidateQueries({queryKey: rubricKeys.detail(variables.id)});
            queryClient.invalidateQueries({queryKey: rubricKeys.lists()});
        },
    });
};

export const useDeleteRubric = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => rubricsApi.deleteRubric(id).then(res => res),
        onSuccess: (_, id) => {
            // Invalidate the rubrics list query to refetch
            queryClient.invalidateQueries({queryKey: rubricKeys.lists()});
            // Remove the specific rubric from the cache
            queryClient.removeQueries({queryKey: rubricKeys.detail(id)});
        },
    });
};