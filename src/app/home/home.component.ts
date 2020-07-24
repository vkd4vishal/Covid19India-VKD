import { Component, OnInit, ɵConsole } from '@angular/core';
import { CovidApiService } from '../covid-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private __api: CovidApiService) { }
  totalConfirmed;
  totalActive;
  totalRecovered;
  totalDeath;
  totalTested;
  stateCode = [];
  stateCases = new Map();
  districtCases = new Map();
  stateShow = new Map();

  ngOnInit(): void {
    this.__api.getStateCases().subscribe((res: any) => {
      for (const state in res) {
        this.stateShow.set(state.toString(), false);

        // console.log(state)
        var currentstate = res[state];
        this.districtCases.set(state, []);

        for (const dist in currentstate.districts) {
          var tempState = currentstate.districts
          var currentdistrict = tempState[dist];
          if (currentdistrict == undefined || currentdistrict.total == undefined)
            continue;
          var c = currentdistrict.total.confirmed;
          if (c == undefined)
            c = 0;
          var d = currentdistrict.total.deceased;
          if (d == undefined)
            d = 0;
          var r = currentdistrict.total.recovered;
          if (r == undefined)
            r = 0;
          var a = (c - r - d).toString();


          var t = currentdistrict.total.tested;
          if (t == undefined)
            t = 0;
          c = c.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          d = d.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          r = r.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          a = a.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          t = t.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.districtCases.get(state).push({ name: dist, c: c, d: d, r: r, a: a, t: t });

        }






        if (state == 'TT') {
          this.totalConfirmed = res[state].total.confirmed.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.totalDeath = res[state].total.deceased.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.totalRecovered = res[state].total.recovered.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          var tempActive = res[state].total.confirmed - res[state].total.recovered - res[state].total.deceased;
          this.totalActive = tempActive.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.totalTested = res[state].total.tested.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        }
        const st = state;
        if (res[state].total == undefined)
          continue;
        var c = res[state].total.confirmed;
        var d = res[state].total.deceased;
        if (d == undefined)
          d = 0;
        var r = res[state].total.recovered;
        var a = (c - r - d).toString();
        var t = res[state].total.tested;
        c = c.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        d = d.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        r = r.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        a = a.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        t = t.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
        this.stateCases.set(st, { c: c, d: d, r: r, a: a, t: t });
      }
    });
    this.__api.getStateCodes().subscribe((res: any) => {
      for (const state in res) {
        if (this.stateCases.has(res[state].statecode)) {
          this.stateCode.push({ code: res[state].statecode, name: state, show: false });

        }

      }
      this.stateCode.shift();//remove first element of statesCode which is "unassigned"

    });

  }
  // poco(){
  //   alert('h')
  //   for(const st in this.districtCases){
  //     // var arr=this.districtCases.get(st);
  //     // for(var i=0;i<arr.length;i++){
  //     //   console.log(arr[i].name);
  //     // }
  //     console.log(st)
  //   }
  //   console.log(this.districtCases.get('UP')[0])
  // }
  toggle(state) {
    // console.log(this.stateShow.has(state))
    // console.log(state.toString())
    // console.log(this.stateShow[state.toString()])
    // this.stateShow[state.toString()]=true;
    var temp=this.stateShow.get(state);
    this.stateShow.set(state,!temp);
  }
  kaun(state){
    return this.stateShow.get(state);
  }
}
