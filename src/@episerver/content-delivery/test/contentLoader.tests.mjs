import 'chai/register-should.js';
import { ContentLoader } from "../lib/main.mjs";

const contentLoader = new ContentLoader();
const rootPageId = 1;
const startPageId = 5;
const listPageId = 6;

describe('ContentLoader', () => {
  describe('getContent', () => {
    describe('with default config', () => {
      it('should reject when content doesn\'t exist', async () => {
        await contentLoader.getContent(999).catch((error) => {
          error.errorCode.should.equal(404);
        });
      });

      it('should reject when invalid id', async () => {
        await contentLoader.getContent('').catch((error) => {
          error.errorCode.should.equal(400);
        });
      });

      it('should reject when invalid id', async () => {
        await contentLoader.getContent('@').catch((error) => {
          error.errorCode.should.equal(404);
        });
      });

      it('should reject when invalid id', async () => {
        await contentLoader.getContent('<b>html</b>').catch((error) => {
          error.errorCode.should.equal(404);
        });
      });

      it('should load content when exists', async () => {
        const content = await contentLoader.getContent(startPageId);

        content.should.not.be.undefined;
      });

      it('should select all non-meta properties', async () => {
        const content = await contentLoader.getContent(startPageId);

        content.should.have.property('title');
        content.should.have.property('mainContentArea');
      });

      it('should not expand properties', async () => {
        const content = await contentLoader.getContent(startPageId);

        content.mainContentArea[0].should.have.property('contentLink').with.property('expanded').that.is.null;
      });

      it('should load default branch when non specified', async () => {
        const content = await contentLoader.getContent(startPageId);

        content.language.name.should.equal('en');
      });

      it('should load \'en\' branch when specified', async () => {
        const content = await contentLoader.getContent(startPageId, { branch: 'en' });

        content.language.name.should.equal('en');
      });

      it('should load \'sv\' branch when specified', async () => {
        const content = await contentLoader.getContent(startPageId, { branch: 'sv' });

        content.language.name.should.equal('sv');
      });

      it('should only select \'title\' property when specified', async () => {
        const content = await contentLoader.getContent(startPageId, { select: ['title'] });

        content.should.have.property('title');
        content.should.not.have.property('mainContentArea');
      });

      it('should only expand \'mainContentArea\' property when specified', async () => {
        const content = await contentLoader.getContent(startPageId, { expand: ['mainContentArea'] });

        content.mainContentArea[0].should.have.property('contentLink').with.property('expanded').that.is.not.null;
      });
    });

    describe('with \'selectAllProperties\' false', () => {
      it('should not select any non-meta property', async () => {
        const cl = new ContentLoader({ selectAllProperties: false });
        const content = await cl.getContent(startPageId);

        content.should.not.have.property('title');
        content.should.not.have.property('mainContentArea');
      });
    });

    describe('with \'expandAllProperties\' true', () => {
      it('should expand properties', async () => {
        const cl = new ContentLoader({ expandAllProperties: true });
        const content = await cl.getContent(startPageId);

        content.mainContentArea[0].should.have.property('contentLink').with.property('expanded').that.is.not.null;
      });
    });
  });

  describe('getChildren', () => {
    describe('with default config', () => {
      it('should return array of content when parent exists and has children', async () => {
        const children = await contentLoader.getChildren(listPageId, { branch: 'en' });

        children.should.not.be.empty;
      });

      it('should return empty array when parent exists but has no children', async () => {
        const children = await contentLoader.getChildren(10, { branch: 'en' });

        children.should.be.empty;
      });

      it('should reject when parent doesn\'t exist', async () => {
        await contentLoader.getChildren(999, { branch: 'en' }).catch((error) => {
          error.errorCode.should.equal(404);
        });
      });

      it('should reject when parent is invalid', async () => {
        await contentLoader.getChildren('', { branch: 'en' }).catch((error) => {
          error.errorCode.should.equal(404);
        });
      });

      it('should reject when parent is invalid', async () => {
        await contentLoader.getChildren('@', { branch: 'en' }).catch((error) => {
          error.errorCode.should.equal(404);
        });
      });

      it('should reject when parent is invalid', async () => {
        await contentLoader.getChildren('<b>html</b>', { branch: 'en' }).catch((error) => {
          error.errorCode.should.equal(404);
        });
      });

      it('should load \'en\' branch when specified', async () => {
        const children = await contentLoader.getChildren(startPageId, { branch: 'en' });

        children[0].language.name.should.equal('en');
      });

      it('should load \'sv\' branch when specified', async () => {
        const children = await contentLoader.getChildren(startPageId, { branch: 'sv' });

        children[0].language.name.should.equal('sv');
      });

      it('should only select \'title\' property when specified', async () => {
        const children = await contentLoader.getChildren(rootPageId, { branch: 'en', select: ['title'] });

        children[3].should.have.property('title');
        children[3].should.not.have.property('mainContentArea');
      });

      it('should only expand \'mainContentArea\' property when specified', async () => {
        const children = await contentLoader.getChildren(rootPageId, { branch: 'en', expand: ['mainContentArea'] });

        children[3].mainContentArea[0].should.have.property('contentLink').with.property('expanded').that.is.not.null;
      });
    });

    describe('with \'selectAllProperties\' false', () => {
      it('should not select any non-meta property', async () => {
        const cl = new ContentLoader({ selectAllProperties: false });
        const children = await cl.getChildren(rootPageId, { branch: 'en' });

        children[3].should.not.have.property('title');
        children[3].should.not.have.property('mainContentArea');
      });
    });

    describe('with \'expandAllProperties\' true', () => {
      it('should expand properties', async () => {
        const cl = new ContentLoader({ expandAllProperties: true });
        const children = await cl.getChildren(rootPageId, { branch: 'en' });

        children[3].mainContentArea[0].should.have.property('contentLink').with.property('expanded').that.is.not.null;
      });
    });

    describe('with top', () => {
      it('should reject when size larger than 100', async () => {
        await contentLoader.getChildren(listPageId, { branch: 'en', top: 101 }).catch((error) => {
          error.errorCode.should.equal(400);
        });
      });

      it('should return number of content items as specified', async () => {
        const children = await contentLoader.getChildren(listPageId, { branch: 'en', top: 3 });

        children.items.length.should.equal(3);
      });

      it('should return a continuation token', async () => {
        const children = await contentLoader.getChildren(listPageId, { branch: 'en', top: 3 });

        children.continuationToken.should.not.be.undefined;
      });

      it('should return next set of content items when using the continuation token', async () => {
        const first = await contentLoader.getChildren(listPageId, { branch: 'en', top: 3 });
        const second = await contentLoader.getChildren(listPageId, { branch: 'en', continuationToken: first.continuationToken });

        first.items.length.should.equal(3);
        second.items.length.should.equal(3);
        first.items.should.not.have.deep.members(second.items);
      });

      it('should reject when invalid continuation token', async () => {
        await contentLoader.getChildren(listPageId, { continuationToken: 'yadayada' }).catch((error) => {
          error.errorCode.should.equal(400);
        });
      });
    });
  });

  describe('getAncestors', () => {
    describe('with default config', () => {
      it('should return array of content when content exists and has ancestors', async () => {
        const ancestors = await contentLoader.getAncestors(listPageId);

        ancestors.should.not.be.empty;
        ancestors.length.should.equal(2);
      });

      it('should return empty array when content exists but has no ancestors', async () => {
        const ancestors = await contentLoader.getAncestors(rootPageId);

        ancestors.should.be.empty;
      });

      it('should reject when content doesn\'t exist', async () => {
        await contentLoader.getAncestors(999).catch((error) => {
          error.errorCode.should.equal(404);
        });
      });

      it('should reject when parent is invalid', async () => {
        await contentLoader.getAncestors('').catch((error) => {
          error.errorCode.should.equal(404);
        });
      });

      it('should reject when parent is invalid', async () => {
        await contentLoader.getAncestors('@').catch((error) => {
          error.errorCode.should.equal(404);
        });
      });

      it('should reject when parent is invalid', async () => {
        await contentLoader.getAncestors('<b>html</b>').catch((error) => {
          error.errorCode.should.equal(404);
        });
      });

      it('should load default branch when non specified', async () => {
        const ancestors = await contentLoader.getAncestors(listPageId);

        ancestors[0].language.name.should.equal('en');
      });

      it('should load \'en\' branch when specified', async () => {
        const ancestors = await contentLoader.getAncestors(listPageId, { branch: 'en' });

        ancestors[0].language.name.should.equal('en');
      });

      it('should load \'sv\' branch when specified', async () => {
        const ancestors = await contentLoader.getAncestors(listPageId, { branch: 'sv' });

        ancestors[0].language.name.should.equal('sv');
      });

      it('should only select \'title\' property when specified', async () => {
        const ancestors = await contentLoader.getAncestors(listPageId, { select: ['title'] });

        ancestors[0].should.have.property('title');
        ancestors[0].should.not.have.property('mainContentArea');
      });

      it('should only expand \'mainContentArea\' property when specified', async () => {
        const ancestors = await contentLoader.getAncestors(listPageId, { expand: ['mainContentArea'] });

        ancestors[0].mainContentArea[0].should.have.property('contentLink').with.property('expanded').that.is.not.null;
      });
    });

    describe('with \'selectAllProperties\' false', () => {
      it('should not select any non-meta property', async () => {
        const cl = new ContentLoader({ selectAllProperties: false });
        const ancestors = await cl.getAncestors(listPageId);

        ancestors[0].should.not.have.property('title');
        ancestors[0].should.not.have.property('mainContentArea');
      });
    });

    describe('with \'expandAllProperties\' true', () => {
      it('should expand properties', async () => {
        const cl = new ContentLoader({ expandAllProperties: true });
        const ancestors = await cl.getAncestors(listPageId);

        ancestors[0].mainContentArea[0].should.have.property('contentLink').with.property('expanded').that.is.not.null;
      });
    });
  });

  describe("with custom headers", () => {
    it("should pass custom headers in request when applied", async () => {
      const customHeaderValue = "CustomHeaderValue";
      var cl = new ContentLoader({
        getHeaders: () =>
          Promise.resolve({ CustomHeaderName: customHeaderValue }),
      });
      const content = await cl.getContent(startPageId);

      content.customHeader.should.equal(customHeaderValue);
    });
  });
});
