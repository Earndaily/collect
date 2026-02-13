'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Project } from '@/types';
import { ProjectCard } from '@/components/ProjectCard';
import { Modal } from '@/components/Modal';
import { Payment } from '@/components/Payment';

export default function ProjectsPage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [slots, setSlots] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('open');

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const fetchProjects = async () => {
    try {
      const url = statusFilter === 'all'
        ? '/api/projects'
        : `/api/projects?status=${statusFilter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = (project: Project) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!userData?.is_active) {
      router.push('/pay-activation');
      return;
    }

    setSelectedProject(project);
    setSlots(1);
  };

  const handlePaymentSuccess = async () => {
    setSelectedProject(null);
    setSlots(1);
    await fetchProjects();
    router.push('/dashboard');
  };

  const totalAmount = selectedProject ? selectedProject.slot_price * slots : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Investment Projects
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Browse verified development projects and start building wealth
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              statusFilter === 'open'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setStatusFilter('closed')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              statusFilter === 'closed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            Closed
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No projects available at the moment
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onInvest={handleInvest}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title="Invest in Project"
      >
        {selectedProject && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {selectedProject.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedProject.location}
              </p>
            </div>

            <div className="border dark:border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price per Slot</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  UGX {selectedProject.slot_price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Monthly ROI</span>
                <span className="font-bold text-green-600">
                  {selectedProject.roi_percentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Available Slots</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {selectedProject.slots_available}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Slots
              </label>
              <input
                type="number"
                min="1"
                max={selectedProject.slots_available}
                value={slots}
                onChange={(e) => setSlots(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white mb-2">
                <span>Total Amount:</span>
                <span>UGX {totalAmount.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Expected monthly dividend: UGX{' '}
                {((selectedProject.roi_percentage / 100) * totalAmount).toLocaleString()}
              </p>
            </div>

            {user && userData && (
              <Payment
                amount={totalAmount}
                email={userData.email}
                name={userData.email.split('@')[0]}
                metadata={{
                  user_uid: user.uid,
                  payment_type: 'investment',
                  project_id: selectedProject.id,
                  slots,
                }}
                onSuccess={handlePaymentSuccess}
                onClose={() => setSelectedProject(null)}
                buttonText={`Invest UGX ${totalAmount.toLocaleString()}`}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
