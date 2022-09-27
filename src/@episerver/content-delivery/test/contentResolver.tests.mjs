import 'chai/register-should.js';
import { ContentResolver, ResolvedContentStatus, ContextMode } from "../lib/main.mjs";
import { baseUrl } from "test-setup";

const contentResolver = new ContentResolver();
const listPageUrl = baseUrl + '/en/artists/';
const protectedPageUrl = baseUrl + '/en/protected/';

describe('ContentResolver', () => {
  describe('resolveContent', () => {
    describe('with default config', () => {
      it('should reject when invalid URL', async () => {
        await contentResolver.resolveContent('@').catch((error) => {
          error.errorMessage.should.not.be.undefined;
        });
      });

      it('should not resolve content when host doesn\'t exist', async () => {
        var result = await contentResolver.resolveContent('http://www.example.com', true);

        result.mode.should.equal(ContextMode.Default);
        result.status.should.equal(ResolvedContentStatus.NotFound);
        result.should.have.property('branch').that.is.undefined;
        result.should.have.property('content').that.is.undefined;
        result.should.have.property('remainingPath').that.is.undefined;
        result.startPageId.should.not.be.undefined;
        result.siteId.should.not.be.undefined;
      });

      it('should resolve content when path exist', async () => {
        var result = await contentResolver.resolveContent(listPageUrl, true);

        result.mode.should.equal(ContextMode.Default);
        result.status.should.equal(ResolvedContentStatus.Resolved);
        result.branch.should.equal('en');
        result.content.should.not.be.undefined;
        result.should.have.property('remainingPath').that.is.undefined;
        result.startPageId.should.not.be.undefined;
        result.siteId.should.not.be.undefined;
      });

      it('should not resolve content when path doesn\'t exist', async () => {
        var result = await contentResolver.resolveContent(listPageUrl + 'greta-van-fleet', true);

        result.mode.should.equal(ContextMode.Default);
        result.status.should.equal(ResolvedContentStatus.NotFound);
        result.should.have.property('branch').that.is.undefined;
        result.should.have.property('content').that.is.undefined;
        result.should.have.property('remainingPath').that.is.undefined;
        result.startPageId.should.not.be.undefined;
        result.siteId.should.not.be.undefined;
      });

      it('should resolve nearest parent when path doesn\'t exist and \'matchExact\' false', async () => {
        var result = await contentResolver.resolveContent(listPageUrl + 'greta-van-fleet', false);

        result.mode.should.equal(ContextMode.Default);
        result.status.should.equal(ResolvedContentStatus.Resolved);
        result.branch.should.equal('en');
        result.content.should.not.be.undefined;
        result.remainingPath.should.equal('/greta-van-fleet');
        result.startPageId.should.not.be.undefined;
        result.siteId.should.not.be.undefined;
      });

      it('should resolve content when path exist in edit mode', async () => {
        var result = await contentResolver.resolveContent(baseUrl + '/EPiServer/CMS/Content/en/artists,,6/?epieditmode=true', true);

        result.mode.should.equal(ContextMode.Edit);
        result.status.should.equal(ResolvedContentStatus.Resolved);
        result.branch.should.equal('en');
        result.content.should.not.be.undefined;
        result.should.have.property('remainingPath').that.is.undefined;
        result.startPageId.should.not.be.undefined;
        result.siteId.should.not.be.undefined;
      });

      it('should select all non-meta properties', async () => {
        var result = await contentResolver.resolveContent(baseUrl, true);

        result.content.should.have.property('title');
        result.content.should.have.property('mainContentArea');
      });

      it('should not expand properties', async () => {
        var result = await contentResolver.resolveContent(baseUrl, true);

        result.content.mainContentArea[0].should.have.property('contentLink').with.property('expanded').that.is.null;
      });

      it('should only select \'title\' property when specified', async () => {
        var result = await contentResolver.resolveContent(baseUrl, true, { select: ['title'] });

        result.content.should.have.property('title');
        result.content.should.not.have.property('mainContentArea');
      });

      it('should only expand \'mainContentArea\' property when specified', async () => {
        var result = await contentResolver.resolveContent(baseUrl, true, { expand: ['mainContentArea'] });

        result.content.mainContentArea[0].should.have.property('contentLink').with.property('expanded').that.is.not.null;
      });
    });

    describe('with \'selectAllProperties\' false', () => {
      it('should not select any non-meta property', async () => {
        const cr = new ContentResolver({ selectAllProperties: false });
        const result = await cr.resolveContent(baseUrl, true);

        result.content.should.not.have.property('title');
        result.content.should.not.have.property('mainContentArea');
      });
    });

    describe('with \'expandAllProperties\' true', () => {
      it('should expand properties', async () => {
        const cr = new ContentResolver({ expandAllProperties: true });
        const result = await cr.resolveContent(baseUrl);

        result.content.mainContentArea[0].should.have.property('contentLink').with.property('expanded').that.is.not.null;
      });
    });

    describe('with authentication', () => {
      it('should not resolve content when anonymous user', async () => {
        var result = await contentResolver.resolveContent(protectedPageUrl, true);

        result.status.should.equal(ResolvedContentStatus.Unauthorized);
      });

      it('should not resolve content when user doesn\'t have access', async () => {
        const cr = new ContentResolver({ 
          getAccessToken: () => Promise.resolve('alice')
        });

        var result = await cr.resolveContent(protectedPageUrl , true);

        result.status.should.equal(ResolvedContentStatus.AccessDenied);
      });

      it('should resolve content when user has access', async () => {
        const cr = new ContentResolver({ 
          getAccessToken: () => Promise.resolve('bob')
        });

        var result = await cr.resolveContent(protectedPageUrl, true);

        result.content.should.not.be.undefined;
        result.status.should.equal(ResolvedContentStatus.Resolved);
      });
    });
  });

  describe("with custom headers", () => {
    it("should pass custom headers in request when applied", async () => {
      const customHeaderValue = "CustomHeaderValue";
      var cr = new ContentResolver({
        getHeaders: () =>
          Promise.resolve({ CustomHeaderName: customHeaderValue }),
      });
      var result = await cr.resolveContent(baseUrl, true);

      result.content.customHeader.should.equal(customHeaderValue);
    });
  });
});
