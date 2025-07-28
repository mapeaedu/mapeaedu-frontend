import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '../../components/ui';
import { TextField, TextArea, Select } from '../../components/forms';
import { useCreateRubricLevel, useUpdateRubricLevel } from './useRubricLevels';
import { RubricLevel, RubricLevelInput, RubricLevelUpdate } from '../../types/rubric';
import { required, minLength, validate, ValidationRule } from '../../utils/validation';

export interface RubricLevelFormProps {
  rubricId: string;
  level?: RubricLevel;
  isEdit?: boolean;
  onSuccess?: (level: RubricLevel) => void;
  onCancel?: () => void;
  maxOrder?: number;
}

const RubricLevelForm: React.FC<RubricLevelFormProps> = ({
  rubricId,
  level,
  isEdit = false,
  onSuccess,
  onCancel,
  maxOrder = 0,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<RubricLevelInput | RubricLevelUpdate>({
    rubric_id: rubricId,
    name: '',
    description: '',
    level_order: maxOrder + 1,
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mutations
  const createMutation = useCreateRubricLevel();
  const updateMutation = useUpdateRubricLevel();
  
  // Initialize form data if editing
  useEffect(() => {
    if (isEdit && level) {
      setFormData({
        rubric_id: level.rubric_id || rubricId,
        name: level.name || '',
        description: level.description || '',
        level_order: level.level_order,
      });
    }
  }, [isEdit, level, rubricId]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert level_order to number if it's a string
    if (name === 'level_order') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Validation schema
  const validationSchema: Record<string, ValidationRule[]> = {
    name: [required('Name is required'), minLength(2, 'Name must be at least 2 characters')],
    level_order: [required('Order is required')],
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
    
    if (isEdit && level?.id) {
      // Update existing level
      updateMutation.mutate(
        { id: level.id, level: formData as RubricLevelUpdate },
        {
          onSuccess: (data) => {
            setIsSubmitting(false);
            if (onSuccess) {
              onSuccess(data);
            } else {
              router.push(`/rubrics/${rubricId}`);
            }
          },
          onError: (error) => {
            setIsSubmitting(false);
            console.error('Error updating rubric level:', error);
            // Handle API errors here
          },
        }
      );
    } else {
      // Create new level
      createMutation.mutate(formData as RubricLevelInput, {
        onSuccess: (data) => {
          setIsSubmitting(false);
          if (onSuccess) {
            onSuccess(data);
          } else {
            router.push(`/rubrics/${rubricId}`);
          }
        },
        onError: (error) => {
          setIsSubmitting(false);
          console.error('Error creating rubric level:', error);
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
      router.push(`/rubrics/${rubricId}`);
    }
  };
  
  // Generate order options
  const orderOptions = Array.from({ length: maxOrder + 2 }, (_, i) => ({
    value: i.toString(),
    label: i.toString(),
  }));
  
  return (
    <Card title={isEdit ? 'Edit Rubric Level' : 'Create Rubric Level'}>
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
          value={formData.description || ''}
          onChange={handleChange}
          error={errors.description}
          fullWidth
          rows={4}
        />
        
        <Select
          label="Order"
          name="level_order"
          value={formData.level_order?.toString() || '0'}
          onChange={handleChange}
          options={orderOptions}
          error={errors.level_order}
          helperText="The order in which this level appears in the rubric"
          fullWidth
          required
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

export default RubricLevelForm;