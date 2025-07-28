import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '../../components/ui';
import { TextArea } from '../../components/forms';
import { useCreateRubricLevelEvidence, useUpdateRubricLevelEvidence } from './useRubricLevelEvidences';
import { RubricLevelEvidence, RubricLevelEvidenceInput, RubricLevelEvidenceUpdate } from '../../types/rubric';
import { required, minLength, validate, ValidationRule } from '../../utils/validation';

export interface RubricLevelEvidenceFormProps {
  rubricId: string;
  levelId: string;
  evidence?: RubricLevelEvidence;
  isEdit?: boolean;
  onSuccess?: (evidence: RubricLevelEvidence) => void;
  onCancel?: () => void;
}

const RubricLevelEvidenceForm: React.FC<RubricLevelEvidenceFormProps> = ({
  rubricId,
  levelId,
  evidence,
  isEdit = false,
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<RubricLevelEvidenceInput | RubricLevelEvidenceUpdate>({
    rubric_level_id: levelId,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mutations
  const createMutation = useCreateRubricLevelEvidence();
  const updateMutation = useUpdateRubricLevelEvidence();
  
  // Initialize form data if editing
  useEffect(() => {
    if (isEdit && evidence) {
      setFormData({
        rubric_level_id: evidence.rubric_level_id || levelId,
        description: evidence.description || '',
      });
    }
  }, [isEdit, evidence, levelId]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Validation schema
  const validationSchema: Record<string, ValidationRule[]> = {
    description: [required('Description is required'), minLength(5, 'Description must be at least 5 characters')],
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    
    // Validate each field
    Object.keys(validationSchema).forEach((field) => {
      const value = formData[field as keyof typeof formData];
      newErrors[field] = validate(value, validationSchema[field]);
    });
    
    setErrors(newErrors);
    
    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== undefined);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    if (isEdit && evidence?.id) {
      // Update existing evidence
      updateMutation.mutate(
        { id: evidence.id, evidence: formData as RubricLevelEvidenceUpdate },
        {
          onSuccess: (data) => {
            setIsSubmitting(false);
            if (onSuccess) {
              onSuccess(data);
            } else {
              router.push(`/rubrics/${rubricId}/levels/${levelId}`);
            }
          },
          onError: (error) => {
            setIsSubmitting(false);
            console.error('Error updating evidence:', error);
            // Handle API errors here
          },
        }
      );
    } else {
      // Create new evidence
      createMutation.mutate(formData as RubricLevelEvidenceInput, {
        onSuccess: (data) => {
          setIsSubmitting(false);
          if (onSuccess) {
            onSuccess(data);
          } else {
            router.push(`/rubrics/${rubricId}/levels/${levelId}`);
          }
        },
        onError: (error) => {
          setIsSubmitting(false);
          console.error('Error creating evidence:', error);
          // Handle API errors here
        },
      });
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push(`/rubrics/${rubricId}/levels/${levelId}`);
    }
  };
  
  return (
    <Card title={isEdit ? 'Edit Evidence' : 'Create Evidence'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          fullWidth
          rows={6}
          required
          helperText="Describe the evidence that demonstrates this level of competency"
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default RubricLevelEvidenceForm;