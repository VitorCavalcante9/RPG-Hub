import { Character } from "../models/Character";
import { Scenario } from "../models/Scenario";
import { ObjectItem } from "../models/Object";

export default{
  render(characters: Character[], scenarios: Scenario[], objects: ObjectItem[]){
    
    const formattedCharacters = characters.map(character => {
      return {
        id: character.id,
        name: character.name,
        icon: character.icon?.url ? character.icon?.url : '',
        inventory: character.inventory,
        status: character.status,
        skills: character.skills,
      }
    });

    const formattedScenarios = scenarios.map(scenario => {
      return {
        id: scenario.id,
        name: scenario.name,
        image: scenario.image?.url ? scenario.image?.url : ''
      }
    });

    const formattedObjects = objects.map(objectItem => {
      return {
        id: objectItem.id,
        name: objectItem.name,
        image: objectItem.image?.url ? objectItem.image?.url : ''
      }
    })

    return{
      characters: formattedCharacters,
      scenarios: formattedScenarios,
      objects: formattedObjects,
    }
  }
}