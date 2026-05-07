import { createPlayer } from "./Players/CreatePlayer.js";
import { loginPlayer } from "./Players/LoginPlayer.js";

class PlayersController {
  createPlayer = createPlayer;
  loginPlayer = loginPlayer;
}   

export default new PlayersController();