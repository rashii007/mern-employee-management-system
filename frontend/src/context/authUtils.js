export const normalizeAuthUser = (data) => {
  if (!data) return null;

  if (data.user && typeof data.user === 'object') {
    return data.user;
  }

  return data;
};
