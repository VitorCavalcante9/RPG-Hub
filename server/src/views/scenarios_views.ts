import { Scenario } from "../models/Scenario";

export default{
  render(scenario: Scenario){
    return{
      id: scenario.id,
      name: scenario.name,
      image: `http://${process.env.HOST}:${process.env.PORT}/uploads/${scenario.image}`
    }
  },
  renderMany(scenarios: Scenario[]){
    return scenarios.map(scenario => this.render(scenario));
  }
}