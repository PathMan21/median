export interface Cinema {
    id: number;
    name: string;
    address: string;
    city: string;
    phone: string;
    capacity: number;
    createdAt: string;
    updatedAt: string;
}
export interface CreateCinemaRequest {
    name: string;
    address: string;
    city: string;
    phone: string;
    capacity: number;
}
export interface UpdateCinemaRequest extends Partial<CreateCinemaRequest> {
}
