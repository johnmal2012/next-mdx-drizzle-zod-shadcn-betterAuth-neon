import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  // Declare your Neon services here
  buckets: {
    // 'physician-audio': { access: 'public_read' },
    // 'physician-audio': { access: 'private' },
    'profile-audio': { access: 'private' },
  },
  aiGateway: false,
  auth: false,
  dataApi: false,
  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      // Default branch: no overrides, uses project defaults
      return {};
    }
    if (!branch.exists) {
      // New non-default branches: auto-expire
      // Run `neon checkout <name>` to create a new branch with these settings
      return { ttl: '7d' };
    }
    // Existing branch: no changes
    return {};
  },
});
