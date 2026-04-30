export const awsConfig = {
  mapName: import.meta.env.VITE_AWS_MAP_NAME || '',
  apiKey: import.meta.env.VITE_AWS_API_KEY || '',
  region: import.meta.env.VITE_AWS_REGION || 'ap-southeast-1',
};
