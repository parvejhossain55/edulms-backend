const transactionId = () => {
  const characters = "ABCDEFGH012345678IJKLMNOPQRST01238911232UVWXYZ0123456";
  let transactionId = "";
  for (let i = 0; i < 12; i++) {
    transactionId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return transactionId;
};

module.exports = transactionId;
