export interface VideoStats {
  views: number;
  followers: number;
  retention: number;
  conversion: number;
  sales: number;
}

export interface Video {
  id: number;
  url: string;
  stats?: VideoStats | null;
}

export interface VideoGenerateRequest {
  productId: string;
  dishes: string[];
  prompt: string;
}

export interface VideoGenerateResponse {
  success: boolean;
  data: Record<string, Video[]>;
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

export interface PromptGenerateRequest {
  productName: string;
  dishes: string[];
}