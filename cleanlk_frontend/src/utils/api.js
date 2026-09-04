const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Waste Locations API Service
 */
export const wasteLocationsApi = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.area && params.area !== 'All') query.append('area', params.area);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);

    const url = `${API_BASE}/locations${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch waste locations');
    }
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`${API_BASE}/locations/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch location');
    }
    return res.json();
  },

  async create(data) {
    const res = await fetch(`${API_BASE}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to create location');
    }
    return result;
  },

  async update(id, data) {
    const res = await fetch(`${API_BASE}/locations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update location');
    }
    return result;
  },

  async delete(id) {
    const res = await fetch(`${API_BASE}/locations/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to delete location');
    }
    return result;
  },
};

/**
 * Collection Schedules API Service
 */
export const collectionSchedulesApi = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.area && params.area !== 'All') query.append('area', params.area);
    if (params.wasteType && params.wasteType !== 'All') query.append('wasteType', params.wasteType);
    if (params.day && params.day !== 'All') query.append('day', params.day);
    if (params.search) query.append('search', params.search);

    const url = `${API_BASE}/schedules${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch collection schedules');
    }
    return res.json();
  },

  async create(data) {
    const res = await fetch(`${API_BASE}/schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to create schedule');
    }
    return result;
  },

  async update(id, data) {
    const res = await fetch(`${API_BASE}/schedules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update schedule');
    }
    return result;
  },

  async delete(id) {
    const res = await fetch(`${API_BASE}/schedules/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to delete schedule');
    }
    return result;
  },
};

/**
 * Community Requests API Service
 */
export const communityRequestsApi = {
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

  async getById(id) {
    const res = await fetch(`${API_BASE}/community-requests/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch request');
    }
    return res.json();
  },

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

/**
 * Waste Reports API Service
 */
export const wasteReportsApi = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.area && params.area !== 'All') query.append('area', params.area);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.severity && params.severity !== 'All') query.append('severity', params.severity);
    if (params.search) query.append('search', params.search);

    const url = `${API_BASE}/reports${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch waste reports');
    }
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`${API_BASE}/reports/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch report');
    }
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/reports/stats`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch report stats');
    }
    return res.json();
  },

  async create(data) {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to create report');
    }
    return result;
  },

  async update(id, data) {
    const res = await fetch(`${API_BASE}/reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update report');
    }
    return result;
  },

  async updateStatus(id, status) {
    const res = await fetch(`${API_BASE}/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update report status');
    }
    return result;
  },

  async delete(id) {
    const res = await fetch(`${API_BASE}/reports/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Failed to delete report');
    }
    return result;
  },
};

