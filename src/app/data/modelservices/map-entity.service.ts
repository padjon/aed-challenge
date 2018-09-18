import { Injectable } from '@angular/core';
import { ErrorService } from '../services';
import { MapEntity, MapEntityType } from '../models';
import { Feature, Point, BBox } from 'geojson';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Papa from 'papaparse'


@Injectable()
export class MapEntityService {
    private entities: Map<MapEntityType, Array<MapEntity>> = new Map();

    constructor(private errorService: ErrorService, private httpClient: HttpClient) {
        this.initMap();
    }

    private initMap() {
        for (const value of this.getEnumValues(MapEntityType)) {
            this.entities.set(value as MapEntityType, new Array());
        }
    }

    public readCSV(): Promise<void> {
        this.initMap()
        return new Promise((resolve, reject) => {
            this.httpClient.get('http://localhost:8080/export.csv', { responseType: 'text' }).subscribe((data) => {
                const results = Papa.parse(data, {
                    header: true
                });
                for (const obj of results.data) {
                    const entity = new MapEntity();
                    for (const objKey in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, objKey)) {
                            entity[objKey] = obj[objKey];
                        }
                    }
                    if (entity.type) {
                        switch (entity.type as string) {
                            case 'Mobile responder':
                                entity.type = MapEntityType.MOBILE;
                                break;
                            case 'Cardiac Arrest':
                                entity.type = MapEntityType.EMERGENCY;
                                break;
                            case 'Ambulance':
                                entity.type = MapEntityType.AMBULANCE;
                                break;
                            case 'AED':
                                entity.type = MapEntityType.STATIONARY;
                                break;
                            case 'First responder':
                                entity.type = MapEntityType.FIRSTRESPONDER;
                                break;
                            case 'Drone':
                                entity.type = MapEntityType.DRONE;
                                break;
                        }
                        if (!this.entities.get(entity.type)) {
                            console.warn('TYPE NOT DEFINED:' + entity.type);
                        } else {
                            this.entities.get(entity.type).push(entity);
                        }
                    }
                }
                const emergencies = this.entities.get(MapEntityType.EMERGENCY);
                const stationaryAEDs = this.entities.get(MapEntityType.STATIONARY);
                resolve();
            })
        });
    }

    public getAll() {
        return this.entities;
    }

    public getByType(type: MapEntityType) {
        return this.entities.get(type);
    }

    private getEnumValues(enumType: any): Array<string> {
        return Object.keys(enumType);
    }
}
