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
  delta_totalConfirmed;
  delta_totalActive;
  delta_totalDeath;
  delta_totalRecovered;
  stateCode = [];
  stateCases = new Map();
  districtCases = new Map();
  stateShow = new Map();
  deltaState=new Map();
  deltaDistrict = new Map();
  ngOnInit(): void {
    this.__api.getStateCases().subscribe((res: any) => {
      for (const state in res) {
        this.stateShow.set(state.toString(), false);
        if(res[state].delta == undefined){
          this.deltaState.set(state.toString(),{c:0,a:0,d:0,r:0});
        }else{
          var deltac = res[state].delta.confirmed;
          if (deltac == undefined)
          deltac = 0;
          var deltad = res[state].delta.deceased;
          if (deltad == undefined)
          deltad = 0;
          var deltar = res[state].delta.recovered;
          if (deltar == undefined)
          deltar = 0;
          var deltaa = (deltac - deltar - deltad).toString();
          deltac = deltac.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          deltad = deltad.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          deltar = deltar.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          deltaa = deltaa.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          if (state == 'TT') {
            this.delta_totalConfirmed = deltac;
            this.delta_totalDeath =deltad;
            this.delta_totalRecovered = deltar;
            this.delta_totalActive = deltaa;
          }
          this.deltaState.set( state.toString(), { c: deltac, d: deltad, r: deltar, a: deltaa, });
          
        }
        var currentstate = res[state];
        this.districtCases.set(state, []);
        for (const dist in currentstate.districts) {
          var tempState = currentstate.districts
          var currentdistrict = tempState[dist];
                  //delta district starts here
                  
                  if(currentdistrict.delta == undefined){
                    this.deltaDistrict.set(currentdistrict.toString(),{c:0,a:0,d:0,r:0});
                  }else{
                    var deltac = currentdistrict.delta.confirmed;
                    if (deltac == undefined)
                    deltac = 0;
                    var deltad = currentdistrict.delta.deceased;
                    if (deltad == undefined)
                    deltad = 0;
                    var deltar = currentdistrict.delta.recovered;
                    if (deltar == undefined)
                    deltar = 0;
                    var deltaa = (deltac - deltar - deltad).toString();
                    deltac = deltac.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    deltad = deltad.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    deltar = deltar.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    deltaa = deltaa.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    this.deltaDistrict.set( dist.toString(), { c: deltac, d: deltad, r: deltar, a: deltaa, });
                    // console.log(dist.toString());
                    console.log(dist.toString(),this.deltaDistrict.get(dist.toString()))
                    
                  }//delta district ends here
          console.log(this.deltaDistrict.get(dist.toString()))
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

        //getting total cases for the country
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
  toggle(state) {
    var temp=this.stateShow.get(state);
    this.stateShow.set(state,!temp);
  }
  show(state){
    return this.stateShow.get(state);
  }
  activateState(state_code){
    if(this.show(state_code.toString())){
      document.getElementById(state_code.toString()).style.backgroundColor="#494747";
    }else{
      document.getElementById(state_code.toString()).style.backgroundColor="#303030";
    }
  }
}
