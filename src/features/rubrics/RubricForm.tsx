import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '../../components/ui';
import { TextField, TextArea } from '../../components/forms';
import { useCreateRubric, useUpdateRubric } from './useRubrics';
import { Rubric, RubricInput, RubricUpdate } from '../../types/rubric';
import { required, minLength, validate, ValidationRule } from '../../utils/validation';

export interface RubricFormProps {
  rubric?: Rubric;
  isEdit?: boolean;
  onSuccess?: (rubric: Rubric) => void;
  onCancel?: () => void;
}

const RubricForm: React.FC<RubricFormProps> = ({
  rubric,
  isEdit = false,
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<RubricInput | RubricUpdate>({
    name: '',
    description: '',
    domain_id: null,
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mutations
  const createMutation = useCreateRubric();
  const updateMutation = useUpdateRubric();
  
  // Initialize form data if editing
  useEffect(() => {
    if (isEdit && rubric) {
      setFormData({
        name: rubric.name || '',
        description: rubric.description || '',
        domain_id: rubric.domain_id || null,
      });
    }
  }, [isEdit, rubric]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Validation schema
  const validationSchema: Record<string, ValidationRule[]> = {
    name: [required('Name is required'), minLength(3, 'Name must be at least 3 characters')],
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
    
    if (isEdit && rubric?.id) {
      // Update existing rubric
      updateMutation.mutate(
        { id: rubric.id, rubric: formData as RubricUpdate },
        {
          onSuccess: (data) => {
            setIsSubmitting(false);
            if (onSuccess) {
              onSuccess(data);
            } else {
              router.push(`/rubrics/${data.id}`);
            }
          },
          onError: (error) => {
            setIsSubmitting(false);
            console.error('Error updating rubric:', error);
            // Handle API errors here
          },
        }
      );
    } else {
      // Create new rubric
      createMutation.mutate(formData as RubricInput, {
        onSuccess: (data) => {
          setIsSubmitting(false);
          if (onSuccess) {
            onSuccess(data);
          } else {
            router.push(`/rubrics/${data.id}`);
          }
        },
        onError: (error) => {
          setIsSubmitting(false);
          console.error('Error creating rubric:', error);
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
      router.back();
    }
  };
  
  return (
    <Card title={isEdit ? 'Edit Rubric' : 'Create Rubric'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          fullWidth
          required
        />
        
        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          fullWidth
          rows={4}
        />
        
        {/* Domain ID field - in a real app, this would be a select dropdown */}
        <TextField
          label="Domain ID"
          name="domain_id"
          value={formData.domain_id || ""}
          onChange={handleChange}
          error={errors.domain_id}
          helperText="Optional: Associate this rubric with a domain"
          fullWidth
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

export default RubricForm;