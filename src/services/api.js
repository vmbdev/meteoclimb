import settings from "../settings.js";

export class ApiService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getForecast(cityId, dates) {
    const res = await fetch(`${this.endpoint}/forecast/${cityId}/${dates}`);

    return res.json();
  }

  async getCities(name) {
    const res = await fetch(`${this.endpoint}/city/search/${name}`);

    return res.json();
  }
}

export const api = new ApiService(settings.endpoint);