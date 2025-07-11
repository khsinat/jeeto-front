import { useState } from 'react';
import { functions } from '@/lib/appwrite';
import { toast } from 'sonner';

interface FunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const useAppwriteFunctions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callFunction = async <T = any>(
    functionId: string,
    data?: any
  ): Promise<FunctionResponse<T>> => {
    try {
      setIsLoading(true);
      
      const response = await functions.createExecution(
        functionId,
        data ? JSON.stringify(data) : undefined
      );

      const result = JSON.parse(response.responseBody);
      
      if (!result.success) {
        toast.error(result.error || 'Function execution failed');
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Function execution error:', error);
      toast.error('Failed to execute function');
      return { success: false, error: 'Function execution failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (fileData: {
    fileId: string;
    name: string;
    size: number;
    mimeType: string;
    description?: string;
  }) => {
    return callFunction('uploadImage', fileData);
  };

  const deleteImage = async (imageId: string, fileId: string) => {
    return callFunction('deleteImage', { imageId, fileId });
  };

  const updateImage = async (imageId: string, description: string) => {
    return callFunction('updateImage', { imageId, description });
  };

  const getUnusedImages = async () => {
    return callFunction('getUnusedImages');
  };

  const markImageAsUsed = async (imageId: string, gameId: string) => {
    return callFunction('markImageAsUsed', { imageId, gameId });
  };

  return {
    isLoading,
    callFunction,
    uploadImage,
    deleteImage,
    updateImage,
    getUnusedImages,
    markImageAsUsed
  };
}; 