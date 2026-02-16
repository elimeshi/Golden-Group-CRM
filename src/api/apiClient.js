import axios from 'axios';

const api = axios.create({
  baseURL: "https://spring-api-718383134893.me-west1.run.app/api",
  headers: { "Content-Type": "application/json", },
});

class EntityApi {
  constructor(entityName) { this.entityName = entityName; }

  async list(orderBy) {
    const res = await api.get(`${this.entityName}`, { params: orderBy ? { orderBy } : undefined });
    return res.data;
  }

  async get(id) {
    const res = await api.get(`${this.entityName}/${id}`);
    return res.data;
  }


  async create(data) {
    const res = await api.post(`${this.entityName}`, data);
    return res.data;
  }

  async update(id, data) {
    const res = await api.put(`${this.entityName}/${id}`, data);
    return res.data;
  }

  async delete(id) {
    const res = await api.delete(`${this.entityName}/${id}`);
    return res.data;
  }
}

const CoreIntegration = {
  async UploadFile({ file }) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      "/integrations/core/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // { file_url: "https://..." }
  },
};


export const entities = {
  Client: new EntityApi("clients"),
  Lead: new EntityApi("leads"),
  Deal: new EntityApi("deals"),
  Commission: new EntityApi("commissions"),
  Campaign: new EntityApi("campaigns"),
  Showing: new EntityApi("showings"),
  Offer: new EntityApi("offers"),
  Task: new EntityApi("tasks"),
  Listing: Object.assign(new EntityApi("listings"), {
    createNormal: (data) => api.post("listings/normal", data).then(res => res.data),
    createTabo: (data) => api.post("listings/tabo", data).then(res => res.data),
  }),
  BuyerRequest: Object.assign(new EntityApi("buyerRequests"), {
    createNormal: (data) => api.post("buyerRequests/normal", data).then(res => res.data),
    createTabo: (data) => api.post("buyerRequests/tabo", data).then(res => res.data),
  })
}

export const integrations = {
  Core: CoreIntegration,
}