import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8080/api/",
    headers: {"Content-Type": "application/json",},
});

class EntityApi {
    constructor(entityName) { this.entityName = entityName; }

    list(orderBy) {
        return api.get(`/${this.entityName}`, {params: orderBy ? { orderBy } : undefined}).then(res.res.data);
    }

    get(id) {
        return api.get(`/${this.entityName}/${id}`).then(res => res.data);
    }

    create(data) {
        return api.post(`/${this.entityName}`, data).then(res => res.data);
    }

    update(id, data) {
        return api.put(`/${this.entityName}/${id}`, data).then(res => res.data);
    }

    delete(id) {
        return api.delete(`/${this.entityName}/${id}`).then(res => res.data);
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
    Listing: new EntityApi("listings"),
    Offer: new EntityApi("offers"),
    Showing: new EntityApi("showings"),
    Task: new EntityApi("tasks"),
}

export const integrations = {
    Core: CoreIntegration,
}