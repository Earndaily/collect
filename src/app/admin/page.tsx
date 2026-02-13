'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Project } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    target_amount: '',
    slots_available: '',
    slot_price: '',
    roi_percentage: '',
    image_url: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (userData && !userData.is_admin) {
      router.push('/dashboard');
      return;
    }

    if (userData?.is_admin) {
      fetchProjects();
    }
  }, [user, userData, router]);

  const fetchProjects = async () => {
    try {
      const token = await user!.getIdToken();
      const response = await fetch('/api/projects?limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = await user!.getIdToken();
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          target_amount: parseInt(formData.target_amount),
          slots_available: parseInt(formData.slots_available),
          slot_price: parseInt(formData.slot_price),
          roi_percentage: parseFloat(formData.roi_percentage),
        }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          location: '',
          target_amount: '',
          slots_available: '',
          slot_price: '',
          roi_percentage: '',
          image_url: '',
        });
        fetchProjects();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const updateProjectStatus = async (projectId: string, status: 'open' | 'closed') => {
    try {
      const token = await user!.getIdToken();
      await fetch('/api/projects', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: projectId, status }),
      });
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  if (loading || !userData) {
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage projects and monitor platform activity
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          Create New Project
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {projects.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Open Projects</p>
          <p className="text-3xl font-bold text-green-600">
            {projects.filter(p => p.status === 'open').length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Closed Projects</p>
          <p className="text-3xl font-bold text-gray-600">
            {projects.filter(p => p.status === 'closed').length}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          All Projects
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b dark:border-gray-700">
              <tr className="text-left">
                <th className="pb-3 text-gray-900 dark:text-white">Title</th>
                <th className="pb-3 text-gray-900 dark:text-white">Location</th>
                <th className="pb-3 text-gray-900 dark:text-white">Target</th>
                <th className="pb-3 text-gray-900 dark:text-white">Raised</th>
                <th className="pb-3 text-gray-900 dark:text-white">Slots</th>
                <th className="pb-3 text-gray-900 dark:text-white">ROI</th>
                <th className="pb-3 text-gray-900 dark:text-white">Status</th>
                <th className="pb-3 text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b dark:border-gray-700">
                  <td className="py-3 text-gray-900 dark:text-white font-semibold">
                    {project.title}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">
                    {project.location}
                  </td>
                  <td className="py-3 text-gray-900 dark:text-white">
                    {(project.target_amount / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-3 text-gray-900 dark:text-white">
                    {(project.amount_raised / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-3 text-gray-900 dark:text-white">
                    {project.slots_available}
                  </td>
                  <td className="py-3 text-green-600 font-semibold">
                    {project.roi_percentage}%
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'open'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() =>
                        updateProjectStatus(
                          project.id,
                          project.status === 'open' ? 'closed' : 'open'
                        )
                      }
                      className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                    >
                      {project.status === 'open' ? 'Close' : 'Open'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Amount (UGX) *
              </label>
              <input
                type="number"
                required
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slots Available *
              </label>
              <input
                type="number"
                required
                value={formData.slots_available}
                onChange={(e) =>
                  setFormData({ ...formData, slots_available: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slot Price (UGX) *
              </label>
              <input
                type="number"
                required
                value={formData.slot_price}
                onChange={(e) => setFormData({ ...formData, slot_price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monthly ROI (%) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.roi_percentage}
                onChange={(e) =>
                  setFormData({ ...formData, roi_percentage: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </form>
      </Modal>
    </div>
  );
}
