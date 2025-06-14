import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { UseFormRegister } from 'react-hook-form';

interface WorkExperienceField {
  id: string;
  company?: string;
  jobTitle?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface Props {
  register: UseFormRegister<any>;
  errors: any;
  workExperienceFields: WorkExperienceField[];
  sortedFields: WorkExperienceField[];
  onDragEnd: (result: DropResult) => void;
  removeWorkExperience: (index: number) => void;
  appendWorkExperience: (value: any) => void;
  resetToChronological: () => void;
  handleEnhanceDescription: (index: number) => void;
  isEnhancing: number | null;
}

const WorkExperienceSection: React.FC<Props> = ({
  register,
  errors,
  workExperienceFields,
  sortedFields,
  onDragEnd,
  removeWorkExperience,
  appendWorkExperience,
  resetToChronological,
  handleEnhanceDescription,
  isEnhancing,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
        <button
          type="button"
          onClick={resetToChronological}
          className="text-blue-600 hover:text-blue-800 text-base font-medium"
        >
          Reset to Chronological
        </button>
      </div>
      {errors.workExperience && (
        <p className="mb-2 text-sm text-red-600">{errors.workExperience.message}</p>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="workExperiences" isDropDisabled={false}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sortedFields.map((field, index) => {
                const originalIndex = workExperienceFields.findIndex((f) => f.id === field.id);
                const draggableId = `${field.id}-${index}`;
                return (
                  <Draggable key={draggableId} draggableId={draggableId} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="p-6 border border-gray-200 rounded-lg space-y-4 mb-4 bg-white cursor-move"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500 cursor-move" {...provided.dragHandleProps}>☰</span>
                            <h4 className="text-base font-medium text-gray-700">Experience {index + 1}</h4>
                          </div>
                          <div className="flex space-x-2">
                            {workExperienceFields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeWorkExperience(originalIndex)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-base font-medium text-gray-700">Company</label>
                            <input
                              {...register(`workExperience.${originalIndex}.company` as const)}
                              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[originalIndex]?.company ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="Company"
                            />
                            {errors.workExperience?.[originalIndex]?.company && (
                              <p className="mt-1 text-sm text-red-600">{errors.workExperience[originalIndex].company.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="block text-base font-medium text-gray-700">Job Title</label>
                            <input
                              {...register(`workExperience.${originalIndex}.jobTitle` as const)}
                              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[originalIndex]?.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="Job Title"
                            />
                            {errors.workExperience?.[originalIndex]?.jobTitle && (
                              <p className="mt-1 text-sm text-red-600">{errors.workExperience[originalIndex].jobTitle.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="block text-base font-medium text-gray-700">Start Date</label>
                            <input
                              {...register(`workExperience.${originalIndex}.startDate` as const)}
                              type="month"
                              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[originalIndex]?.startDate ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="YYYY-MM"
                            />
                            {errors.workExperience?.[originalIndex]?.startDate && (
                              <p className="mt-1 text-sm text-red-600">{errors.workExperience[originalIndex].startDate.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="block text-base font-medium text-gray-700">End Date</label>
                            <input
                              {...register(`workExperience.${originalIndex}.endDate` as const)}
                              type="month"
                              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${errors.workExperience?.[originalIndex]?.endDate ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="YYYY-MM or Present"
                            />
                            {errors.workExperience?.[originalIndex]?.endDate && (
                              <p className="mt-1 text-sm text-red-600">{errors.workExperience[originalIndex].endDate.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-base font-medium text-gray-700">Description</label>
                          <textarea
                            {...register(`workExperience.${originalIndex}.description` as const)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                            placeholder="Key responsibilities and achievements"
                            rows={4}
                          />
                          <button
                            type="button"
                            onClick={() => handleEnhanceDescription(originalIndex)}
                            disabled={isEnhancing === originalIndex}
                            className={`mt-2 px-4 py-2 rounded-lg text-base font-medium border ${isEnhancing === originalIndex ? 'text-gray-500 border-gray-500 cursor-not-allowed' : 'text-blue-600 border-blue-600 hover:text-blue-800 hover:border-blue-800'}`}
                          >
                            {isEnhancing === originalIndex ? 'Enhancing...' : 'Enhance With AI ✨'}
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        type="button"
        onClick={() => appendWorkExperience({ company: '', jobTitle: '', startDate: '', endDate: '', description: '' })}
        className="text-blue-600 hover:text-blue-800 text-base font-medium"
      >
        + Add Work Experience
      </button>
    </div>
  );
};

export default WorkExperienceSection; 