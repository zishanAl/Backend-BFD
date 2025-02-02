import sinon from "sinon";
import { getAllFAQs } from "../controllers/faqController.js";
import FAQ from "../models/faqModel.js";

describe("Unit Test: getAllFAQs", () => {
  it("should return FAQs from database", async () => {
    const mockFAQs = [{ question: "What is Node.js?", answer: "A runtime" }];
    sinon.stub(FAQ, "find").returns(Promise.resolve(mockFAQs));

    const req = {};
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getAllFAQs(req, res);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, mockFAQs);

    FAQ.find.restore(); // Restore original behavior
  });
});
