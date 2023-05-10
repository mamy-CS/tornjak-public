import { ArgumentService } from './ArgumentService';

let fetchedData: any = null;

export const fetchData = async () => {
  fetchedData = await ArgumentService.getSomeDataFromApi();
};

export const getData = () => {
  return fetchedData;
};