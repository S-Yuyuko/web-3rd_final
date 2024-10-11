import axios, { AxiosError } from 'axios';

// Fetch all admins
export const fetchAdmins = async () => {
  try {
    const response = await axios.get(`api/admins`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || 'Failed to fetch admins.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

// Add a new admin
export const addAdmin = async (account: string, password: string) => {
  try {
    const response = await axios.post(
      `api/admins`,
      { account, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || 'Failed to add admin.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

// Update admin password by account
export const updateAdmin = async (account: string, password: string) => {
  try {
    const response = await axios.put(
      `api/admins/${account}`,
      { password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || 'Failed to update admin password.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

// Delete an admin by account
export const deleteAdmin = async (account: string) => {
  try {
    await axios.delete(`api/admins/${account}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || 'Failed to delete admin.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};
