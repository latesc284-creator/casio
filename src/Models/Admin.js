import Admin from "../Schemas/AdminPlataform.js"

class AdminModel {
  async createAdmin(data) {
    return await Admin.create(data);
  }
  async existeAdmin(email) {
    return await Admin.findOne({ email });
  }
  async searchId(id) {
    return await Admin.findById(id);
  }

}

export default new AdminModel();