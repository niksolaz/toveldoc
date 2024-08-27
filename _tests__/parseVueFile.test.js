const path = require("path");
const parseVueFile = require("../src/parseVueFile");
const filePath = path.resolve(__dirname, "../template-vue-test/file_3.vue");

describe("parseVueFile", () => {
  it("should parse a Vue file and get the variables and functions declared in the script tag", () => {
    const result = parseVueFile(filePath);

    expect(result).toEqual({
      variables: [
        { name: "title", comment: null },
        { name: "description", comment: null },
      ],
      functions: [
        { name: "getTitle", comment: "function getTitle" },
        { name: "getDescription", comment: "function getDescription" },
      ],
      computed: [],
      comments: [],
      isSetup: true,
    });
  })
});