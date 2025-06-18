import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { Controller, Control } from 'react-hook-form';
import { components } from 'react-select';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export interface Skill {
  id: number;
  name: string;
}

interface SkillOption {
  value: number;
  label: string;
  __isNew__?: boolean;
}

interface SkillsSelectProps {
  control: Control<any>;
  skills: any[];
  setSkills: React.Dispatch<React.SetStateAction<any>>;
  name?: string;
}

const SkillsSelect: React.FC<SkillsSelectProps> = ({ control, skills, setSkills, name = 'skills' }) => {
  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field, fieldState }) => {
        const selectedSkills = (field.value as Skill[]) || [];

        const CustomMultiValue = (props: any) => {
          const { index, data } = props;
          const moveUp = () => {
            if (index > 0) {
              const newSkills = [...selectedSkills];
              [newSkills[index], newSkills[index - 1]] = [newSkills[index - 1], newSkills[index]];
              field.onChange(newSkills);
            }
          };

          const moveDown = () => {
            if (index < selectedSkills.length - 1) {
              const newSkills = [...selectedSkills];
              [newSkills[index], newSkills[index + 1]] = [newSkills[index + 1], newSkills[index]];
              field.onChange(newSkills);
            }
          };

          return (
            <components.MultiValue {...props}>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={moveUp}
                  className="p-1 hover:bg-gray-100 rounded"
                  disabled={index === 0}
                >
                  <FaArrowUp className={index === 0 ? 'text-gray-300' : 'text-gray-600'} size={12} />
                </button>
                <button
                  type="button"
                  onClick={moveDown}
                  className="p-1 hover:bg-gray-100 rounded"
                  disabled={index === selectedSkills.length - 1}
                >
                  <FaArrowDown 
                    className={index === selectedSkills.length - 1 ? 'text-gray-300' : 'text-gray-600'} 
                    size={12} 
                  />
                </button>
                <span>{data.label}</span>
              </div>
            </components.MultiValue>
          );
        };

        return (
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700">Skills</label>
            <CreatableSelect<SkillOption, true>
              isMulti
              options={skills.map((skill) => ({ value: skill.id, label: skill.name }))}
              value={selectedSkills.map((skill) => ({ value: skill.id, label: skill.name }))}
              onChange={(selected) => {
                const skillsArray = (selected as SkillOption[]).map((option, index) => ({
                  id: option.__isNew__ ? -index - 1 : option.value,
                  name: option.label,
                }));
                field.onChange(skillsArray);
              }}
              onCreateOption={(inputValue) => {
                const newSkill = { id: -skills.length - 1, name: inputValue };
                setSkills([...skills, newSkill]);
                field.onChange([...(field.value || []), newSkill]);
              }}
              components={{ MultiValue: CustomMultiValue }}
              className="basic-multi-select"
              classNamePrefix="select"
            />
            {fieldState.error && (
              <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default SkillsSelect; 