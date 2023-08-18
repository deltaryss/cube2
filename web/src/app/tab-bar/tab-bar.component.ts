import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../services/get-data.service';
import { HomeBarService } from '../services/home-bar.service'; // Assurez-vous du chemin correct

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent implements OnInit {

  sondeList = [];

  constructor(private dataService: GetDataService, private sharedService: HomeBarService) { }

  ngOnInit() {
    this.getSondeList();
  }

  getSondeList() {
    this.dataService.getSondeList().subscribe(response => {
      this.sondeList = response;
    });


  }

  selectData(data: any) {
    console.log(data);
    this.sharedService.setSelectedData(data);
  }

}
