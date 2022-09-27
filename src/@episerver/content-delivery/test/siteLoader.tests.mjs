import 'chai/register-should.js';
import { SiteLoader } from "../lib/main.mjs";

const siteLoader = new SiteLoader();

describe('SiteLoader', () => {
  async function GetFirstSite() {
    const sites = await siteLoader.getSites();
    return sites[0];
  }
  describe('getSites', () => {
    it('should get all sites', async () => {
      const sites = await siteLoader.getSites();

      sites.should.not.be.empty;
      sites.length.should.equal(1);
    });

    it('should return id on site', async () => {
      const site = await GetFirstSite();

      site.id.should.not.be.undefined;
    }); 

    it('should return name on site', async () => {
      const site = await GetFirstSite();

      site.name.should.equal("Backend");
    }); 

    it('should return contentRoots on site', async () => {
      const site = await GetFirstSite();

      site.contentRoots.should.not.be.undefined;
    }); 

    it('should return contentRoots', async () => {
      const site = await GetFirstSite();

      site.contentRoots.globalAssetsRoot.should.not.be.undefined;
      site.contentRoots.startPage.should.not.be.undefined;       
    }); 

    it('should return values on contentRoot', async () => {
      const site = await GetFirstSite();
      const contentRoot = site.contentRoots.globalAssetsRoot;

      contentRoot.guidValue.should.not.be.undefined;
      contentRoot.id.should.not.be.undefined;
      contentRoot.url.should.equal("http://localhost:8080/globalassets/");
      contentRoot.workId.should.not.be.undefined;
    }); 

    it('should return languages on sites', async () => {
      const site = await GetFirstSite();

      site.languages.should.not.be.empty;
      site.languages.length.should.equal(2);
      site.languages[0].should.not.be.empty
    }); 

    it('should return values on site languages', async () => {
      const site = await GetFirstSite();
      const language = site.languages[0];

      language.name.should.equal("en");
      language.isMasterLanguage.should.equal(true);
      language.urlSegment.should.equal("en");
    }); 

    it('should return hosts on sites', async () => {
      const site = await GetFirstSite();

      site.hosts.should.not.be.empty;
      site.hosts.length.should.equal(2);
      site.hosts[0].should.not.be.empty
    }); 

    it('should return values on hosts', async () => {
      const site = await GetFirstSite();
      const host = site.hosts[0];

      host.should.not.be.empty;
      host.name.should.equal("localhost:8080");
    }); 
  });

  describe('getSite', () => {
    it('should reject when site doesn\'t exist', async () => {
      await siteLoader.getSite('01010101-0101-0101-0101-010101010101').catch((error) => {
        error.errorCode.should.equal(404);
      });
    });

    it('should reject when invalid id', async () => {
      await siteLoader.getSite('@').catch((error) => {
        error.errorCode.should.equal(400);
      });
    });

    it('should load site when exists', async () => {
      const existingSite = await GetFirstSite();
      const site = await siteLoader.getSite(existingSite.id);

      site.should.not.be.undefined;
    });

    it('should return id on site', async () => {
      const existingSite = await GetFirstSite();
      const site = await siteLoader.getSite(existingSite.id);

      site.id.should.equal(existingSite.id);
    }); 

    it('should return name on site', async () => {
      const existingSite = await GetFirstSite();
      const site = await siteLoader.getSite(existingSite.id);

      site.name.should.equal(existingSite.name);
    }); 

    it('should match editLocation on site', async () => {
      const existingSite = await GetFirstSite();
      const site = await siteLoader.getSite(existingSite.id);

      if (existingSite.editLocation == undefined)
      {
        should.not.exist(site.editLocation)
      }
      else
      {
        site.editLocation.should.equal(existingSite.editLocation);
      }
    }); 

    it('should return contentRoots on site', async () => {
      const existingSite = await GetFirstSite();
      const site = await siteLoader.getSite(existingSite.id);

      site.contentRoots.should.not.be.undefined;
    }); 

    it('should return contentRoots', async () => {
      const existingSite = await GetFirstSite();
      const site = await siteLoader.getSite(existingSite.id);

      site.contentRoots.globalAssetsRoot.should.not.be.undefined;
      site.contentRoots.startPage.should.not.be.undefined;       
    }); 

    it('should return values on contentRoot', async () => {
      const existingSite = await GetFirstSite();
      const existingContentRoot = existingSite.contentRoots.globalAssetsRoot;       
      const site = await siteLoader.getSite(existingSite.id);
      const contentRoot = site.contentRoots.globalAssetsRoot;

      contentRoot.guidValue.should.equal(existingContentRoot.guidValue);
      contentRoot.id.should.equal(existingContentRoot.id);
      contentRoot.url.should.equal(existingContentRoot.url);
      contentRoot.workId.should.equal(existingContentRoot.workId);
    }); 

    it('should return languages on sites', async () => {
      const existingSite = await GetFirstSite();
      const site = await siteLoader.getSite(existingSite.id);

      site.languages.should.not.be.empty;
      site.languages.length.should.equal(existingSite.languages.length);
      site.languages[0].should.not.be.empty
    }); 

    it('should return values on site languages', async () => {
      const existingSite = await GetFirstSite();
      const existingLanguage = existingSite.languages[0];
      const site = await siteLoader.getSite(existingSite.id);
      const language = site.languages[0];

      language.displayName.should.equal(existingLanguage.displayName);
      language.name.should.equal(existingLanguage.name);
      language.isMasterLanguage.should.equal(existingLanguage.isMasterLanguage);
      language.urlSegment.should.equal(existingLanguage.urlSegment);
    }); 

    it('should return hosts on sites', async () => {
      const existingSite = await GetFirstSite();
      const site = await siteLoader.getSite(existingSite.id);

      site.hosts.should.not.be.empty;
      site.hosts.length.should.equal(existingSite.hosts.length);
      site.hosts[0].should.not.be.empty
    }); 

    it('should return values on hosts', async () => {
      const existingSite = await GetFirstSite();
      const existingHost = existingSite.hosts[0];
      const site = await siteLoader.getSite(existingSite.id);
      const host = site.hosts[0];

      host.should.not.be.empty;
      host.name.should.equal(existingHost.name);
      host.type.should.equal(existingHost.type);
    }); 

    it('should match languages on host', async () => {
      const existingSite = await GetFirstSite();
      const existingHost = existingSite.hosts[0];
      const site = await siteLoader.getSite(existingSite.id);
      const host = site.hosts[0];

      if (existingHost.language == undefined)
      {
        should.not.exist(host.language);
      }
      else
      {
        host.language.displayName.should.equal(existingHost.language.displayName);
        host.language.name.should.equal(existingHost.language.name);
      }
    });
  });
});
