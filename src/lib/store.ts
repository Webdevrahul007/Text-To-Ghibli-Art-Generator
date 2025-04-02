import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GenerationHistory {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  createdAt: number;
  parameters: GenerationParameters;
}

export interface GenerationParameters {
  negativePrompt: string;
  steps: number;
  guidanceScale: number;
  width: number;
  height: number;
}

export interface GhibliModel {
  id: string;
  name: string;
  description: string;
  modelId: string;
  promptPrefix: string;
  isDefault?: boolean;
  isPaid?: boolean;
}

interface AppState {
  history: GenerationHistory[];
  parameters: GenerationParameters;
  selectedModel: GhibliModel;
  availableModels: GhibliModel[];
  galleryImages: GenerationHistory[];

  // Actions
  addToHistory: (generation: Omit<GenerationHistory, 'id' | 'createdAt'>) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  updateParameters: (params: Partial<GenerationParameters>) => void;
  setSelectedModel: (modelId: string) => void;
  addToGallery: (generation: GenerationHistory) => void;
}

export const defaultParameters: GenerationParameters = {
  negativePrompt: "low quality, blurry, distorted, deformed, disfigured",
  steps: 30,
  guidanceScale: 7.5,
  width: 512,
  height: 512,
};

export const availableModels: GhibliModel[] = [
  {
    id: 'ghibli-diffusion',
    name: 'Ghibli Diffusion',
    description: 'Free open-source model trained on Studio Ghibli images',
    modelId: 'nitrosocke/Ghibli-Diffusion',
    promptPrefix: 'ghibli style',
    isDefault: true,
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      history: [],
      parameters: { ...defaultParameters },
      selectedModel: availableModels.find(m => m.isDefault) || availableModels[0],
      availableModels,
      galleryImages: [],

      addToHistory: (generation) => set((state) => ({
        history: [
          {
            ...generation,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
          },
          ...state.history,
        ].slice(0, 30), // Keep only the last 30 generations
      })),

      clearHistory: () => set({ history: [] }),

      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter((item) => item.id !== id),
      })),

      updateParameters: (params) => set((state) => ({
        parameters: {
          ...state.parameters,
          ...params,
        },
      })),

      setSelectedModel: (modelId) => set((state) => ({
        selectedModel: state.availableModels.find((m) => m.id === modelId) || state.availableModels[0],
      })),

      addToGallery: (generation) => set((state) => {
        // Check if image is already in gallery
        if (state.galleryImages.some(g => g.id === generation.id)) {
          return state;
        }

        return {
          galleryImages: [generation, ...state.galleryImages],
        };
      }),
    }),
    {
      name: 'ghibli-art-storage',
      partialize: (state) => ({
        history: state.history,
        parameters: state.parameters,
        selectedModel: state.selectedModel.id,
        galleryImages: state.galleryImages,
      }),

      // Handle hydration of state from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reselect model after rehydration
          const modelId = typeof state.selectedModel === 'string'
            ? state.selectedModel
            : state.selectedModel?.id;

          if (modelId) {
            state.setSelectedModel(modelId);
          }
        }
      }
    }
  )
);
