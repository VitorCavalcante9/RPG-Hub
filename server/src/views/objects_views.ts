import { ObjectItem } from "../models/Object";

export default{
  render(objectItem: ObjectItem){
    return{
      id: objectItem.id,
      name: objectItem.name,
      image: `http://${process.env.HOST}:${process.env.PORT}/uploads/${objectItem.image}`
    }
  },
  renderMany(objectItems: ObjectItem[]){
    return objectItems.map(objectItem => this.render(objectItem));
  }
}