import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../services/get-data.service';
import { HomeBarService } from '../services/home-bar.service';

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
      this.selectData(this.sondeList[0]);
    });
  }

  selectData(data: any) {
    if (data == "all") {data = ""}
    console.log(data);
    this.sharedService.setSelectedData(data);
  }

}
