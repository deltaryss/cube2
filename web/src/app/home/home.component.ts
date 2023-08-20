import { Component, OnInit } from '@angular/core';
import { HomeBarService } from '../services/home-bar.service';
import { GetDataService } from '../services/get-data.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  selectedData: any;
  releveNumber!: number;

  allData!: [any];

  Labels: any[] = [];
  temperatureData: any[] = [];
  humidityData: any[] = [];
  batteryData: any[] = [];

  tempChart!: Chart;
  humChart!: Chart;
  batChart!: Chart;

  constructor(private dataService: GetDataService, private sharedService: HomeBarService) {}

  ngOnInit() {
    this.sharedService.selectedData$.subscribe(data => {
      this.selectedData = data;
      this.getData();
    });
  }

  getData() {
    this.dataService.getData(this.releveNumber, this.selectedData).subscribe(response => {
      this.allData = response;
      this.sortData();
    });
  }

  readableDate(date: any) {
    //2023-08-19T13:21:33.000Z
    date = date.toString();
    var year = date.substring(0, 4);
    var month = date.substring(5, 7);
    var day = date.substring(8, 10);
    var hour = date.substring(11, 13);
    var minute = date.substring(14, 16);
    var second = date.substring(17, 19);
    return hour + ":" + minute + ":" + second + " " + day + "/" + month + "/" + year;
  }

  sortData() {
    this.Labels = [];
    this.temperatureData = [];
    this.humidityData = [];
    this.batteryData = [];
    this.allData.forEach((element: any) => {
      var date = this.readableDate(element.date);
      var temperature = element.temperature/10;
      var humidity = element.humidite;
      var battery = element.batterie_voltage/1000;

      this.Labels.push(date);
      this.temperatureData.push(temperature);
      if (humidity != 255) this.humidityData.push(humidity);
      this.batteryData.push(battery);
    });

    this.Labels.reverse();
    this.temperatureData.reverse();
    this.humidityData.reverse();
    this.batteryData.reverse();

    this.charts();
  }

  quantityInput(event: any) {
    if (event.target.value > 50) {
      alert("Vous ne pouvez pas choisir plus 50 relevés");
      event.target.value = 50;
    } else if (event.target.value < 1) {
      alert("Vous ne pouvez pas choisir moins de 1 relevés");
      event.target.value = 1;
    }

    this.releveNumber = event.target.value;
    this.getData();
  }

  charts() {
    if (this.tempChart) this.tempChart.destroy();
    this.tempertureChart();
    if (this.humChart) this.humChart.destroy();
    this.humidityChart();
    if (this.batChart) this.batChart.destroy();
    this.batteryChart();
  }

  tempertureChart() {
    this.tempChart = new Chart("temperatureChart", {
      type: 'line',
      data: {
        labels: this.Labels,
        datasets: [{
          label: 'Température',
          data: this.temperatureData,
          borderColor: 'rgb(255, 99, 50)',
          backgroundColor: 'rgba(255, 99, 50, 0.5)',
          tension: 0.1
        }],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: 'white',
            },
          },
        },
        scales: {
          y: {
            ticks: {
              color: 'white',
            },
          },
          x: {
            ticks: {
              color: 'black',
            },
          },
        },
      }
    });
  }
  humidityChart() {
    //check if there is humidity data
    if (this.humidityData.length != 0) {
      this.humChart = new Chart("humidityChart", {
        type: 'line',
        data: {
          labels: this.Labels,
          datasets: [{
            label: 'Humidité',
            data: this.humidityData,
            borderColor: 'rgb(50, 99, 255)',
            backgroundColor: 'rgba(50, 99, 255, 1)',
            tension: 0.1
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: 'white',
              },
            },
          },
          scales: {
            y: {
              ticks: {
                color: 'white',
              },
            },
            x: {
              ticks: {
                color: 'black',
              },
            },
          },
        }
      });
    }
  }

  batteryChart() {
    this.batChart = new Chart("batteryChart", {
      type: 'line',
      data: {
        labels: this.Labels,
        datasets: [{
          label: 'Batterie',
          data: this.batteryData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: 'white',
            },
          },
        },
        scales: {
          y: {
            ticks: {
              color: 'white',
            },
          },
          x: {
            ticks: {
              color: 'black',
            },
          },
        },
      }
    });
  }
}
