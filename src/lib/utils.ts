import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

// import axios from 'axios';
const axios = require('axios');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR' | 'GBP' | 'BDT';
    notation?: Intl.NumberFormatOptions['notation'];
  } = {},
) {
  const {currency = 'USD', notation = 'compact'} = options;

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

// lib/utils.js

export const calculateShippingCost = (distance: number): number => {
  const freeDistance = 5; // Distance in miles that is free
  const chargePerMile = 0.5; // Charge per mile from the 6th mile onward

  if (distance <= freeDistance) {
    return 0; // Free delivery up to 5 miles
  } else {
    const extraMiles = distance - freeDistance;
    return Math.round(extraMiles * chargePerMile);
  }
};

export interface ILocation {
  longitude: number;
  latitude: number;
}

export const STORE_LOCATION: ILocation = {
  longitude: 7.4481664,
  latitude: 9.0570752,
};
// const STORE_LOCATION: ILocation = {
//   longitude: -104.99870832482931,
//   latitude: 39.744764212876184,
// };

async function calcDistance(start: ILocation, end: ILocation) {
  const res = await axios({
    method: 'post',
    url: 'https://api.openrouteservice.org/v2/directions/driving-car',
    headers: {
      Accept:
        'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
      Authorization: '5b3ce3597851110001cf624874d084aa86bb4310b3e4853c62e544b0',
      'Content-Type': 'application/json; charset=utf-8',
    },
    data: {
      coordinates: [
        [start.longitude, start.latitude],
        [end.longitude, end.latitude],
      ],
      instructions: 'false',
      suppress_warnings: 'true',
      units: 'mi',
      geometry: 'false',
    },
  });

  console.log('calculated distance', res.data?.routes?.[0]?.summary?.distance);
  return res.data?.routes?.[0]?.summary?.distance;
}

export async function calcDistanceFrom(destination: ILocation) {
  return calcDistance(STORE_LOCATION, destination);
}

// calcDistance(
//   { longitude: 7.469552, latitude: 9.084377 },
//   { longitude: 3.3792057, latitude: 6.5243793 },
// );

export const countriesSet = new Set(['CA', 'CAN', 'US', 'USA', 'NG']);
// export const defaultCountryParam = 'CA,CAN,US,USA';
export const defaultCountryParam = 'NG';

export async function searchLocation(
  address: string = '',
  city: string = '',
  countryCode: string = defaultCountryParam,
): Promise<
  Array<{ address: string; location: ILocation; isConfident: boolean }>
> {
  if (!countriesSet.has(countryCode)) countryCode = defaultCountryParam;
  const searchParam = new URLSearchParams();
  searchParam.append('text', `${address} ${city}`);
  let res
  try{
    res = await axios({
      method: 'get',
      url: `/api/location/search?${searchParam.toString()}`,
      // url: `https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf624874d084aa86bb4310b3e4853c62e544b0&text=40%20Ajose%20Adeogun%20Abuja&boundary.country=NG`,
      headers: {
        Accept:
          'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        Authorization: '5b3ce3597851110001cf624874d084aa86bb4310b3e4853c62e544b0',
      },
    });
  }catch{
    return []
  }


  const result = res.data?.features?.map?.(
    (f: {
      properties: {
        [x: string]: number;
        label: any;
      };
      geometry: { coordinates: any[] };
    }) => ({
      isConfident: f?.properties?.confidence >= 0.5,
      address: f?.properties?.label,
      location: {
        longitude: f?.geometry?.coordinates?.[0],
        latitude: f?.geometry?.coordinates?.[1],
      },
    }),
  );

  console.log('response', result);

  return result;
}

export async function searchAutocompleteLocations(
  place: string = '',
  countryCode: string = defaultCountryParam,
): Promise<
  Array<{ address: string; location: ILocation; isConfident: boolean }>
> {
  if (!place) return []
  console.log('searching for', place);
  countryCode = defaultCountryParam;
  // if (!countriesSet.has(countryCode)) countryCode = defaultCountryParam;
  const searchParam = new URLSearchParams();
  searchParam.append('text', `${place}`);

  let res;
  try {
    res = await axios({
      method: 'get',
      // url: `https://api.openrouteservice.org/geocode/autocomplete?api_key=5b3ce3597851110001cf624874d084aa86bb4310b3e4853c62e544b0&${searchParam.toString()}&boundary.country=${countryCode}`,
      url: `/api/location/search?${searchParam.toString()}`,
      headers: {
        Accept:
          'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        Authorization: '5b3ce3597851110001cf624874d084aa86bb4310b3e4853c62e544b0',
      },
    });
  } catch (err) {
    console.log("error occurred while searching", err)
    return []
  }
  const result = res.data?.features?.map?.(
    ({properties: {name, street, region, county, locality, label}}: {
      properties: any;
      geometry: { coordinates: any[] };
    }) => ({
      id: name + street + region + county + locality + label,
      name, street, region, county, locality, label
    }),
  );
  console.log('autocomplete result', result);

  return result || [];
}

// searchLocation('Banex', 'Abuja', 'NG').then((res: Array<any>) => {
//   calcDistance(STORE_LOCATION, res[0].location);
// });

// Response: {"error":{"code":2010,"message":"Could not find routable point within a radius of 350.0 meters of specified coordinate 0: -91.8678050 31.1695460.; Could not find routable point within a radius of 350.0 meters of specified coordinate 1: -89.3294675 31.9881085."},"info":{"engine":{"build_date":"2024-05-14T10:47:52Z","version":"8.0.1"},"timestamp":1717846488686}}

export async function getDeliverFeeForLocation(
  address: string,
  city: string,
  country: string,
) {
  // console.log('current shipping deet', shippingDetails);
  const loc = (
    await searchLocation(
      address,
      city,
      // shippingDetails.country,
      'NG',
    )
  )?.[0];

  console.log('got location', loc);

  // if (!loc?.isConfident) return;

  const dist = await calcDistanceFrom(loc?.location);
  console.log('got dist', dist);

  if (!dist) return console.log('unable to calc distance');

  // setDistance(dist);

  const deliveryFee = calculateShippingCost(dist);
  console.log('delivery fee', deliveryFee, 'dist:', dist);
  return deliveryFee;
}

export async function getDeliverDistForLocation(
  address: string,
  city: string,
  country: string,
) {
  // console.log('current shipping deet', shippingDetails);
  const loc = (
    await searchLocation(
      address,
      city,
      // shippingDetails.country,
      'NG',
    )
  )?.[0];

  console.log('got location', loc);

  if (!loc?.isConfident) return;

  const dist = await calcDistanceFrom(loc?.location);
  console.log('got dist', dist);

  if (!dist) return console.log('unable to calc distance');

  return dist;
}
