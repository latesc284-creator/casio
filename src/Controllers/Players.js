import { createPlayer } from "./Players/CreatePlayer.js";
import { loginPlayer } from "./Players/LoginPlayer.js";
import { dataUser } from "./Players/dataUser.js";

class PlayersController {
  createPlayer = createPlayer;
  loginPlayer = loginPlayer;
  dataUser = dataUser;
}   

export default new PlayersController();