export interface VehicleDetails {
    id?: string;
    type: string;
    entryTime: Date;
    exitTime?: Date;
    isParked: boolean;
}

export interface ParkingSlot {
    [key: string]: number
}
