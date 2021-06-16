import { User } from "../models/User";

export default{
  render(user: User){
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      icon: `http://${process.env.HOST}:${process.env.PORT}/uploads/${user.icon}`
    }
  },
  minRender(username: string, icon: string){
    return {
      username,
      icon: `http://${process.env.HOST}:${process.env.PORT}/uploads/${icon}`
    }
  },
  authRender(user: User, token: string){
    return {
      id: user.id,
      username: user.username,
      icon: `http://${process.env.HOST}:${process.env.PORT}/uploads/${user.icon}`,
      token
    }
  }
}