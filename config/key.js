// process.env <-- 노드의 환경 변수가 production이 되었다면 ?
if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  // local 환경 이라면 ?
  module.exports = require("./dev");
}
