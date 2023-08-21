import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
// import { Subject, Observable } from 'rxjs';
import {EmployeeService} from './employee.service';

// import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  employeeData:any ;
  detailEmployeeData: any;
  title = 'test';
  id: any;
  shift="";

  constructor(private employeService: EmployeeService){}
  @ViewChild('secondMap', { static: true }) getMap!: ElementRef;
  @ViewChild('currentMap') mapElement: ElementRef | undefined;
  map!: google.maps.Map;
  latitude!: number;
  longitude!: number;
  in= '';
  out= '';

  //webcam
  @ViewChild('videoElement', { static: true }) videoElement: ElementRef | undefined;
  capturedImage!: string;


  ngOnInit() {  
    this.getAllEmploye();
    this.dataMap();
  }

  getAction(event: any) {
      this.shift = event.target.value;
  }

  async openWebcam(id: any){
    this.id = id;
    this.getCurrentLocation();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  getAllEmploye(){
    this.employeService.getAllEmployee().subscribe(res => {
      console.log(res);
      this.employeeData = res.data;
    })
    console.log(this.employeeData);
  }

  getEmployee(id: any){
    this.dataMap();
    this.employeService.getEmployee(id).subscribe(res => {
      this.detailEmployeeData = [res.data];
    })
    console.log(this.detailEmployeeData);
    
  }

  deleteEmployee(id: any){
    this.employeService.deleteEmployee(id).subscribe(res => {
      console.log(res);
      
    })
    
  }

  changeId(id: any){
    this.id = id;
  }

  checkOut(id: any){
    this.id = id
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.out = `${hours}:${minutes}`;
  }

  takePicture() {
    if (this.videoElement) {
      const video = this.videoElement.nativeElement;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.capturedImage = canvas.toDataURL('image/png'); // Convert to base64 URL
      } else {
        console.error('Could not get 2D context for canvas.');
      }
    }
  }

  getCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.initMap();
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation not available');
    }
  }

  initMap() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.in = `${hours}:${minutes}`;

    const mapProperties = {
      center: new google.maps.LatLng(this.latitude, this.longitude),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
 };
 console.log(this.mapElement);
    if (this.mapElement) {
      this.map = new google.maps.Map(this.mapElement.nativeElement,    mapProperties);
      new google.maps.Marker({
        position: { lat: this.latitude, lng: this.longitude },
        map: this.map,
        title: 'Your Location'
      });
    }
  }

  dataMap() {
    const mapProperties = {
      center: new google.maps.LatLng(this.latitude, this.longitude),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    console.log(this.getMap);
    
    if (this.getMap) {
      this.map = new google.maps.Map(this.getMap.nativeElement, mapProperties);
      new google.maps.Marker({
        position: { lat: this.latitude, lng: this.longitude },
        map: this.map,
        title: 'Your Location'
      });
    }
  }
}
