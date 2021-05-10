
const rollDices = (min: number, dice: number) => {
  return min + Math.floor(Math.random() * (dice-min + 1));
}

export default rollDices;