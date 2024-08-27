const { documentVueFile } = require('../src/index');

describe('documentVueFile', () => {
    it('should return undefined if documentation is not found', () => {
        const result = documentVueFile('template-vue-test/file_2.vue');
        expect(result).toBeUndefined();
    });

    it('should create a markdown file with the documentation', () => {
        const result = documentVueFile('template-vue-test/file_1.vue');
        expect(result).toBeUndefined();
    });
});
