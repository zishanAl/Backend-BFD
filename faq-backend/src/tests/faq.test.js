import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js"; // Import your Express app

chai.use(chaiHttp);
const { expect } = chai;

describe("FAQ API Tests", () => {
  
  it("should GET all FAQs", (done) => {
    chai.request(app)
      .get("/api/faqs") // Change this if your route is different
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should CREATE a new FAQ", (done) => {
    chai.request(app)
      .post("/api/faqs")
      .send({ question: "What is Node.js?", answer: "A JavaScript runtime" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("question", "What is Node.js?");
        done();
      });
  });

});
