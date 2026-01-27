
import { LLMConfig } from '@/types/llm_config';

export const UserConfigApi = {
  getConfig: async (): Promise<LLMConfig> => {
    const res = await fetch('/api/user-config');
    if (!res.ok) throw new Error('Failed to fetch config');
    return res.json();
  },

  updateConfig: async (config: Partial<LLMConfig>): Promise<LLMConfig> => {
    const res = await fetch('/api/user-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Failed to update config');
    return res.json();
  },

  toggleFavorite: async (templateId: string): Promise<string[]> => {
    const config = await UserConfigApi.getConfig();
    const currentFavorites = config.favorite_templates || [];
    let newFavorites;
    
    if (currentFavorites.includes(templateId)) {
      newFavorites = currentFavorites.filter(id => id !== templateId);
    } else {
      newFavorites = [...currentFavorites, templateId];
    }
    
    await UserConfigApi.updateConfig({ favorite_templates: newFavorites });
    return newFavorites;
  }
};
