import { Rpg } from "../models/Rpg";
import { RpgParticipants } from "../models/RpgParticipants";
import { User } from "../models/User";

export default{
  admin(rpg: Rpg){
    const characters = rpg.characters.map(character => {
      return {
        id: character.id,
        name: character.name,
        icon: character.icon?.url ? character.icon?.url : ''
      }
    })

    const scenarios = rpg.scenarios.map(scenario => {
      return {
        id: scenario.id,
        name: scenario.name,
        image: scenario.image?.url ? scenario.image?.url : ''
      }
    })

    const objects = rpg.objects.map(object => {
      return {
        id: object.id,
        name: object.name,
        image: object.image?.url ? object.image?.url : ''
      }
    })

    const participants = rpg.participants.map(participant => {
      return{
        id: participant.user.id,
        username: participant.user.username,
        icon: participant.user.icon?.url
      }
    })

    return{
      name: rpg.name,
      icon: rpg.icon?.url ? rpg.icon?.url : '',
      characters,
      scenarios,
      objects,
      participants
    }
  },
  participant(rpg: RpgParticipants){
    const rpg_content = rpg.rpg;

    let character_content = {
      id: null as any,
      name: null as any,
      icon: null as any,
      status: null as any,
      inventory: null as any,
      skills: null as any,
      permission: null as any,
    };

    if(rpg.character){
      character_content.id = rpg.character.id;
      character_content.name = rpg.character.name;
      character_content.icon = rpg.character.icon;
      character_content.status = rpg.character.status;
      character_content.inventory = rpg.character.inventory;
      character_content.skills = rpg.character.skills;
      character_content.permission = rpg.character.permission;
    }

    let participants = rpg_content.participants.map(participant => {
      return{
        id: participant.user.id,
        username: participant.user.username,
        icon: participant.user.icon?.url
      }
    }) 

    participants.push({
      id: rpg_content.user_id,
      username: rpg_content.user.username,
      icon: rpg_content.user.icon?.url
    })

    return{
      name: rpg_content.name,
      icon: rpg_content.icon?.url ? rpg_content.icon?.url : '',
      admin: rpg_content.user.username,
      character: {
        id: character_content.id,
        name: character_content.name,
        icon: character_content.icon?.url ? character_content.icon?.url : '',
        status: character_content.status,
        inventory: character_content.inventory,
        skills: character_content.skills,
        limitOfPoints: rpg_content.sheet.limitOfPoints,
        permission: character_content.permission
      },
      participants
    }
  }
}