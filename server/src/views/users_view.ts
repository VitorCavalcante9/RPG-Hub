import { User } from "../models/User";

export default{
  render(user: User){
    return{
      id: user.id,
      username: user.username,
      email: user.email,
      icon: `http://${process.env.HOST}:${process.env.PORT}/uploads/${user.icon}`
    }
  }
}