export interface VideoGenerateRequest {
  productId: string;
  dishes: string[];
  prompt?: string;
}

export interface VideoResponse {
  success: boolean;
  data: {
    [dishId: string]: {
      id: number;
      url: string;
    }[];
  };
}

export interface VideoStats {
  views: number;
  followers: number;
  retention_3: number;
  retention_5: number;
  conversion: number;
  sales: number;
}

export interface PromptGenerateRequest {
  productName: string;
  dishes: string[];
}