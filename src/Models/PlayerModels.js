import Player from "../Schemas/Players.js";

class PlayerModel {
  async createPlayer(data) {
    return await Player.create(data);
  }

  async exsitPlayer(UserName) {
    return await Player.findOne({ UserName });
  }

  async searchId(id) {
    return await Player.findById(id);
  }


  async updateCredits(playerId, amount) {
    return await Player.findByIdAndUpdate(
      playerId,
      { $inc: { credits: amount } },
      { returnDocument: "after" },
    );
  }

  async getAllPlayers() {
    return await Player.find();
  }
}
export default new PlayerModel();
