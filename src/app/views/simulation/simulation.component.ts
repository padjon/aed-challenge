import { Component, OnInit, OnDestroy } from '@angular/core';
import { LatLngBounds } from '@agm/core/services/google-maps-types';
import { MapsAPILoader } from '@agm/core/services/maps-api-loader/maps-api-loader';
import { View } from 'app/views/view';
import { Injector } from '@angular/core';
import { MapEntityService } from 'app/data/modelservices';
import { MapEntity, MapEntityType } from 'app/data/models';
import { HttpClient } from '@angular/common/http';

declare let google: any;

interface Result {
    srate: number,
    aedBy: string,
    aedTime: string,
    cprBy: string,
    cprTime: string
}

@Component({
    templateUrl: 'simulation.component.html'
})
export class SimulationComponent extends View implements OnInit, OnDestroy {

    public bounds: LatLngBounds = null;

    public MapEntityType = MapEntityType;
    public emergency: MapEntity = null;
    public entities: Map<MapEntityType, Array<MapEntity>> = null;
    public routes: Array<any> = new Array();
    public newEmergencyButtonText = 'New Emergency';
    public results = new Array<Result>();

    private maps = null;

    public configuration = { filters: new Object(), density: new Object(), speed: 10 };
    public curConfiguration = this.configuration;

    constructor(injector: Injector, private mapsAPILoader: MapsAPILoader, private mapEntityService: MapEntityService, private httpClient: HttpClient) {
        super(injector);
        this.entities = mapEntityService.getAll();
        for (const key of Object.keys(MapEntityType)) {
            this.configuration.filters[key] = true;
        }
        this.configuration.density[MapEntityType.MOBILE] = 2;
        this.configuration.density[MapEntityType.FIRSTRESPONDER] = 20;
    }

    public ngOnInit() {
        super.ngOnInit();
        this.mapsAPILoader.load().then(() => {
            this.maps = window['google'].maps;
        })

        setInterval(() => {
            for (const route of this.routes) {
                if (route.overview_path.length > 1) {
                    const currentPoint = route.overview_path[0];
                    const nextPoint = route.overview_path[1];
                    const segmentLength = Math.sqrt(Math.pow((nextPoint.lat() - currentPoint.lat()), 2) + Math.pow(nextPoint.lng() - currentPoint.lng(), 2));
                    if (segmentLength > route.lengthPer100MS) {
                        const factor = route.lengthPer100MS / segmentLength;
                        const newLat = factor * (nextPoint.lat() - currentPoint.lat());
                        const newLng = factor * (nextPoint.lng() - currentPoint.lng());
                        route.overview_path[0] = new google.maps.LatLng(currentPoint.lat() + newLat, currentPoint.lng() + newLng);
                    } else {
                        route.overview_path.shift();
                    }
                    if (route.overview_path.length > 1) {
                        route.srcEntity.latitude = route.overview_path[0].lat()
                        route.srcEntity.longitude = route.overview_path[0].lng()
                    }
                } else if (route.nextRoute) {
                    route.overview_path = route.nextRoute;
                    route.nextRoute = undefined;
                } else {
                    route.srcEntity.visible = false;
                }
            }
            this.routes = this.routes.filter((route) => route.overview_path.length > 0);
        }, 20)
    }

    public startSimulation() {
        this.curConfiguration = JSON.parse(JSON.stringify(this.configuration));
        this.mapEntityService.readCSV().then(() => {
            this.maps = window['google'].maps;

            this.routes = new this.Array();
            const emergencies = this.mapEntityService.getByType(MapEntityType.EMERGENCY);
            this.emergency = (emergencies) ? emergencies[0] : null
            this.entities = this.mapEntityService.getAll();
            console.log(this.entities);
            for (const stationaryAED of this.entities.get(MapEntityType.STATIONARY)) {
                const bystander = new MapEntity();
                bystander.type = MapEntityType.BYSTANDER;
                bystander.latitude = this.emergency.latitude;
                bystander.longitude = this.emergency.longitude;
                this.entities.get(MapEntityType.BYSTANDER).push(bystander);
                this.createRoute(bystander, stationaryAED);
            }
            for (const type of Object.keys(MapEntityType)) {
                if (type !== MapEntityType.EMERGENCY && type !== MapEntityType.STATIONARY && type !== MapEntityType.BYSTANDER) {
                    const entities = this.entities.get(type as MapEntityType);
                    if (entities) {
                        for (const entity of entities) {
                            this.createRoute(entity, this.emergency);
                        }
                    }
                }
            }

            setTimeout(() => {
                let shortestAEDRoute = null;
                let shortestRoute = null;
                for (const route of this.routes) {
                    const nextDuration = route.duration
                    const currentAEDuration = (shortestAEDRoute) ? shortestAEDRoute.duration : 9999
                    const currentDuration = (shortestRoute) ? shortestRoute.duration : 9999
                    console.log(nextDuration + ' ' + currentDuration);
                    if (shortestRoute == null || currentDuration > nextDuration) {
                        console.log('New shortest Route');
                        console.log(route)
                        shortestRoute = route;
                    }

                    if (route.srcEntity.type !== MapEntityType.FIRSTRESPONDER && (shortestAEDRoute == null || currentAEDuration > nextDuration)) {
                        shortestAEDRoute = route;
                    }
                }
                const curAEDuration = (shortestAEDRoute) ? ((shortestAEDRoute.srcEntity.type === MapEntityType.BYSTANDER) ? shortestAEDRoute.duration * 2 : shortestAEDRoute.duration) : 9999
                const curDuration = (shortestRoute) ? ((shortestRoute.srcEntity.type === MapEntityType.BYSTANDER) ? shortestRoute.duration * 2 : shortestRoute.duration) : 9999
                const srate = 0.7 - 0.02 * (curDuration / 60) - 0.05 * (curAEDuration / 60);
                let aedTime = '';
                let aedBy = ''
                if (shortestAEDRoute) {
                    const duration = shortestAEDRoute.duration;
                    aedTime = this.fancyTimeFormat(duration);
                    aedBy = shortestAEDRoute.srcEntity.type;
                }

                let cprTime = '';
                let cprBy = '';
                if (shortestRoute) {
                    const duration = shortestRoute.duration;
                    cprTime = this.fancyTimeFormat(duration);
                    cprBy = shortestRoute.srcEntity.type;
                }

                let finalRate = Math.floor(srate * 100);

                if (finalRate < 0) {
                    finalRate = 0;
                }

                const simResult = { srate: finalRate, aedTime: aedTime, aedBy: aedBy, cprTime: cprTime, cprBy: cprBy };
                /*
                    aedBy: string,
    aedTime: string,
    cprBy: string,
    cprTime: string
    */
                this.results.push(simResult);
                // this.updateBounds();
            }, 1000)
        })
    }

    private fancyTimeFormat(time) {
        console.log(time);
        time = Math.floor(time);
        const minutes = Math.floor(time / 60);
        const seconds = time - minutes * 60;
        console.log(seconds);
        const finalTime = this.str_pad_left(minutes, '0', 2) + ':' + this.str_pad_left(seconds, '0', 2);
        return finalTime;
    }

    private str_pad_left(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }

    public startEmergency() {
        this.results = new Array<Result>();
        this.curConfiguration = JSON.parse(JSON.stringify(this.configuration));
        const line = this.curConfiguration.density[MapEntityType.MOBILE] + ',' + this.curConfiguration.density[MapEntityType.FIRSTRESPONDER];
        this.newEmergencyButtonText = 'Creation in progress...'
        this.httpClient.get('http://localhost:8080/setParams/' + line, { responseType: 'text' }).subscribe((data) => {
            this.newEmergencyButtonText = 'New Emergency'
            this.successMessage('Success', 'New Emergency created!')
        });
    }

    public createRoute(srcEntity: MapEntity, dstEntity: MapEntity) {
        if (this.curConfiguration.filters[srcEntity.type]) {
            if (srcEntity.type === MapEntityType.DRONE) {
                const lengthInMeters = this.getDistance(new google.maps.LatLng(srcEntity.latitude, srcEntity.longitude), new google.maps.LatLng(dstEntity.latitude, dstEntity.longitude))
                const route = { color: '#00ff00', srcEntity: srcEntity, dstEntity: dstEntity, duration: 0, lengthPer100MS: 0, length: 0, overview_path: new Array() }
                route.length = Math.sqrt(Math.pow((dstEntity.latitude - srcEntity.latitude), 2) + Math.pow(dstEntity.longitude - srcEntity.longitude, 2));
                route.duration = lengthInMeters / ((50 / (60 * 60)) * 1000);

                route.lengthPer100MS = (route.length / (route.duration * 1000)) * 20 * this.curConfiguration.speed;
                route.overview_path.push(new google.maps.LatLng(srcEntity.latitude, srcEntity.longitude));
                route.overview_path.push(new google.maps.LatLng(dstEntity.latitude, dstEntity.longitude));

                console.log(route);
                this.routes.push(route);
            } else {
                const directionsService = new google.maps.DirectionsService;
                directionsService.route({
                    origin: new google.maps.LatLng(srcEntity.latitude, srcEntity.longitude),
                    destination: new google.maps.LatLng(dstEntity.latitude, dstEntity.longitude),
                    travelMode: (srcEntity.type !== MapEntityType.BYSTANDER && srcEntity.type !== MapEntityType.FIRSTRESPONDER) ? 'DRIVING' : 'WALKING'
                }, (response, status) => {
                    if (status === 'OK') {
                        for (const route of response.routes) {
                            route.srcEntity = srcEntity;
                            route.dstEntity = dstEntity;
                            let startPoint = null;
                            let endPoint = null;
                            let length = 0;
                            for (const point of route.overview_path) {
                                if (startPoint) {
                                    endPoint = startPoint;
                                    startPoint = point;
                                    length += Math.sqrt(Math.pow((endPoint.lat() - startPoint.lat()), 2) + Math.pow(endPoint.lng() - startPoint.lng(), 2));
                                } else {
                                    startPoint = point;
                                }
                            }
                            route.color = '#999999'
                            switch (srcEntity.type) {
                                case MapEntityType.BYSTANDER: {
                                    route.color = '#333333'
                                } break;
                                case MapEntityType.AMBULANCE: {
                                    route.color = '#ff425e'
                                } break;
                                case MapEntityType.MOBILE: {
                                    route.color = '#0015ff'
                                } break;
                            }
                            route.length = length;
                            route.duration = route.legs[0].duration.value;
                            route.lengthPer100MS = (length / (route.duration * 1000)) * 20 * this.curConfiguration.speed;

                            if (srcEntity.type === MapEntityType.BYSTANDER) {
                                route.nextRoute = route.overview_path.slice().reverse();
                                route.duration *= 2;
                            }
                            this.routes.push(route);
                        }
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });
                /*
                        const onChangeHandler = function () {
                            calculateAndDisplayRoute(directionsService, directionsDisplay);
                        };
                        document.getElementById('start').addEventListener('change', onChangeHandler);
                        document.getElementById('end').addEventListener('change', onChangeHandler);
                    }

                          function calculateAndDisplayRoute(directionsService, directionsDisplay) {
                            directionsService.route({
                              origin: document.getElementById('start').value,
                              destination: document.getElementById('end').value,
                              travelMode: 'DRIVING'
                            }, function(response, status) {
                              if (status === 'OK') {
                                directionsDisplay.setDirections(response);
                              } else {
                                window.alert('Directions request failed due to ' + status);
                              }
                            });*/
            }
        }
    }


    public ngOnDestroy() {
        super.ngOnDestroy();
    }

    public getMarkers(type: MapEntityType): Array<MapEntity> {
        if (!this.curConfiguration.filters[type] || (type === MapEntityType.STATIONARY && !this.curConfiguration.filters[MapEntityType.BYSTANDER])) {
            return new Array();
        }
        return this.entities.get(type).filter(emergency => emergency.visible);
    }


    private updateBounds() {
        this.bounds = new this.maps.LatLngBounds()
        for (const type of Object.keys(MapEntityType)) {
            for (const entity of this.getMarkers(type as MapEntityType)) {
                this.bounds.extend(new this.maps.LatLng(entity.latitude, entity.longitude));
            }
        }
    }

    private rad(x) {
        return x * Math.PI / 180;
    };

    private getDistance(p1, p2) {
        const R = 6378137; // Earth’s mean radius in meter
        const dLat = this.rad(p2.lat() - p1.lat());
        const dLong = this.rad(p2.lng() - p1.lng());
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d; // returns the distance in meter
    };
}
