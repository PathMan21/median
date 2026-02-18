export interface Film {
  id: number;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFilmRequest {
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  genre: string;
}

export interface UpdateFilmRequest extends Partial<CreateFilmRequest> {}
