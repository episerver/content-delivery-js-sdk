import { ContentDeliveryConfig } from './config.mjs';
import { SiteDefinition } from './models.mjs';
/**
 * Type describing a site loader error.
 *
 * @typeparam T - Type of the additional error data.
 */
export declare type SiteLoaderError = {
    /**
     * HTTP status code.
     */
    errorCode?: number;
    /**
     * Message describing the error.
     */
    errorMessage?: string;
};
/**
 * Class for loading sites.
 */
export declare class SiteLoader {
    #private;
    /**
     * Constructs an instance of SiteLoader.
     *
     * @param config - Optional configuration to use. The configuration is
     * combined with the default configuration specified in defaultConfig.
     */
    constructor(config?: Partial<ContentDeliveryConfig>);
    /**
     * Get site by an identifier.
     *
     * @param id - Identifier of the site.
     * @returns A promise with a SiteDefinition if the site was found, otherwise rejected with a SiteLoaderError.
     */
    getSite(id: string): Promise<SiteDefinition>;
    /**
   * List all sites.
   *
   * @returns A promise with an array of SiteDefinition. Otherwise rejected with a SiteLoaderError.
   */
    getSites(): Promise<Array<SiteDefinition>>;
}
//# sourceMappingURL=siteLoader.d.mts.map