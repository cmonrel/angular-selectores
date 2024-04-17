import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CountriesService } from '../../services/countries.service';

import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'country-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public countriesByAlphaCode: SmallCountry[] = [];


  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required]
  })



  constructor(
    private fb: FormBuilder,
    private cs: CountriesService,
  ) {}

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  get regions(): Region[] {
    return this.cs.regions;
  }

  private onRegionChange(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('country')!.setValue('')),
        tap( () => this.countriesByAlphaCode = []),
        switchMap( region => this.cs.getCountriesByRegion(region)),
      )
      .subscribe( region => {
        // console.log('region:', {region});
        this.countriesByRegion = region;
      });
  }

  private onCountryChange(): void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('border')!.setValue('')),
        filter((value: string) => value.length > 0),
        switchMap( alphaCode => this.cs.getCountryByAlphaCode(alphaCode)),
        switchMap( country => this.cs.getCountryBordersByCode(country.borders))
      )
      .subscribe( border => {
        // console.log({border});
        this.countriesByAlphaCode = border;
      });
  }
}
