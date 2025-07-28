// Export all Rubrics components and hooks from a single point
export { default as RubricsList } from './RubricsList';
export { default as RubricForm } from './RubricForm';
export { default as RubricDetail } from './RubricDetail';

// Export hooks
export {
  useRubrics,
  useRubric,
  useCreateRubric,
  useUpdateRubric,
  useDeleteRubric,
  rubricKeys,
} from './useRubrics';

// Export types
export type { RubricsListProps } from './RubricsList';
export type { RubricFormProps } from './RubricForm';
export type { RubricDetailProps } from './RubricDetail';