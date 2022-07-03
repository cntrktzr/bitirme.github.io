const mongoose = require("mongoose");


mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Veritabanına bağlanıldı."))
  .catch((hata) => console.log(`Veritabanına bağlanılamadı. ${hata}`));
