import { Rpg } from "../models/Rpg";
import { RpgParticipants } from "../models/RpgParticipants";
import { User } from "../models/User";

export default{
  admin(rpg: Rpg){
    const characters = rpg.characters.map(character => {
      return {
        id: character.id,
        name: character.name,
        icon: character.icon
      }
    })

    const scenarios = rpg.scenarios.map(scenario => {
      return {
        id: scenario.id,
        name: scenario.name,
        image: scenario.image
      }
    })

    const objects = rpg.objects.map(object => {
      return {
        id: object.id,
        name: object.name,
        image: object.image
      }
    })

    return{
      name: rpg.name,
      icon: rpg.icon,
      characters,
      scenarios,
      objects
    }
  },
  participant(rpg: RpgParticipants){
    const rpg_content = rpg.rpg;
    let character_content = {
      name: null as any,
      status: null as any,
      inventory: null as any,
      skills: null as any,
    };

    if(rpg.character){
      character_content.name = rpg.character.name;
      character_content.status = rpg.character.status;
      character_content.inventory = rpg.character.inventory;
      character_content.skills = rpg.character.skills;
    }

    return{
      name: rpg_content.name,
      icon: rpg_content.icon,
      admin: rpg_content.user.username,
      character: {
        name: character_content.name,
        status: character_content.status,
        inventory: character_content.inventory,
        skills: character_content.skills
      }
    }
  }
}