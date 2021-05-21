import 'chai/register-should.js';
import { ContentResolver } from "../lib/main.js";
import { baseUrl } from "test-setup";

const contentResolver = new ContentResolver();
const listPageUrl = baseUrl + '/en/artists/';

describe('ContentResolver', () => {
  describe('resolveContent', () => {
    describe('with default config', () => {
      it('should reject when invalid URL', async () => {
        await contentResolver.resolveContent('@').catch((error) => {
          error.errorMessage.should.not.be.undefined;
        });
      });

      it('should resolve no content when host doesn\'t exist', async () => {
        var result = await contentResolver.resolveContent('http://www.example.com', true);

        result.mode.should.equal('DEFAULT');
        result.status.should.equal('NOTFOUND');
        result.should.have.property('branch').that.is.undefined;
        result.should.have.property('content').that.is.undefined;
        result.should.have.property('remainingPath').that.is.undefined;
        result.startPageId.should.not.be.undefined;
        result.siteId.should.not.be.undefined;
      });

      it('should resolve content when path exist', async () => {
        var result = await contentResolver.resolveContent(listPageUrl, true);

        result.mode.should.equal('DEFAULT');
        result.status.should.equal('RESOLVED');
        result.branch.should.equal('en');
        result.content.should.not.be.undefined;
        result.should.have.property('remainingPath').that.is.undefined;
        result.startPageId.should.not.be.undefined;
        result.siteId.should.not.be.undefined;
      });

      it('should resolve no content when path doesn\'t exist', async () => {
        var result = await contentResolver.resolveContent(listPageUrl + 'greta-van-fleet', true);

        result.mode.should.equal('DEFAULT');
        result.status.should.equal('NOTFOUND');
        result.should.have.property('branch').that.is.undefined;
        result.should.have.property('content').that.is.undefined;
        result.should.have.property('remainingPath').that.is.undefined;
        result.startPageId.should.not.be.undefined;
        result.siteId.should.not.be.undefined;
      });

      it('should resolve nearest parent when path doesn\'t exist and \'matchExact\' false', async () => {
        var result = await contentResolver.resolveContent(listPageUrl + 'greta-van-fleet', false);

        result.mode.should.equal('DEFAULT');
        result.status.should.equal('RESOLVED');
        result.branch.should.equal('en');
        result.content.should.not.be.undefined;
        result.remainingPath.should.equal('/greta-van-fleet');
        result.startPageId.should.not.be.undefined;
        result.siteId.should.not.be.undefined;
      });

      it('should resolve content when path exist in edit mode', async () => {
        var result = await contentResolver.resolveContent(baseUrl + '/EPiServer/CMS/en/7540f704c5fe4d779dee7fbe77bc3b6f,,6/?epieditmode=true', true);

        result.mode.should.equal('EDIT');
        result.status.should.equal('RESOLVED');
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

        result.content.mainContentArea[0].should.have.property('contentLink').which.has.not.property('expanded');
      });

      it('should only select \'title\' property when specified', async () => {
        var result = await contentResolver.resolveContent(baseUrl, true, { select: ['title'] });

        result.content.should.have.property('title');
        result.content.should.not.have.property('mainContentArea');
      });

      it('should only expand \'mainContentArea\' property when specified', async () => {
        var result = await contentResolver.resolveContent(baseUrl, true, { expand: ['mainContentArea'] });

        result.content.mainContentArea[0].should.have.property('contentLink').with.property('expanded');
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

        result.content.mainContentArea[0].should.have.property('contentLink').with.property('expanded');
      });
    });
  });
});
