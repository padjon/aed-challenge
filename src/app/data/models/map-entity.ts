
export enum MapEntityType {
    MOBILE = 'MOBILE',
    STATIONARY = 'STATIONARY',
    AMBULANCE = 'AMBULANCE',
    EMERGENCY = 'EMERGENCY',
    BYSTANDER = 'BYSTANDER',
    FIRSTRESPONDER = 'FIRSTRESPONDER',
    DRONE = 'DRONE'
}

export class MapEntity {

    private _latitude: number;
    private _longitude: number;
    private _type: MapEntityType;
    private _visible: boolean;

    constructor() {
        this.visible = true;
    }

    /**
     * Getter latitude
     * @return {number}
     */
    public get latitude(): number {
        return this._latitude;
    }

    /**
     * Getter longitude
     * @return {number}
     */
    public get longitude(): number {
        return this._longitude;
    }
    /**
     * Setter latitude
     * @param {number} value
     */
    public set latitude(value: number) {
        this._latitude = Number(value);
    }

    /**
     * Setter longitude
     * @param {number} value
     */
    public set longitude(value: number) {
        this._longitude = Number(value);
    }

    /**
     * Getter type
     * @return {MapEntityType}
     */
    public get type(): MapEntityType {
        return this._type;
    }

    /**
     * Setter type
     * @param {MapEntityType} value
     */
    public set type(value: MapEntityType) {
        this._type = value;
    }


    /**
     * Getter visible
     * @return {boolean}
     */
    public get visible(): boolean {
        return this._visible;
    }

    /**
     * Setter visible
     * @param {boolean} value
     */
    public set visible(value: boolean) {
        this._visible = value;
    }

}
