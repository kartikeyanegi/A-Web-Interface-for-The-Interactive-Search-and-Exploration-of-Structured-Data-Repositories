import { SearchResponse, SearchResult } from '../../../api/types';
import citi_bike from './citi_bike.json';
import nyc_weather_hourly from './nyc_weather_hourly.json';
import scofftow_cases from './scofftow_cases.json';
import inspections from './inspections.json';
import vehicle_collisions from './vehicle_collisions.json';
import zillowHomeValues from './zillow_home_values.json';
import fipsPopulation from './fips_population.json';
import usPoverty from './us-poverty-2018.json';

const vehicleCollisionsResults: SearchResponse = {
  results: [
    nyc_weather_hourly as SearchResult,
    citi_bike as SearchResult,
    scofftow_cases as SearchResult,
    inspections as SearchResult,
  ],
};

const vehicleCollisionsQuery: SearchResult = vehicle_collisions;

const povertyEstimationResults: SearchResponse = {
  results: [
    zillowHomeValues as SearchResult,
    fipsPopulation as SearchResult,
  ],
};

const usPovertyQuery: SearchResult = usPoverty;

export {
  vehicleCollisionsResults,
  vehicleCollisionsQuery,
  usPovertyQuery,
  povertyEstimationResults,
};
