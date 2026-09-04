const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Community Requests API Service
 */
export const communityRequestsApi = {
  // GET all with optional query params (area, status, priority, search)
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.area && params.area !== 'All') query.append('area', params.area);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params.search) query.append('search', params.search);

    const url = `${API_BASE}/community-requests${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch community requests');
    }
    return res.json();
  },

  // GET single
  async getById(id) {
    const res = await fetch(`${API_BASE}/community-requests/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch request');
    }
    return res.json();
  },

  // POST create
  async create(data) {
    const res = await fetch(`${API_BASE}/community-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to create community request');
    }
    return result;
  },

  // PUT update
  async update(id, data) {
    const res = await fetch(`${API_BASE}/community-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update community request');
    }
    return result;
  },

  // PATCH status
  async updateStatus(id, status) {
    const res = await fetch(`${API_BASE}/community-requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update request status');
    }
    return result;
  },

  // DELETE
  async delete(id) {
    const res = await fetch(`${API_BASE}/community-requests/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to delete community request');
    }
    return result;
  },
};
