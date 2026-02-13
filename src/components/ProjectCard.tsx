'use client';

import React from 'react';
import { Project } from '@/types';
import { Card } from './Card';
import { Button } from './Button';

interface ProjectCardProps {
  project: Project;
  onInvest: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onInvest }) => {
  const percentageFunded = (project.amount_raised / project.target_amount) * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {project.image_url && (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {project.location}
          </p>
        </div>

        <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
          {project.description}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {percentageFunded.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full"
              style={{ width: `${Math.min(percentageFunded, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Target Amount</p>
            <p className="font-bold text-gray-900 dark:text-white">
              UGX {project.target_amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Amount Raised</p>
            <p className="font-bold text-gray-900 dark:text-white">
              UGX {project.amount_raised.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Slot Price</p>
            <p className="font-bold text-gray-900 dark:text-white">
              UGX {project.slot_price.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Slots Available</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {project.slots_available}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monthly ROI</p>
            <p className="text-2xl font-bold text-green-600">
              {project.roi_percentage}%
            </p>
          </div>
          <Button
            onClick={() => onInvest(project)}
            disabled={project.status !== 'open' || project.slots_available === 0}
          >
            {project.status !== 'open' ? 'Closed' : 'Invest Now'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
