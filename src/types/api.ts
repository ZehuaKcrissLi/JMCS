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
  script?: string;
  stats?: VideoStats | null;
  title: string;
  thumbnail: string;
}

export interface VideoGenerateRequest {
  productId: string;
  dishes: string[];
  prompt: string;
  numVideos: number;
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
  numVideos: number;
}